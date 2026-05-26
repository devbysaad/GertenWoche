<script lang="ts">
	import { PODCAST_EPISODES, proxiedAudioUrl } from '$lib/api/video';

	let audioRefs: HTMLAudioElement[] = $state([]);

	// Pause every other episode when one starts playing, so only one plays at a time.
	function handlePlay(event: Event) {
		const playing = event.currentTarget as HTMLAudioElement;
		for (const el of audioRefs) {
			if (el && el !== playing && !el.paused) {
				el.pause();
			}
		}
	}

	function setRef(el: HTMLAudioElement | null, idx: number) {
		if (el) audioRefs[idx] = el;
	}
</script>

<svelte:head>
	<title>Podcast Garten | Gartenwoche</title>
	<meta
		name="description"
		content="Podcast zum Thema Pflanzenschutz im Garten der Fachhochschule Wädenswil mit Beiträgen von Thomas Lohner. Audiobeiträge vom SRF zum Thema Garten."
	/>
</svelte:head>

<div class="podcast-page">
	<div class="container-narrow">
		<nav class="breadcrumb" aria-label="Breadcrumb">
			<a href="/">Start</a>
			<span class="sep">›</span>
			<span>Podcast Garten</span>
		</nav>

		<h1 class="podcast-heading">Podcast Garten</h1>

		<div class="podcast-intro">
			<p>
				Podcast zum Thema <strong>Pflanzenschutz</strong> im Garten der Fachhochschule
				Wädenswil mit Beiträgen von Thomas Lohner. Sehr informative Audiobeiträge
				zu den verschiedenen Schadbildern im Garten. Dessweiteren spannende
				Audiobeiträge vom SRF zum Thema Garten.
			</p>
		</div>

		<div class="episode-list">
			{#each PODCAST_EPISODES as ep, idx (ep.id)}
				<div class="episode" id="episode-{ep.id}">
					<div class="episode-header">
						<span class="episode-number" aria-hidden="true">{ep.id}</span>
						<h2 class="episode-title">{ep.title}</h2>
					</div>

					<audio
						bind:this={audioRefs[idx]}
						controls
						preload="none"
						class="audio-player"
						aria-label={ep.title}
						onplay={handlePlay}
					>
						<source src={proxiedAudioUrl(ep.url)} type="audio/mpeg" />
						Ihr Browser unterstützt das Audio-Element nicht.
					</audio>

					<div class="episode-meta">
						<a
							class="download-link"
							href={proxiedAudioUrl(ep.url)}
							download="{ep.title}.mp3"
							rel="noopener"
						>
							MP3 herunterladen
						</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.podcast-page {
		padding: 24px 0 56px;
		background: var(--color-bg);
	}

	.breadcrumb {
		font-family: var(--font-body);
		font-size: 13px;
		color: var(--color-text-muted);
		margin-bottom: 16px;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.breadcrumb a {
		color: var(--color-text-muted);
	}

	.breadcrumb a:hover {
		color: var(--color-primary);
	}

	.sep {
		color: var(--color-text-faint);
	}

	.podcast-heading {
		font-family: var(--font-heading);
		font-size: 28px;
		font-weight: 800;
		text-transform: uppercase;
		color: var(--color-text);
		margin: 0 0 20px;
		letter-spacing: 0.02em;
		border-bottom: 2px solid var(--color-border);
		padding-bottom: 12px;
	}

	.podcast-intro {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 20px 24px;
		margin-bottom: 24px;
	}

	.podcast-intro p {
		font-family: var(--font-body);
		font-size: 14px;
		line-height: 1.7;
		color: var(--color-text);
		margin: 0;
	}

	.episode-list {
		display: flex;
		flex-direction: column;
		gap: 0;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.episode {
		padding: 18px 20px;
		border-bottom: 1px solid var(--color-border);
	}

	.episode:last-child {
		border-bottom: none;
	}

	.episode-header {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
	}

	.episode-number {
		flex: 0 0 auto;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: var(--color-primary);
		color: #fff;
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 700;
		border-radius: 50%;
	}

	.episode-title {
		font-family: var(--font-heading);
		font-size: 15px;
		font-weight: 700;
		color: var(--color-text);
		margin: 0;
		line-height: 1.35;
	}

	.audio-player {
		width: 100%;
		height: 40px;
		display: block;
		accent-color: var(--color-primary);
	}

	.episode-meta {
		margin-top: 8px;
		display: flex;
		justify-content: flex-end;
	}

	.download-link {
		font-family: var(--font-body);
		font-size: 12px;
		color: var(--color-primary);
		text-decoration: none;
	}

	.download-link:hover {
		text-decoration: underline;
	}

	audio::-webkit-media-controls-panel {
		background-color: var(--color-bg);
	}

	@media (max-width: 767px) {
		.podcast-page {
			padding: 16px 0 40px;
		}

		.episode {
			padding: 14px 16px;
		}

		.episode-number {
			width: 28px;
			height: 28px;
			font-size: 13px;
		}
	}
</style>
