<script lang="ts">
  // 3D Scrolling Testimonials
  export let testimonials: Array<{
    name: string;
    username: string;
    body: string;
    img: string;
    country: string;
  }> = [];

  let isPaused = false;
</script>

<div class="testimonial-container">
  <div class="perspective-wrapper">
    <div class="marquee-grid">
      <!-- Column 1: Downward -->
      <div class="marquee-column" on:mouseenter={() => isPaused = true} on:mouseleave={() => isPaused = false}>
        <div class="marquee-content" class:paused={isPaused}>
          {#each Array(3) as _, repeatIndex}
            {#each testimonials as review}
              <div class="testimonial-card">
                <div class="card-content">
                  <div class="user-info">
                    <div class="avatar">
                      <img src={review.img} alt={review.username} />
                    </div>
                    <div class="user-details">
                      <div class="user-name">
                        {review.name} <span class="country">{review.country}</span>
                      </div>
                      <div class="username">{review.username}</div>
                    </div>
                  </div>
                  <blockquote class="review-body">{review.body}</blockquote>
                </div>
              </div>
            {/each}
          {/each}
        </div>
      </div>

      <!-- Column 2: Upward (reverse) -->
      <div class="marquee-column" on:mouseenter={() => isPaused = true} on:mouseleave={() => isPaused = false}>
        <div class="marquee-content reverse" class:paused={isPaused}>
          {#each Array(3) as _, repeatIndex}
            {#each testimonials as review}
              <div class="testimonial-card">
                <div class="card-content">
                  <div class="user-info">
                    <div class="avatar">
                      <img src={review.img} alt={review.username} />
                    </div>
                    <div class="user-details">
                      <div class="user-name">
                        {review.name} <span class="country">{review.country}</span>
                      </div>
                      <div class="username">{review.username}</div>
                    </div>
                  </div>
                  <blockquote class="review-body">{review.body}</blockquote>
                </div>
              </div>
            {/each}
          {/each}
        </div>
      </div>

      <!-- Column 3: Downward -->
      <div class="marquee-column" on:mouseenter={() => isPaused = true} on:mouseleave={() => isPaused = false}>
        <div class="marquee-content" class:paused={isPaused}>
          {#each Array(3) as _, repeatIndex}
            {#each testimonials as review}
              <div class="testimonial-card">
                <div class="card-content">
                  <div class="user-info">
                    <div class="avatar">
                      <img src={review.img} alt={review.username} />
                    </div>
                    <div class="user-details">
                      <div class="user-name">
                        {review.name} <span class="country">{review.country}</span>
                      </div>
                      <div class="username">{review.username}</div>
                    </div>
                  </div>
                  <blockquote class="review-body">{review.body}</blockquote>
                </div>
              </div>
            {/each}
          {/each}
        </div>
      </div>

      <!-- Column 4: Upward (reverse) -->
      <div class="marquee-column" on:mouseenter={() => isPaused = true} on:mouseleave={() => isPaused = false}>
        <div class="marquee-content reverse" class:paused={isPaused}>
          {#each Array(3) as _, repeatIndex}
            {#each testimonials as review}
              <div class="testimonial-card">
                <div class="card-content">
                  <div class="user-info">
                    <div class="avatar">
                      <img src={review.img} alt={review.username} />
                    </div>
                    <div class="user-details">
                      <div class="user-name">
                        {review.name} <span class="country">{review.country}</span>
                      </div>
                      <div class="username">{review.username}</div>
                    </div>
                  </div>
                  <blockquote class="review-body">{review.body}</blockquote>
                </div>
              </div>
            {/each}
          {/each}
        </div>
      </div>
    </div>

    <!-- Gradient overlays -->
    <div class="gradient-overlay gradient-top"></div>
    <div class="gradient-overlay gradient-bottom"></div>
    <div class="gradient-overlay gradient-left"></div>
    <div class="gradient-overlay gradient-right"></div>
  </div>
</div>

<style>
  .testimonial-container {
    border: 1px solid rgba(128, 128, 128, 0.3);
    border-radius: 0.5rem;
    position: relative;
    display: flex;
    height: 24rem;
    width: 100%;
    max-width: 800px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    gap: 0.375rem;
    perspective: 300px;
    background: rgba(0, 0, 0, 0.2);
  }

  .perspective-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    transform: translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg);
    position: relative;
    height: 100%;
  }

  .marquee-grid {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    height: 100%;
  }

  .marquee-column {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .marquee-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    animation: scroll-down 40s linear infinite;
  }

  .marquee-content.reverse {
    animation: scroll-up 40s linear infinite;
  }

  .marquee-content.paused {
    animation-play-state: paused;
  }

  @keyframes scroll-down {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-50%);
    }
  }

  @keyframes scroll-up {
    0% {
      transform: translateY(-50%);
    }
    100% {
      transform: translateY(0);
    }
  }

  .testimonial-card {
    width: 200px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(128, 128, 128, 0.3);
    border-radius: 0.75rem;
    padding: 1rem;
    transition: all 0.3s;
    flex-shrink: 0;
  }

  .testimonial-card:hover {
    border-color: rgba(128, 128, 128, 0.6);
    box-shadow: 0 0 15px rgba(128, 128, 128, 0.4);
    transform: scale(1.02);
  }

  .card-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .avatar {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    overflow: hidden;
    background: rgba(128, 128, 128, 0.2);
    border: 2px solid rgba(128, 128, 128, 0.4);
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .user-details {
    display: flex;
    flex-direction: column;
  }

  .user-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .country {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .username {
    font-size: 0.75rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.7);
  }

  .review-body {
    margin: 0;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
  }

  .gradient-overlay {
    pointer-events: none;
    position: absolute;
  }

  .gradient-top {
    inset: 0 0 auto 0;
    height: 25%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), transparent);
  }

  .gradient-bottom {
    inset: auto 0 0 0;
    height: 25%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  }

  .gradient-left {
    inset: 0 auto 0 0;
    width: 25%;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.9), transparent);
  }

  .gradient-right {
    inset: 0 0 0 auto;
    width: 25%;
    background: linear-gradient(to left, rgba(0, 0, 0, 0.9), transparent);
  }
</style>
