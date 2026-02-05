<!--
This is a Svelte component from virtua

Website: [inokawa.github.io/virtua](https://inokawa.github.io/virtua/?path=/story/basics-vlist--default)
GitHub Repository: [inokawa/virtua](https://github.com/inokawa/virtua)

All components in this directory are sourced from the virtua project by inokawa. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" generics="T">
  import { onMount, onDestroy, tick, type Snippet } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";
  import ListItem from "./ListItem.svelte";

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE UTILITIES  (from core/utils.ts)
  // ═══════════════════════════════════════════════════════════════════════════
  const NULL = null;
  const { min, max, abs, floor } = Math;

  const clamp = (value: number, minValue: number, maxValue: number): number =>
    min(maxValue, max(minValue, value));

  const sort = <T extends number>(arr: readonly T[]): T[] =>
    [...arr].sort((a, b) => a - b);

  const microtask: (fn: () => void) => void =
    typeof queueMicrotask === "function"
      ? queueMicrotask
      : (fn) => {
          Promise.resolve().then(fn);
        };

  const createPromise = <T = void>(): [Promise<T>, (arg: T) => void] => {
    let resolve: ((arg: T) => void) | undefined;
    const promise = new Promise<T>((res) => {
      resolve = res;
    });
    return [promise, resolve!];
  };

  const once = <T>(fn: () => T): (() => T) => {
    let cache: T;
    return () => {
      if (fn) {
        cache = fn();
        fn = undefined!;
      }
      return cache;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // BROWSER DETECTION  (from core/environment.ts)
  // ═══════════════════════════════════════════════════════════════════════════
  const getDocumentElement = (doc: Document): HTMLElement => doc.documentElement;
  const getCurrentDocument = (node: HTMLElement): Document => node.ownerDocument;
  const getCurrentWindow = (doc: Document) => doc.defaultView!;

  const isIOSWebKit = once((): boolean => {
    if (/iP(hone|od|ad)/.test(navigator.userAgent)) return true;
    return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 0;
  });

  const isSmoothScrollSupported = once((): boolean => {
    return "scrollBehavior" in getDocumentElement(document).style;
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // CORE TYPES  (from core/types.ts)
  // ═══════════════════════════════════════════════════════════════════════════
  type ItemResize = Readonly<[index: number, size: number]>;
  type ItemsRange = Readonly<[startIndex: number, endIndex: number]>;
  type InternalCacheSnapshot = [sizes: number[], defaultSize: number];

  declare const cacheSymbol: unique symbol;
  interface CacheSnapshot {
    [cacheSymbol]: never;
  }

  interface ScrollToIndexOpts {
    align?: "start" | "center" | "end" | "nearest";
    smooth?: boolean;
    offset?: number;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CACHE  (from core/cache.ts)
  // ═══════════════════════════════════════════════════════════════════════════
  const UNCACHED = -1;

  type Cache = {
    readonly _length: number;
    readonly _sizes: number[];
    readonly _defaultItemSize: number;
    readonly _computedOffsetIndex: number;
    readonly _offsets: number[];
  };

  type Writeable<T> = { -readonly [key in keyof T]: Writeable<T[key]> };

  const fill = (array: number[], length: number, prepend?: boolean): number[] => {
    const key = prepend ? "unshift" : "push";
    for (let i = 0; i < length; i++) {
      array[key](UNCACHED);
    }
    return array;
  };

  const getItemSizeFromCache = (cache: Cache, index: number): number => {
    const size = cache._sizes[index]!;
    return size === UNCACHED ? cache._defaultItemSize : size;
  };

  const setItemSize = (
    cache: Writeable<Cache>,
    index: number,
    size: number,
  ): boolean => {
    const isInitialMeasurement = cache._sizes[index] === UNCACHED;
    cache._sizes[index] = size;
    cache._computedOffsetIndex = min(index, cache._computedOffsetIndex);
    return isInitialMeasurement;
  };

  const getItemOffsetFromCache = (
    cache: Writeable<Cache>,
    index: number,
  ): number => {
    if (!cache._length) return 0;
    if (cache._computedOffsetIndex >= index) return cache._offsets[index]!;

    if (cache._computedOffsetIndex < 0) {
      cache._offsets[0] = 0;
      cache._computedOffsetIndex = 0;
    }
    let i = cache._computedOffsetIndex;
    let top = cache._offsets[i]!;
    while (i < index) {
      top += getItemSizeFromCache(cache, i);
      cache._offsets[++i] = top;
    }
    cache._computedOffsetIndex = index;
    return top;
  };

  const findIndex = (
    cache: Cache,
    offset: number,
    low: number = 0,
    high: number = cache._length - 1,
  ): number => {
    let found: number = low;
    while (low <= high) {
      const mid = floor((low + high) / 2);
      if (getItemOffsetFromCache(cache, mid) <= offset) {
        found = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return clamp(found, 0, cache._length - 1);
  };

  const computeRange = (
    cache: Cache,
    startOffset: number,
    endOffset: number,
    prevStartIndex: number,
  ): ItemsRange => {
    prevStartIndex = min(prevStartIndex, cache._length - 1);
    if (getItemOffsetFromCache(cache, prevStartIndex) <= startOffset) {
      const end = findIndex(cache, endOffset, prevStartIndex);
      return [findIndex(cache, startOffset, prevStartIndex, end), end];
    } else {
      const start = findIndex(cache, startOffset, undefined, prevStartIndex);
      return [start, findIndex(cache, endOffset, start)];
    }
  };

  const estimateDefaultItemSize = (
    cache: Writeable<Cache>,
    startIndex: number,
  ): number => {
    let measuredCountBeforeStart = 0;
    const measuredSizes: number[] = [];
    cache._sizes.forEach((s, i) => {
      if (s !== UNCACHED) {
        measuredSizes.push(s);
        if (i < startIndex) measuredCountBeforeStart++;
      }
    });

    cache._computedOffsetIndex = -1;

    const sorted = sort(measuredSizes);
    const len = sorted.length;
    const mid = (len / 2) | 0;
    const median =
      len % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;

    const prevDefaultItemSize = cache._defaultItemSize;
    return (
      ((cache._defaultItemSize = median) - prevDefaultItemSize) *
      max(startIndex - measuredCountBeforeStart, 0)
    );
  };

  const initCache = (
    length: number,
    itemSize: number,
    sizes?: readonly number[],
  ): Cache => {
    return {
      _defaultItemSize: itemSize,
      _sizes: sizes
        ? fill(
            sizes.slice(0, min(length, sizes.length)),
            max(0, length - sizes.length),
          )
        : fill([], length),
      _length: length,
      _computedOffsetIndex: -1,
      _offsets: fill([], length + 1),
    };
  };

  const takeCacheSnapshot = (cache: Cache): InternalCacheSnapshot => {
    return [cache._sizes.slice(), cache._defaultItemSize];
  };

  const updateCacheLength = (
    cache: Writeable<Cache>,
    length: number,
    isShift?: boolean,
  ): number => {
    const diff = length - cache._length;
    cache._computedOffsetIndex = isShift
      ? -1
      : min(length - 1, cache._computedOffsetIndex);
    cache._length = length;

    if (diff > 0) {
      fill(cache._offsets, diff);
      fill(cache._sizes, diff, isShift);
      return cache._defaultItemSize * diff;
    } else {
      cache._offsets.splice(diff);
      return (
        isShift ? cache._sizes.splice(0, -diff) : cache._sizes.splice(diff)
      ).reduce(
        (acc, removed) =>
          acc - (removed === UNCACHED ? cache._defaultItemSize : removed),
        0,
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // VIRTUAL STORE  (from core/store.ts)
  // ═══════════════════════════════════════════════════════════════════════════
  const MAX_INT_32 = 0x7fffffff;

  const SCROLL_IDLE = 0;
  const SCROLL_DOWN = 1;
  const SCROLL_UP = 2;
  type ScrollDirection =
    | typeof SCROLL_IDLE
    | typeof SCROLL_DOWN
    | typeof SCROLL_UP;

  const SCROLL_BY_NATIVE = 0;
  const SCROLL_BY_MANUAL_SCROLL = 1;
  const SCROLL_BY_SHIFT = 2;
  type ScrollMode =
    | typeof SCROLL_BY_NATIVE
    | typeof SCROLL_BY_MANUAL_SCROLL
    | typeof SCROLL_BY_SHIFT;

  const ACTION_SCROLL = 1;
  const ACTION_SCROLL_END = 2;
  const ACTION_ITEM_RESIZE = 3;
  const ACTION_VIEWPORT_RESIZE = 4;
  const ACTION_ITEMS_LENGTH_CHANGE = 5;
  const ACTION_START_OFFSET_CHANGE = 6;
  const ACTION_MANUAL_SCROLL = 7;
  const ACTION_BEFORE_MANUAL_SMOOTH_SCROLL = 8;

  type Actions =
    | [type: typeof ACTION_SCROLL, offset: number]
    | [type: typeof ACTION_SCROLL_END, dummy?: void]
    | [type: typeof ACTION_ITEM_RESIZE, entries: ItemResize[]]
    | [type: typeof ACTION_VIEWPORT_RESIZE, size: number]
    | [
        type: typeof ACTION_ITEMS_LENGTH_CHANGE,
        arg: [length: number, isShift?: boolean | undefined],
      ]
    | [type: typeof ACTION_START_OFFSET_CHANGE, offset: number]
    | [type: typeof ACTION_MANUAL_SCROLL, dummy?: void]
    | [type: typeof ACTION_BEFORE_MANUAL_SMOOTH_SCROLL, offset: number];

  const UPDATE_VIRTUAL_STATE = 0b0001;
  const UPDATE_SIZE_EVENT = 0b0010;
  const UPDATE_SCROLL_EVENT = 0b0100;
  const UPDATE_SCROLL_END_EVENT = 0b1000;

  const computeScrollSize = (store: VirtualStore): number =>
    max(store.$getTotalSize(), store.$getViewportSize());

  type Subscriber = (sync?: boolean) => void;
  type StateVersion = number & {};

  type VirtualStore = {
    $dispose(): void;
    $getStateVersion(): StateVersion;
    $getCacheSnapshot(): CacheSnapshot;
    $getRange(bufferSize?: number): ItemsRange;
    $findItemIndex(offset: number): number;
    $isUnmeasuredItem(index: number): boolean;
    $getItemOffset(index: number, fromEnd?: boolean): number;
    $getItemSize(index: number): number;
    $getItemsLength(): number;
    $getScrollOffset(): number;
    $isScrolling(): boolean;
    $getViewportSize(): number;
    $getStartSpacerSize(): number;
    $getTotalSize(): number;
    _flushJump(): [number, boolean];
    $subscribe(target: number, cb: Subscriber): () => void;
    $update(...action: Actions): void;
  };

  const createVirtualStore = (
    elementsCount: number,
    itemSize: number = 40,
    ssrCount: number = 0,
    cacheSnapshot?: CacheSnapshot | undefined,
    shouldAutoEstimateItemSize: boolean = false,
  ): VirtualStore => {
    let isSSR = !!ssrCount;
    let stateVersion: StateVersion = 1;
    let viewportSize = 0;
    let startSpacerSize = 0;
    let scrollOffset = 0;
    let jump = 0;
    let pendingJump = 0;
    let _flushedJump = 0;
    let _scrollDirection: ScrollDirection = SCROLL_IDLE;
    let _scrollMode: ScrollMode = SCROLL_BY_NATIVE;
    let _frozenRange: ItemsRange | null = NULL;
    let _prevRange: ItemsRange = [0, isSSR ? max(ssrCount - 1, 0) : -1];
    let _totalMeasuredSize = 0;
    let _isViewportMeasured = false;
    let _shouldAutoEstimate = shouldAutoEstimateItemSize;

    const cache = initCache(
      elementsCount,
      cacheSnapshot
        ? (cacheSnapshot as unknown as InternalCacheSnapshot)[1]
        : itemSize,
      cacheSnapshot && (cacheSnapshot as unknown as InternalCacheSnapshot)[0],
    );
    const subscribers = new Set<[number, Subscriber]>();
    const getRelativeScrollOffset = () => scrollOffset - startSpacerSize;
    const getVisibleOffset = () => getRelativeScrollOffset() + pendingJump + jump;
    const getRange = (startOffset: number, endOffset: number) =>
      computeRange(cache, startOffset, endOffset, _prevRange[0]);
    const getTotalSize = (): number => getItemOffsetFromCache(cache, cache._length);
    const getItemOffset = (index: number, fromEnd?: boolean): number => {
      const offset = getItemOffsetFromCache(cache, index) - pendingJump;
      if (fromEnd) return getTotalSize() - offset - getItemSizeFromCache(cache, index);
      return offset;
    };
    const getItemSize = (index: number): number => getItemSizeFromCache(cache, index);
    const isSizeEqual = (index: number, value: number = UNCACHED): boolean =>
      cache._sizes[index] === value;

    const applyJump = (j: number) => {
      if (j) {
        if (
          (isIOSWebKit() && _scrollDirection !== SCROLL_IDLE) ||
          (_frozenRange && _scrollMode === SCROLL_BY_MANUAL_SCROLL)
        ) {
          pendingJump += j;
        } else {
          jump += j;
        }
      }
    };

    return {
      $dispose: () => {
        subscribers.clear();
      },
      $getStateVersion: () => stateVersion,
      $getCacheSnapshot: () =>
        takeCacheSnapshot(cache) as unknown as CacheSnapshot,
      $getRange: (bufferSize = 200) => {
        if (!_isViewportMeasured || isSSR) return _prevRange;

        let startIndex: number;
        let endIndex: number;
        if (_flushedJump) {
          [startIndex, endIndex] = _prevRange;
        } else {
          let startOffset = max(0, getVisibleOffset());
          let endOffset = startOffset + viewportSize;

          if (!_shouldAutoEstimate) {
            bufferSize = max(0, bufferSize);
            if (_scrollDirection !== SCROLL_DOWN) startOffset -= bufferSize;
            if (_scrollDirection !== SCROLL_UP) endOffset += bufferSize;
          }

          [startIndex, endIndex] = _prevRange = getRange(
            max(0, startOffset),
            max(0, endOffset),
          );
          if (_frozenRange) {
            startIndex = min(startIndex, _frozenRange[0]);
            endIndex = max(endIndex, _frozenRange[1]);
          }
        }
        return [max(startIndex, 0), min(endIndex, cache._length - 1)];
      },
      $findItemIndex: (offset) => findIndex(cache, offset - startSpacerSize),
      $isUnmeasuredItem: isSizeEqual,
      $getItemOffset: getItemOffset,
      $getItemSize: getItemSize,
      $getItemsLength: () => cache._length,
      $getScrollOffset: () => scrollOffset,
      $isScrolling: () => _scrollDirection !== SCROLL_IDLE,
      $getViewportSize: () => viewportSize,
      $getStartSpacerSize: () => startSpacerSize,
      $getTotalSize: getTotalSize,
      _flushJump: () => {
        _flushedJump = jump;
        jump = 0;
        return [_flushedJump, _scrollMode === SCROLL_BY_SHIFT];
      },
      $subscribe: (target, cb) => {
        const sub: [number, Subscriber] = [target, cb];
        subscribers.add(sub);
        return () => {
          subscribers.delete(sub);
        };
      },
      $update: (type, payload): void => {
        let shouldFlushPendingJump: boolean | undefined;
        let shouldSync: boolean | undefined;
        let mutated = 0;

        switch (type) {
          case ACTION_SCROLL: {
            if (payload === scrollOffset && _scrollMode === SCROLL_BY_NATIVE) break;

            const flushedJump = _flushedJump;
            _flushedJump = 0;

            const delta = payload - scrollOffset;
            const distance = abs(delta);
            const isJustJumped = flushedJump && distance < abs(flushedJump) + 1;

            if (!isJustJumped && _scrollMode === SCROLL_BY_NATIVE) {
              _scrollDirection = delta < 0 ? SCROLL_UP : SCROLL_DOWN;
            }

            if (isSSR) isSSR = false;

            scrollOffset = payload;
            mutated = UPDATE_SCROLL_EVENT;

            const relativeOffset = getRelativeScrollOffset();
            if (relativeOffset >= -viewportSize && relativeOffset <= getTotalSize()) {
              mutated += UPDATE_VIRTUAL_STATE;
              shouldSync = distance > viewportSize;
            }
            break;
          }
          case ACTION_SCROLL_END: {
            mutated = UPDATE_SCROLL_END_EVENT;
            if (_scrollDirection !== SCROLL_IDLE) {
              shouldFlushPendingJump = true;
              mutated += UPDATE_VIRTUAL_STATE;
            }
            _scrollDirection = SCROLL_IDLE;
            _scrollMode = SCROLL_BY_NATIVE;
            _frozenRange = NULL;
            break;
          }
          case ACTION_ITEM_RESIZE: {
            const updated = payload.filter(
              ([index, size]) => !isSizeEqual(index, size),
            );
            if (!updated.length) break;

            applyJump(
              updated.reduce((acc, [index, size]) => {
                if (
                  _scrollMode === SCROLL_BY_SHIFT ||
                  (_frozenRange && _scrollMode === SCROLL_BY_MANUAL_SCROLL
                    ? index < _frozenRange[0]
                    : getItemOffset(
                        index +
                          (_scrollDirection === SCROLL_IDLE &&
                          _scrollMode === SCROLL_BY_NATIVE
                            ? 1
                            : 0),
                      ) < getRelativeScrollOffset())
                ) {
                  acc += size - getItemSize(index);
                }
                return acc;
              }, 0),
            );

            for (const [index, size] of updated) {
              const prevSize = getItemSize(index);
              const isInitialMeasurement = setItemSize(cache, index, size);
              if (_shouldAutoEstimate) {
                _totalMeasuredSize += isInitialMeasurement ? size : size - prevSize;
              }
            }

            if (
              _shouldAutoEstimate &&
              viewportSize &&
              _totalMeasuredSize > viewportSize
            ) {
              applyJump(
                estimateDefaultItemSize(cache, findIndex(cache, getVisibleOffset())),
              );
              _shouldAutoEstimate = false;
            }

            mutated = UPDATE_VIRTUAL_STATE + UPDATE_SIZE_EVENT;
            shouldSync = true;
            break;
          }
          case ACTION_VIEWPORT_RESIZE: {
            if (viewportSize !== payload) {
              if (!viewportSize) _isViewportMeasured = shouldSync = true;
              viewportSize = payload;
              mutated = UPDATE_VIRTUAL_STATE + UPDATE_SIZE_EVENT;
            }
            break;
          }
          case ACTION_ITEMS_LENGTH_CHANGE: {
            if (payload[1]) {
              applyJump(updateCacheLength(cache, payload[0], true));
              _scrollMode = SCROLL_BY_SHIFT;
              mutated = UPDATE_VIRTUAL_STATE;
            } else {
              updateCacheLength(cache, payload[0]);
              mutated = UPDATE_VIRTUAL_STATE;
            }
            break;
          }
          case ACTION_START_OFFSET_CHANGE: {
            startSpacerSize = payload;
            break;
          }
          case ACTION_MANUAL_SCROLL: {
            _scrollMode = SCROLL_BY_MANUAL_SCROLL;
            break;
          }
          case ACTION_BEFORE_MANUAL_SMOOTH_SCROLL: {
            _frozenRange = getRange(payload, payload + viewportSize);
            mutated = UPDATE_VIRTUAL_STATE;
            break;
          }
        }

        if (mutated) {
          stateVersion = (stateVersion & MAX_INT_32) + 1;
          if (shouldFlushPendingJump && pendingJump) {
            jump += pendingJump;
            pendingJump = 0;
          }
          subscribers.forEach(([target, cb]) => {
            if (!(mutated & target)) return;
            cb(shouldSync);
          });
        }
      },
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RESIZER  (from core/resizer.ts — createResizer)
  // ═══════════════════════════════════════════════════════════════════════════
  type ItemResizeObserver = (el: HTMLElement, i: number) => () => void;

  const createResizeObserver = (cb: ResizeObserverCallback) => {
    let ro: ResizeObserver | undefined;
    return {
      _observe(e: HTMLElement) {
        (
          ro ||
          (ro = new (getCurrentWindow(getCurrentDocument(e)).ResizeObserver)(cb))
        ).observe(e);
      },
      _unobserve(e: HTMLElement) {
        ro!.unobserve(e);
      },
      _dispose() {
        ro && ro.disconnect();
      },
    };
  };

  const createResizer = (store: VirtualStore, isHorizontal: boolean) => {
    let viewportElement: HTMLElement | undefined;
    const sizeKey = isHorizontal ? "width" : "height";
    const mountedIndexes = new WeakMap<Element, number>();

    const resizeObserver = createResizeObserver((entries) => {
      const resizes: ItemResize[] = [];
      for (const { target, contentRect } of entries) {
        if (!(target as HTMLElement).offsetParent) continue;
        if (target === viewportElement) {
          store.$update(ACTION_VIEWPORT_RESIZE, contentRect[sizeKey]);
        } else {
          const index = mountedIndexes.get(target);
          if (index != NULL) {
            resizes.push([index, contentRect[sizeKey]]);
          }
        }
      }
      if (resizes.length) {
        store.$update(ACTION_ITEM_RESIZE, resizes);
      }
    });

    return {
      $observeRoot(viewport: HTMLElement) {
        resizeObserver._observe((viewportElement = viewport));
      },
      $observeItem: ((el: HTMLElement, i: number) => {
        mountedIndexes.set(el, i);
        resizeObserver._observe(el);
        return () => {
          mountedIndexes.delete(el);
          resizeObserver._unobserve(el);
        };
      }) as ItemResizeObserver,
      $dispose: resizeObserver._dispose,
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SCROLLER  (from core/scroller.ts — createScroller)
  // ═══════════════════════════════════════════════════════════════════════════
  const timeout = setTimeout;

  const debounce = <T extends () => void>(fn: T, ms: number) => {
    let id: ReturnType<typeof setTimeout> | undefined | null;
    const cancel = () => {
      if (id != NULL) clearTimeout(id);
    };
    const debouncedFn = () => {
      cancel();
      id = timeout(() => {
        id = NULL;
        fn();
      }, ms);
    };
    debouncedFn._cancel = cancel;
    return debouncedFn;
  };

  const normalizeScrollOffset = (offset: number, isNegative: boolean): number =>
    isNegative ? -offset : offset;

  const createScrollObserver = (
    store: VirtualStore,
    viewport: HTMLElement | Window,
    isHorizontal: boolean,
    getScrollOffset: () => number,
    updateScrollOffset: (
      value: number,
      shift: boolean,
      isMomentumScrolling: boolean,
    ) => void,
    getStartOffset?: () => number,
  ) => {
    const now = Date.now;
    let lastScrollTime = 0;
    let wheeling = false;
    let touching = false;
    let justTouchEnded = false;
    let stillMomentumScrolling = false;

    const onScrollEnd = debounce(() => {
      if (wheeling || touching) {
        wheeling = false;
        onScrollEnd();
        return;
      }
      justTouchEnded = false;
      store.$update(ACTION_SCROLL_END);
    }, 150);

    const onScroll = () => {
      lastScrollTime = now();
      if (justTouchEnded) stillMomentumScrolling = true;
      if (getStartOffset) store.$update(ACTION_START_OFFSET_CHANGE, getStartOffset());
      store.$update(ACTION_SCROLL, getScrollOffset());
      onScrollEnd();
    };

    const onWheel = ((e: WheelEvent) => {
      if (wheeling || !store.$isScrolling() || e.ctrlKey) return;
      const timeDelta = now() - lastScrollTime;
      if (
        150 > timeDelta &&
        50 < timeDelta &&
        (isHorizontal ? e.deltaX : e.deltaY)
      ) {
        wheeling = true;
      }
    }) as (e: Event) => void;

    const onTouchStart = () => {
      touching = true;
      justTouchEnded = stillMomentumScrolling = false;
    };
    const onTouchEnd = () => {
      touching = false;
      if (isIOSWebKit()) justTouchEnded = true;
    };

    viewport.addEventListener("scroll", onScroll);
    viewport.addEventListener("wheel", onWheel, { passive: true });
    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    viewport.addEventListener("touchend", onTouchEnd, { passive: true });

    return {
      _dispose: () => {
        viewport.removeEventListener("scroll", onScroll);
        viewport.removeEventListener("wheel", onWheel);
        viewport.removeEventListener("touchstart", onTouchStart);
        viewport.removeEventListener("touchend", onTouchEnd);
        onScrollEnd._cancel();
      },
      _fixScrollJump: () => {
        const [jump, shift] = store._flushJump();
        if (!jump) return;
        updateScrollOffset(jump, shift, stillMomentumScrolling);
        stillMomentumScrolling = false;
        if (shift && store.$getViewportSize() > store.$getTotalSize()) {
          store.$update(ACTION_SCROLL, getScrollOffset());
        }
      },
    };
  };

  type ScrollObserver = ReturnType<typeof createScrollObserver>;

  type ScheduleScrollFunction = (
    getTargetOffset: () => number,
    smooth?: boolean,
  ) => Promise<void>;

  const createScrollScheduler = (
    store: VirtualStore,
    initialized: () => Promise<boolean>,
    scroll: (offset: number, smooth?: boolean) => void,
  ): [scroll: ScheduleScrollFunction, cancel: () => void] => {
    let cancelScroll: (() => void) | undefined;

    return [
      async (getTargetOffset, smooth) => {
        if (!(await initialized())) return;
        if (cancelScroll) cancelScroll();

        const waitForMeasurement = (): [Promise<boolean>, () => void] => {
          const [promise, resolve] = createPromise<boolean>();
          cancelScroll = () => {
            resolve(false);
          };
          if (store.$getViewportSize()) timeout(cancelScroll, 150);
          return [
            promise,
            store.$subscribe(UPDATE_SIZE_EVENT, () => {
              resolve(true);
            }),
          ];
        };

        if (smooth && isSmoothScrollSupported()) {
          store.$update(ACTION_BEFORE_MANUAL_SMOOTH_SCROLL, getTargetOffset());

          microtask(async () => {
            while (true) {
              let done = true;
              for (let [i, end] = store.$getRange(); i <= end; i++) {
                if (store.$isUnmeasuredItem(i)) {
                  done = false;
                  break;
                }
              }
              if (done) break;
              const [promise, unsubscribe] = waitForMeasurement();
              try {
                if (!(await promise)) return;
              } finally {
                unsubscribe();
              }
            }
            store.$update(ACTION_MANUAL_SCROLL);
            scroll(getTargetOffset(), smooth);
          });
        } else {
          while (true) {
            const [promise, unsubscribe] = waitForMeasurement();
            try {
              store.$update(ACTION_MANUAL_SCROLL);
              scroll(getTargetOffset());
              if (!(await promise)) return;
            } finally {
              unsubscribe();
            }
          }
        }
      },
      () => {
        cancelScroll && cancelScroll();
      },
    ];
  };

  const createScroller = (store: VirtualStore, isHorizontal: boolean) => {
    let viewportElement: HTMLElement | undefined;
    let scrollObserver: ScrollObserver | undefined;
    let initialized = createPromise<boolean>();
    let isNegative = false;
    const scrollOffsetKey = isHorizontal ? "scrollLeft" : "scrollTop";
    const overflowKey = isHorizontal ? "overflowX" : "overflowY";

    const [scheduleScroll, cancelScroll] = createScrollScheduler(
      store,
      () => initialized[0],
      (offset, smooth) => {
        offset = normalizeScrollOffset(offset, isNegative);
        if (smooth) {
          viewportElement!.scrollTo({
            [isHorizontal ? "left" : "top"]: offset,
            behavior: "smooth",
          });
        } else {
          viewportElement![scrollOffsetKey] = offset;
        }
      },
    );

    return {
      $observe(_: HTMLElement, viewport: HTMLElement) {
        viewportElement = viewport;
        if (isHorizontal) {
          isNegative = getComputedStyle(viewport).direction === "rtl";
        }
        scrollObserver = createScrollObserver(
          store,
          viewport,
          isHorizontal,
          () => normalizeScrollOffset(viewport[scrollOffsetKey], isNegative),
          (jump, shift, isMomentumScrolling) => {
            if (isMomentumScrolling) {
              const style = viewport.style;
              const prev = style[overflowKey];
              style[overflowKey] = "hidden";
              timeout(() => {
                style[overflowKey] = prev;
              });
            }
            viewport[scrollOffsetKey] = normalizeScrollOffset(
              store.$getScrollOffset() + jump,
              isNegative,
            );
            if (shift) cancelScroll();
          },
        );
        initialized[1](true);
      },
      $dispose() {
        scrollObserver && scrollObserver._dispose();
        initialized[1](false);
        initialized = createPromise();
      },
      $isNegative: () => isNegative,
      $scrollTo(offset: number) {
        scheduleScroll(() => offset);
      },
      $scrollBy(offset: number) {
        offset += store.$getScrollOffset();
        scheduleScroll(() => offset);
      },
      $scrollToIndex(index: number, { align, smooth, offset = 0 }: ScrollToIndexOpts = {}) {
        index = clamp(index, 0, store.$getItemsLength() - 1);

        if (align === "nearest") {
          const itemOffset = store.$getItemOffset(index);
          const scrollOffset = store.$getScrollOffset();
          if (itemOffset < scrollOffset) {
            align = "start";
          } else if (
            itemOffset + store.$getItemSize(index) >
            scrollOffset + store.$getViewportSize()
          ) {
            align = "end";
          } else {
            return;
          }
        }

        scheduleScroll(() => {
          return (
            offset +
            store.$getStartSpacerSize() +
            store.$getItemOffset(index) +
            (align === "end"
              ? store.$getItemSize(index) - store.$getViewportSize()
              : align === "center"
                ? (store.$getItemSize(index) - store.$getViewportSize()) / 2
                : 0)
          );
        }, smooth);
      },
      $fixScrollJump: () => {
        scrollObserver && scrollObserver._fixScrollJump();
      },
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SVELTE UTILITIES  (from svelte/utils.ts)
  // ═══════════════════════════════════════════════════════════════════════════
  const styleToString = (obj: Record<string, string | undefined>): string => {
    return Object.keys(obj).reduce((acc, k) => {
      const value = obj[k];
      if (value == null) return acc;
      return acc + `${k}:${value};`;
    }, "");
  };

  const defaultGetKey = (_data: unknown, i: number) => "_" + i;

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPONENT TYPES  (from Virtualizer.type.ts)
  // ═══════════════════════════════════════════════════════════════════════════
  interface VirtualizerProps<T> {
    data: readonly T[];
    children: Snippet<[item: T, index: number]>;
    getKey?: (data: T, index: number) => string | number;
    as?: keyof SvelteHTMLElements;
    item?: keyof SvelteHTMLElements;
    bufferSize?: number;
    scrollRef?: HTMLElement;
    itemSize?: number;
    ssrCount?: number;
    shift?: boolean;
    horizontal?: boolean;
    keepMounted?: readonly number[];
    cache?: CacheSnapshot;
    startMargin?: number;
    onscroll?: (offset: number) => void;
    onscrollend?: () => void;
  }

  interface VirtualizerHandle {
    getCache: () => CacheSnapshot;
    getScrollOffset: () => number;
    getScrollSize: () => number;
    getViewportSize: () => number;
    findItemIndex(offset: number): number;
    getItemOffset(index: number): number;
    getItemSize(index: number): number;
    scrollToIndex(index: number, opts?: ScrollToIndexOpts): void;
    scrollTo(offset: number): void;
    scrollBy(offset: number): void;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPONENT  (Virtualizer)
  // ═══════════════════════════════════════════════════════════════════════════
  interface Props extends VirtualizerProps<T> {}

  let {
    data,
    getKey = defaultGetKey,
    as = "div",
    item: itemAs,
    scrollRef,
    bufferSize,
    itemSize,
    ssrCount,
    shift = false,
    horizontal = false,
    keepMounted,
    cache,
    startMargin = 0,
    children,
    onscroll,
    onscrollend,
  }: Props = $props();

  const store = createVirtualStore(
    data.length,
    itemSize,
    ssrCount,
    cache,
    !itemSize,
  );
  const resizer = createResizer(store, horizontal);
  const scroller = createScroller(store, horizontal);

  store.$subscribe(UPDATE_VIRTUAL_STATE, () => {
    stateVersion = store.$getStateVersion();
  });
  store.$subscribe(UPDATE_SCROLL_EVENT, () => {
    onscroll && onscroll(store.$getScrollOffset());
  });
  store.$subscribe(UPDATE_SCROLL_END_EVENT, () => {
    onscrollend && onscrollend();
  });

  let containerRef: HTMLDivElement | undefined = $state();
  let stateVersion: StateVersion = $state(store.$getStateVersion());

  let range = $derived(stateVersion && store.$getRange(bufferSize));
  let isScrolling = $derived(stateVersion && store.$isScrolling());
  let totalSize = $derived(stateVersion && store.$getTotalSize());
  let negative = $derived(stateVersion && scroller.$isNegative());

  let indexes = $derived.by(() => {
    const [start, end] = range;
    const arr: number[] = [];
    if (keepMounted) {
      const mounted = new Set(keepMounted);
      for (let i = start; i <= end; i++) {
        mounted.add(i);
      }
      for (const index of sort([...mounted])) {
        arr.push(index);
      }
    } else {
      for (let i = start; i <= end; i++) {
        arr.push(i);
      }
    }
    return arr;
  });

  onMount(() => {
    const container = containerRef!;
    const assignRef = (scrollable: HTMLElement) => {
      resizer.$observeRoot(scrollable);
      scroller.$observe(container, scrollable);
    };
    tick().then(() => {
      if (scrollRef) {
        assignRef(scrollRef);
      } else {
        assignRef(container.parentElement!);
      }
    });
  });
  onDestroy(() => {
    store.$dispose();
    resizer.$dispose();
    scroller.$dispose();
  });

  $effect.pre(() => {
    if (data.length !== store.$getItemsLength()) {
      store.$update(ACTION_ITEMS_LENGTH_CHANGE, [data.length, shift]);
    }
  });

  $effect.pre(() => {
    if (startMargin !== store.$getStartSpacerSize()) {
      store.$update(ACTION_START_OFFSET_CHANGE, startMargin);
    }
  });

  let prevStateVersion: StateVersion | undefined;
  $effect(() => {
    if (prevStateVersion === stateVersion) return;
    prevStateVersion = stateVersion;
    scroller.$fixScrollJump();
  });

  // ─── Exported handle methods ─────────────────────────────────────────────
  export const getCache =
    store.$getCacheSnapshot satisfies VirtualizerHandle["getCache"] as VirtualizerHandle["getCache"];
  export const getScrollOffset =
    store.$getScrollOffset satisfies VirtualizerHandle["getScrollOffset"] as VirtualizerHandle["getScrollOffset"];
  export const getScrollSize = (() =>
    computeScrollSize(
      store,
    )) satisfies VirtualizerHandle["getScrollSize"] as VirtualizerHandle["getScrollSize"];
  export const getViewportSize =
    store.$getViewportSize satisfies VirtualizerHandle["getViewportSize"] as VirtualizerHandle["getViewportSize"];
  export const findItemIndex =
    store.$findItemIndex satisfies VirtualizerHandle["findItemIndex"] as VirtualizerHandle["findItemIndex"];
  export const getItemOffset =
    store.$getItemOffset satisfies VirtualizerHandle["getItemOffset"] as VirtualizerHandle["getItemOffset"];
  export const getItemSize =
    store.$getItemSize satisfies VirtualizerHandle["getItemSize"] as VirtualizerHandle["getItemSize"];
  export const scrollToIndex =
    scroller.$scrollToIndex satisfies VirtualizerHandle["scrollToIndex"] as VirtualizerHandle["scrollToIndex"];
  export const scrollTo =
    scroller.$scrollTo satisfies VirtualizerHandle["scrollTo"] as VirtualizerHandle["scrollTo"];
  export const scrollBy =
    scroller.$scrollBy satisfies VirtualizerHandle["scrollBy"] as VirtualizerHandle["scrollBy"];

  // ─── Derived styles ──────────────────────────────────────────────────────
  let containerStyle = $derived(
    styleToString({
      contain: "size style",
      "overflow-anchor": "none",
      flex: "none",
      position: "relative",
      width: horizontal ? totalSize + "px" : "100%",
      height: horizontal ? "100%" : totalSize + "px",
      "pointer-events": isScrolling ? "none" : undefined,
    }),
  );
</script>

<svelte:element this={as} bind:this={containerRef} style={containerStyle}>
  {#each indexes as index (getKey(data[index]!, index))}
    {@const item = data[index]!}
    <ListItem
      {children}
      {item}
      {index}
      as={itemAs}
      offset={stateVersion && store.$getItemOffset(index, negative)}
      hide={stateVersion && store.$isUnmeasuredItem(index)}
      {horizontal}
      resizer={resizer.$observeItem}
    />
  {/each}
</svelte:element>
