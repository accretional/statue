<!--
This is a Svelte component from svelte-easy-crop

Website: [svelte.dev/playground/5d77c734e1af424bac9e09a844c96649](https://svelte.dev/playground/5d77c734e1af424bac9e09a844c96649?version=5.49.1)
GitHub Repository: [ValentinH/svelte-easy-crop](https://github.com/ValentinH/svelte-easy-crop)

All components in this directory are sourced from the svelte-easy-crop project by ValentinH. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import type { Action } from 'svelte/action'
  import type { HTMLImgAttributes } from 'svelte/elements'

  // --- Types ---
  type CropShape = 'rect' | 'round'

  interface Size {
    width: number
    height: number
  }

  interface ImageSize {
    width: number
    height: number
    naturalWidth: number
    naturalHeight: number
  }

  interface Point {
    x: number
    y: number
  }

  interface CropArea {
    x: number
    y: number
    width: number
    height: number
  }

  type OnCropCompleteEvent = { percent: CropArea; pixels: CropArea }
  type OnCropComplete = (event: OnCropCompleteEvent) => void

  type CropperProps = {
    image: string
    crop: Point
    zoom: number
    aspect: number
    minZoom: number
    maxZoom: number
    cropSize: Size | null
    cropShape: CropShape
    showGrid: boolean
    zoomSpeed: number
    crossOrigin: HTMLImgAttributes['crossorigin']
    restrictPosition: boolean
    tabindex: number | undefined
    oncropcomplete: OnCropComplete
  }

  // --- Helpers ---
  function getCropSize(imgWidth: number, imgHeight: number, aspect: number) {
    if (imgWidth >= imgHeight * aspect) {
      return { width: imgHeight * aspect, height: imgHeight }
    }
    return { width: imgWidth, height: imgWidth / aspect }
  }

  function restrictPositionCoord(
    position: number,
    imageSize: number,
    cropSize: number,
    zoom: number
  ) {
    let maxPosition = (imageSize * zoom) / 2 - cropSize / 2
    if (zoom < 1) {
      maxPosition = cropSize / 2 - (imageSize * zoom) / 2
    }
    return Math.min(maxPosition, Math.max(position, -maxPosition))
  }

  function clampPosition(position: Point, imgSize: Size, cropSz: Size, zoom: number): Point {
    return {
      x: restrictPositionCoord(position.x, imgSize.width, cropSz.width, zoom),
      y: restrictPositionCoord(position.y, imgSize.height, cropSz.height, zoom),
    }
  }

  function getDistanceBetweenPoints(pointA: Point, pointB: Point) {
    return Math.sqrt(Math.pow(pointA.y - pointB.y, 2) + Math.pow(pointA.x - pointB.x, 2))
  }

  function limitArea(max: number, value: number, shouldRound = false) {
    const v = shouldRound ? Math.round(value) : value
    return Math.min(max, Math.max(0, v))
  }

  function noOp(_max: number, value: number) {
    return value
  }

  function computeCroppedArea(
    cropPos: Point,
    imgSize: ImageSize,
    cropSz: Size,
    aspect: number,
    zoom: number,
    shouldRestrict = true
  ) {
    const limitAreaFn = shouldRestrict ? limitArea : noOp
    const croppedAreaPercentages = {
      x: limitAreaFn(
        100,
        (((imgSize.width - cropSz.width / zoom) / 2 - cropPos.x / zoom) / imgSize.width) * 100
      ),
      y: limitAreaFn(
        100,
        (((imgSize.height - cropSz.height / zoom) / 2 - cropPos.y / zoom) / imgSize.height) * 100
      ),
      width: limitAreaFn(100, ((cropSz.width / imgSize.width) * 100) / zoom),
      height: limitAreaFn(100, ((cropSz.height / imgSize.height) * 100) / zoom),
    }

    const widthInPixels = limitAreaFn(
      imgSize.naturalWidth,
      (croppedAreaPercentages.width * imgSize.naturalWidth) / 100,
      true
    )
    const heightInPixels = limitAreaFn(
      imgSize.naturalHeight,
      (croppedAreaPercentages.height * imgSize.naturalHeight) / 100,
      true
    )
    const isImgWiderThanHigh = imgSize.naturalWidth >= imgSize.naturalHeight * aspect

    const sizePixels = isImgWiderThanHigh
      ? { width: Math.round(heightInPixels * aspect), height: heightInPixels }
      : { width: widthInPixels, height: Math.round(widthInPixels / aspect) }

    const croppedAreaPixels = {
      ...sizePixels,
      x: limitAreaFn(
        imgSize.naturalWidth - sizePixels.width,
        (croppedAreaPercentages.x * imgSize.naturalWidth) / 100,
        true
      ),
      y: limitAreaFn(
        imgSize.naturalHeight - sizePixels.height,
        (croppedAreaPercentages.y * imgSize.naturalHeight) / 100,
        true
      ),
    }
    return { croppedAreaPercentages, croppedAreaPixels }
  }

  function getCenter(a: Point, b: Point) {
    return { x: (b.x + a.x) / 2, y: (b.y + a.y) / 2 }
  }

  // --- Component ---
  let {
    image,
    crop = $bindable({ x: 0, y: 0 }),
    zoom = $bindable(1),
    minZoom = $bindable(1),
    maxZoom = $bindable(3),
    aspect = 4 / 3,
    cropSize = null,
    cropShape = 'rect',
    showGrid = true,
    zoomSpeed = 1,
    crossOrigin = null,
    restrictPosition = true,
    tabindex = undefined,
    oncropcomplete,
  }: Partial<CropperProps> = $props()

  let cropperSize = $state<Size | null>(null)
  let imageSize = $state<ImageSize>({ width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 })
  let containerEl = $state<HTMLDivElement | null>(null)
  let containerRect = $state<DOMRect | null>(null)
  let imgEl = $state<HTMLImageElement | null>(null)
  let dragStartPosition = $state<Point>({ x: 0, y: 0 })
  let dragStartCrop = $state<Point>({ x: 0, y: 0 })
  let lastPinchDistance = $state(0)
  let rafDragTimeout = $state<number | null>(null)
  let rafZoomTimeout = $state<number | null>(null)

  onMount(() => {
    // when rendered via SSR, the image can already be loaded and its onLoad callback will never be called
    if (imgEl && imgEl.complete) {
      onImgLoad()
    }
    if (containerEl) {
      containerEl.addEventListener('gesturestart', preventZoomSafari)
      containerEl.addEventListener('gesturechange', preventZoomSafari)
    }
  })

  onDestroy(() => {
    if (containerEl) {
      containerEl.removeEventListener('gesturestart', preventZoomSafari)
      containerEl.removeEventListener('gesturechange', preventZoomSafari)
    }
    cleanEvents()
  })

  // this is to prevent Safari on iOS >= 10 to zoom the page
  const preventZoomSafari = (e: Event) => e.preventDefault()

  const cleanEvents = () => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onDragStopped)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onDragStopped)
    }
  }

  const onImgLoad = () => {
    computeSizes()
    emitCropData()
  }

  const getAspect = () => {
    if (cropSize) {
      return cropSize.width / cropSize.height
    }
    return aspect
  }

  const computeSizes = () => {
    if (imgEl) {
      imageSize = {
        width: imgEl.width,
        height: imgEl.height,
        naturalWidth: imgEl.naturalWidth,
        naturalHeight: imgEl.naturalHeight,
      }
      cropperSize = cropSize ? cropSize : getCropSize(imgEl.width, imgEl.height, aspect)
    }
    if (containerEl) {
      containerRect = containerEl.getBoundingClientRect()
    }
  }

  const getMousePoint = (e: MouseEvent) => ({
    x: Number(e.clientX),
    y: Number(e.clientY),
  })

  const getTouchPoint = (touch: TouchEvent['touches'][0]) => ({
    x: Number(touch.clientX),
    y: Number(touch.clientY),
  })

  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onDragStopped)
    onDragStart(getMousePoint(e))
  }

  const onMouseMove = (e: MouseEvent) => onDrag(getMousePoint(e))

  const onTouchStart = (e: TouchEvent) => {
    e.preventDefault()
    document.addEventListener('touchmove', onTouchMove, { passive: false }) // iOS 11 now defaults to passive: true
    document.addEventListener('touchend', onDragStopped)

    if (e.touches.length === 2) {
      onPinchStart(e)
    } else if (e.touches.length === 1) {
      onDragStart(getTouchPoint(e.touches[0]))
    }
  }

  const onTouchMove = (e: TouchEvent) => {
    // Prevent whole page from scrolling on iOS.
    e.preventDefault()
    if (e.touches.length === 2) {
      onPinchMove(e)
    } else if (e.touches.length === 1) {
      onDrag(getTouchPoint(e.touches[0]))
    }
  }

  const onDragStart = ({ x, y }: Point) => {
    dragStartPosition = { x, y }
    dragStartCrop = { x: crop.x, y: crop.y }
  }

  const onDrag = ({ x, y }: Point) => {
    if (rafDragTimeout) window.cancelAnimationFrame(rafDragTimeout)

    rafDragTimeout = window.requestAnimationFrame(() => {
      if (x === undefined || y === undefined || !cropperSize) return
      const offsetX = x - dragStartPosition.x
      const offsetY = y - dragStartPosition.y
      const requestedPosition = {
        x: dragStartCrop.x + offsetX,
        y: dragStartCrop.y + offsetY,
      }

      crop = restrictPosition
        ? clampPosition(requestedPosition, imageSize, cropperSize, zoom)
        : requestedPosition
    })
  }

  const onDragStopped = () => {
    cleanEvents()
    emitCropData()
  }

  const onPinchStart = (e: TouchEvent) => {
    const pointA = getTouchPoint(e.touches[0])
    const pointB = getTouchPoint(e.touches[1])
    lastPinchDistance = getDistanceBetweenPoints(pointA, pointB)
    onDragStart(getCenter(pointA, pointB))
  }

  const onPinchMove = (e: TouchEvent) => {
    const pointA = getTouchPoint(e.touches[0])
    const pointB = getTouchPoint(e.touches[1])
    const center = getCenter(pointA, pointB)
    onDrag(center)

    if (rafZoomTimeout) window.cancelAnimationFrame(rafZoomTimeout)
    rafZoomTimeout = window.requestAnimationFrame(() => {
      const distance = getDistanceBetweenPoints(pointA, pointB)
      const newZoom = zoom * (distance / lastPinchDistance)
      setNewZoom(newZoom, center)
      lastPinchDistance = distance
    })
  }

  const onWheel = (e: WheelEvent) => {
    e.preventDefault()
    const point = getMousePoint(e)
    const newZoom = zoom - (e.deltaY * zoomSpeed) / 200
    setNewZoom(newZoom, point)
  }

  const getPointOnContainer = ({ x, y }: Point) => {
    if (!containerRect) {
      throw new Error('The Cropper is not mounted')
    }
    return {
      x: containerRect.width / 2 - (x - containerRect.left),
      y: containerRect.height / 2 - (y - containerRect.top),
    }
  }

  const getPointOnImage = ({ x, y }: Point) => ({
    x: (x + crop.x) / zoom,
    y: (y + crop.y) / zoom,
  })

  const setNewZoom = (newZoom: number, point: Point) => {
    if (!cropperSize) return
    const zoomPoint = getPointOnContainer(point)
    const zoomTarget = getPointOnImage(zoomPoint)
    zoom = Math.min(maxZoom, Math.max(newZoom, minZoom))

    const requestedPosition = {
      x: zoomTarget.x * zoom - zoomPoint.x,
      y: zoomTarget.y * zoom - zoomPoint.y,
    }
    crop = restrictPosition
      ? clampPosition(requestedPosition, imageSize, cropperSize, zoom)
      : requestedPosition
  }

  const emitCropData = () => {
    if (!cropperSize || cropperSize.width === 0) return
    // this is to ensure the crop is correctly restricted after a zoom back
    const position = restrictPosition
      ? clampPosition(crop, imageSize, cropperSize, zoom)
      : crop
    const { croppedAreaPercentages, croppedAreaPixels } = computeCroppedArea(
      position,
      imageSize,
      cropperSize,
      getAspect(),
      zoom,
      restrictPosition
    )

    oncropcomplete?.({
      percent: croppedAreaPercentages,
      pixels: croppedAreaPixels,
    })
  }

  // when aspect changes, we reset the cropperSize
  $effect(() => {
    if (imgEl) {
      cropperSize = cropSize ? cropSize : getCropSize(imgEl.width, imgEl.height, aspect)
    }
  })

  // when zoom changes, we recompute the cropped area
  $effect(() => {
    if (zoom) {
      emitCropData()
    }
  })

  const containerAction: Action<HTMLDivElement> = node => {
    $effect(() => {
      node.addEventListener('touchstart', onTouchStart)
      node.addEventListener('mousedown', onMouseDown)
      node.addEventListener('wheel', onWheel, { passive: false })

      return () => {
        node.removeEventListener('touchstart', onTouchStart)
        node.removeEventListener('mousedown', onMouseDown)
        node.removeEventListener('wheel', onWheel)
      }
    })
  }
