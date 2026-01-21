
<script lang="ts">
  import type { BuiltByProps } from './types';
  import accretionIconSrc from '../assets/accretion.png';
  import statueIconSrc from '../assets/favicon.png';

  let {
    builtByText = 'Built by',
    builtByLinkText = 'Accretional.com',
    builtByLinkUrl = 'https://accretional.com',
    builtByIcon = accretionIconSrc,
    builtInText = 'Built in',
    builtInLinkText = 'Statue.dev',
    builtInLinkUrl = 'https://statue.dev',
    builtInIcon = statueIconSrc,
    builtForText = 'Built for',
    communityLinkText = 'Statue Community',
    communityLinkUrl = 'https://discord.gg/accretional'
  }: BuiltByProps = $props();
</script>

<div class="built-by-container flex flex-wrap justify-center items-center gap-2">
  <span class="built-text whitespace-nowrap">{builtByText}</span>
  <a href={builtByLinkUrl} target="_blank" rel="noopener noreferrer" class="built-link accretional-link inline-flex items-center gap-1">
    <img src={builtByIcon} alt={builtByLinkText} class="accretion-icon" width="24" height="24" />{builtByLinkText}
  </a>
  <span class="built-text whitespace-nowrap">{builtInText}</span>
  <span class="statue-group inline-flex items-center gap-1">
    <img src={builtInIcon} alt={builtInLinkText} class="statue-icon" width="24" height="24" />
    <a href={builtInLinkUrl} target="_blank" rel="noopener noreferrer" class="built-link statue-link">
      {builtInLinkText}
    </a>
  </span>
  <span class="built-text whitespace-nowrap">{builtForText}</span>
  <span class="discord-link inline-flex items-center gap-1">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"></path></svg>
    <a href={communityLinkUrl} target="_blank" class="discord-link-text underline">{communityLinkText}</a>
  </span>
</div>

<style>
  .discord-link {
    color: rgba(114, 137, 218, 0.95);
  }
  
  /* Remove display: inline-flex from built-by-container since we use Tailwind flex classes */
  .built-by-container {
    font-size: clamp(1rem, 2vw, 1.2rem);
    font-weight: 400;
    line-height: 1.6;
  }
  
  .built-text {
    color: var(--color-foreground);
    opacity: 0.8;
  }
  
  .built-link {
    text-decoration: underline;
    transition: all 0.3s ease;
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
    color: var(--color-muted);
  }
  
  .statue-link:hover {
    color: var(--color-foreground);
  }
  
  .accretion-icon, .statue-icon {
    /* Keep sizing for compatibility but rely on attributes/Tailwind mostly */
    width: 1.2em;
    height: 1.2em;
    display: inline-block;
    vertical-align: middle;
  }
  
  /* .statue-group removed display styles as they are now in HTML classes */
</style>

