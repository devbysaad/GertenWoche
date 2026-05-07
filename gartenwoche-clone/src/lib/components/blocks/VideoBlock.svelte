<script lang="ts">
	// Real Vimeo video as confirmed from live site
	const vimeoId = '106571242';
	const videoTitle = 'Video der Woche';
</script>

<section class="video-block">
	<h2 class="section-heading">Video der Woche</h2>
	<div class="video-card">
		<div class="video-embed">
			<iframe
				src="https://player.vimeo.com/video/{vimeoId}?title=0&byline=0&portrait=0"
				title={videoTitle}
				allow="autoplay; fullscreen; picture-in-picture"
				allowfullscreen
				loading="lazy"
			></iframe>
		</div>
	</div>
</section>

<style>
	.video-block {
		margin-bottom: 32px;
	}

	.video-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.video-embed {
		position: relative;
		padding-bottom: 56.25%;
		height: 0;
		overflow: hidden;
	}

	.video-embed iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: none;
	}
</style>
