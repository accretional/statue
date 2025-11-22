<script lang="ts">
  import accretionIcon from '../assets/accretion.png';
  import statueIcon from '../assets/favicon.png';
</script>

<div class="built-by-container">
  <span class="built-text">Built by</span>
  <a href="https://accretional.com" target="_blank" rel="noopener noreferrer" class="built-link accretional-link">
    <img src={accretionIcon} alt="Accretional" class="accretion-icon" />Accretional.com
  </a>
  <span class="built-text">Built in</span>
  <span class="statue-group">
    <img src={statueIcon} alt="Statue" class="statue-icon" />
    <a href="https://statue.dev" target="_blank" rel="noopener noreferrer" class="built-link statue-link">
      Statue.dev
    </a>
  </span>
  <span class="built-text">Built for</span>
  <span class="statue-group">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"></path></svg>
    <a href="https://discord.gg/accretional" target="_blank" class="built-link statue-link">Statue Community</a>
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
