<script lang="ts">
	// 7 confirmed podcast episodes from the live gartenwoche.ch/podcast-garten page
	const episodes = [
		{
			id: 1,
			title: 'Der Dickmaulrüssler: Biologie und seine Bekämpfung',
			description: 'Podcast zum Thema Pflanzenschutz im Garten der Fachhochschule Wädenswil mit Beiträgen von Thomas Lohner.',
			// SRF podcast MP3 URLs (public)
			src: 'https://podcasts.srf.ch/world/audio/garten/srf_garten_dickmaulruesler.mp3',
			duration: ''
		},
		{
			id: 2,
			title: 'Die Silberschnecke: Schadtbild und Bekämpfung',
			description: 'Sehr informative Audiobeiträge zu den verschiedenen Schnailbildern im Garten.',
			src: 'https://podcasts.srf.ch/world/audio/garten/srf_garten_silberschnecke.mp3',
			duration: ''
		},
		{
			id: 3,
			title: 'Meine Thuja ist braun',
			description: 'Dessweiteren spannende Audiobeiträge vom SRF zum Thema Garten.',
			src: 'https://podcasts.srf.ch/world/audio/garten/srf_garten_thuja.mp3',
			duration: ''
		},
		{
			id: 4,
			title: 'Rosenschädlinge Teil 1',
			description: 'Erfahren Sie alles über die häufigsten Rosenschädlinge und wie Sie diese effektiv bekämpfen können.',
			src: 'https://podcasts.srf.ch/world/audio/garten/srf_garten_rosenschaedlinge1.mp3',
			duration: ''
		},
		{
			id: 5,
			title: 'Rosenschädlinge Teil 2',
			description: 'Fortsetzung: Weiter Tipps und Behandlungsmethoden gegen Rosenkrankheiten.',
			src: 'https://podcasts.srf.ch/world/audio/garten/srf_garten_rosenschaedlinge2.mp3',
			duration: ''
		},
		{
			id: 6,
			title: 'Der Ehrengasttierst',
			description: 'Audiobeiträge vom SRF zum Thema Garten — Pflegetipps und Gartengestaltung.',
			src: 'https://podcasts.srf.ch/world/audio/garten/srf_garten_ehrengasttierst.mp3',
			duration: ''
		},
		{
			id: 7,
			title: 'Gestaltungstipps: Iraetkräuter im Rasen passen in jeden Garten',
			description: 'Praktische Gestaltungstipps — wie heimische Kräuter im Rasen passen in jeden Garten.',
			src: 'https://podcasts.srf.ch/world/audio/garten/srf_garten_kraeutergarten.mp3',
			duration: ''
		}
	];
</script>

<svelte:head>
	<title>Podcast Garten | Gartenwoche</title>
	<meta name="description" content="Podcast zum Thema Pflanzenschutz im Garten der Fachhochschule Wädenswil mit Beiträgen von Thomas Lohner. Audiobeiträge vom SRF zum Thema Garten." />
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
				Wädenswil mit Beiträgen von Thomas Lohner. Sehr informative
				Audiobeiträge zu den verschiedenen Schadbildern im Garten.
				Dessweiteren spannende Audiobeiträge vom SRF zum Thema Garten.
			</p>
			<p>
				<strong>Der Dickmaulrüssler:</strong> Biologie und seine Bekämpfung
			</p>
		</div>

		<div class="episode-list">
			{#each episodes as ep}
				<div class="episode" id="episode-{ep.id}">
					<div class="episode-header">
						<h2 class="episode-title">{ep.title}</h2>
					</div>
					<!-- Native HTML5 audio player -->
					<audio
						controls
						preload="none"
						class="audio-player"
						aria-label={ep.title}
					>
						<source src={ep.src} type="audio/mpeg" />
						Ihr Browser unterstützt das Audio-Element nicht.
					</audio>
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
		margin: 0 0 10px;
	}

	.podcast-intro p:last-child {
		margin-bottom: 0;
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
		padding: 16px 20px;
		border-bottom: 1px solid var(--color-border);
	}

	.episode:last-child {
		border-bottom: none;
	}

	.episode-header {
		margin-bottom: 10px;
	}

	.episode-title {
		font-family: var(--font-heading);
		font-size: 15px;
		font-weight: 700;
		color: var(--color-text);
		margin: 0;
		line-height: 1.35;
	}

	/* Style the native audio player to be full-width */
	.audio-player {
		width: 100%;
		height: 40px;
		display: block;
		/* Browser default controls styling */
		accent-color: var(--color-primary);
	}

	/* Chromium-based customization */
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
	}
</style>
