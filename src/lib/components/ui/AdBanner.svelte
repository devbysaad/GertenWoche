<script lang="ts">
  interface Props {
    size?: '300x250' | '728x90' | '320x50' | '160x600';
    label?: boolean;
    mode?: 'awin' | 'adsense' | 'placeholder';
    adsenseClient?: string;
    adsenseSlot?: string;
  }

  let {
    size = '300x250',
    label = true,
    mode = 'awin',
    adsenseClient = '',
    adsenseSlot = ''
  }: Props = $props();

  const dimensions: Record<string, { w: number; h: number }> = {
    '300x250': { w: 300, h: 250 },
    '728x90': { w: 728, h: 90 },
    '320x50': { w: 320, h: 50 },
    '160x600': { w: 160, h: 600 }
  };

  const { w, h } = dimensions[size];

  const AWIN_CLICK_URL = 'https://www.awin1.com/cread.php?s=2436107&v=15934&q=368245&r=602261';
  const AWIN_IMG_URL = 'https://www.awin1.com/cshow.php?s=2436107&v=15934&q=368245&r=602261';
</script>

<div class="ad-wrapper">
  {#if label}
    <span class="ad-label">Werbung</span>
  {/if}

  {#if mode === 'awin'}
    <a href={AWIN_CLICK_URL} target="_blank" rel="noopener sponsored">
      <img
        src={AWIN_IMG_URL}
        width={w}
        height={h}
        alt="Werbung"
        loading="lazy"
        style="background:#F0F0F0; display:block; max-width:100%;"
      />
    </a>
  {:else if mode === 'adsense'}
    <ins
      class="adsbygoogle"
      style="display:block; width:{w}px; height:{h}px;"
      data-ad-client={adsenseClient}
      data-ad-slot={adsenseSlot}
      data-ad-format="auto"
    ></ins>
  {:else}
    <div class="ad-placeholder" style="width:{w}px; height:{h}px;">
      <span>Werbung</span>
    </div>
  {/if}
</div>

<style>
  .ad-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 16px 0;
    width: 100%;
  }
  .ad-label {
    font-family: 'Open Sans', sans-serif;
    font-size: 10px;
    color: #999999;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 4px;
    align-self: flex-start;
  }
  .ad-placeholder {
    background: #F7F7F7;
    border: 1px dashed #E0E0E0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Open Sans', sans-serif;
    font-size: 11px;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    max-width: 100%;
  }
</style>
