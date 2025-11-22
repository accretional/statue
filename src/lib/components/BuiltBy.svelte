<script lang="ts">
  // No props needed for now, but can be added later if needed
</script>

<div class="built-by-container">
  <span class="built-text">Built by</span>
  <a href="https://accretional.com" target="_blank" rel="noopener noreferrer" class="built-link accretional-link">
    <img src="/accretion.png" alt="Accretional" class="accretion-icon" />Accretional.com
  </a>
  <span class="built-text">Built in</span>
  <span class="statue-group">
    <img src="/favicon.png" alt="Statue" class="statue-icon" />
    <a href="https://statue.dev" target="_blank" rel="noopener noreferrer" class="built-link statue-link">
      Statue.dev
    </a>
  </span>
</div>

<style>
  .built-by-container {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: clamp(1rem, 2vw, 1.2rem);
    font-weight: 400;
    line-height: 1.6;
  }
  
  .built-text {
    color: rgba(255, 255, 255, 0.8);
  }
  
  .built-link {
    text-decoration: underline;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .accretional-link {
    color: #FF4500;
    text-shadow: 0 0 30px rgba(255, 69, 0, 0.5);
    animation: glow 2s ease-in-out infinite;
    position: relative;
  }
  
  .accretional-link:hover {
    color: #FF6347;
    text-shadow: 0 0 20px rgba(255, 99, 71, 0.8), 0 0 30px rgba(255, 69, 0, 0.6);
    animation: pulse 1s ease-in-out infinite;
  }
  
  @keyframes glow {
    0%, 100% {
      text-shadow: 0 0 10px rgba(255, 69, 0, 0.5), 0 0 20px rgba(255, 69, 0, 0.3);
    }
    50% {
      text-shadow: 0 0 20px rgba(255, 69, 0, 0.8), 0 0 30px rgba(255, 69, 0, 0.5), 0 0 40px rgba(255, 69, 0, 0.3);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      text-shadow: 0 0 20px rgba(255, 99, 71, 0.8), 0 0 30px rgba(255, 69, 0, 0.6);
    }
    50% {
      transform: scale(1.05);
      text-shadow: 0 0 30px rgba(255, 99, 71, 1), 0 0 40px rgba(255, 69, 0, 0.8), 0 0 50px rgba(255, 69, 0, 0.6);
    }
  }
  
  .statue-link {
    color: #9CA3AF;
  }
  
  .statue-link:hover {
    color: #D1D5DB;
  }
  
  .accretion-icon {
    width: 1.2em;
    height: 1.2em;
    display: inline-block;
    vertical-align: middle;
  }
  
  .statue-icon {
    width: 1.2em;
    height: 1.2em;
    display: inline-block;
    vertical-align: middle;
  }
  
  .statue-group {
    display: inline-flex;
    align-items: center;
    gap: 0.15rem;
  }
</style>