</script>

<svelte:window on:resize={computeSizes} />
<div
  class="svelte-easy-crop-container"
  bind:this={containerEl}
  use:containerAction
  {tabindex}
  role="button"
  data-testid="container"
>
  <img
    bind:this={imgEl}
    class="svelte-easy-crop-image"
    src={image}
    onload={onImgLoad}
    alt=""
    style="transform: translate({crop.x}px, {crop.y}px) scale({zoom});"
    crossorigin={crossOrigin}
  />
  {#if cropperSize}
    <div
      class="svelte-easy-crop-area"
      class:svelte-easy-crop-round={cropShape === 'round'}
      class:svelte-easy-crop-grid={showGrid}
      style="width: {cropperSize.width}px; height: {cropperSize.height}px;"
      data-testid="cropper"
    ></div>
  {/if}
</div>

<style>
  .svelte-easy-crop-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    user-select: none;
    touch-action: none;
    cursor: move;
  }

  .svelte-easy-crop-image {
    max-width: 100%;
    max-height: 100%;
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    will-change: transform;
  }

  .svelte-easy-crop-area {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 0 9999em;
    box-sizing: border-box;
    color: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.5);
    overflow: hidden;
  }

  .svelte-easy-crop-grid:before {
    content: ' ';
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.5);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 33.33%;
    right: 33.33%;
    border-top: 0;
    border-bottom: 0;
  }

  .svelte-easy-crop-grid:after {
    content: ' ';
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.5);
    position: absolute;
    top: 33.33%;
    bottom: 33.33%;
    left: 0;
    right: 0;
    border-left: 0;
    border-right: 0;
  }

  .svelte-easy-crop-round {
    border-radius: 50%;
  }
</style>
