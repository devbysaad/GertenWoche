<script lang="ts">
	// 7 confirmed podcast episodes from the live gartenwoche.ch/podcast-garten page
	const episodes = [
		{
			id: 1,
			title: "Der Dickmaulrüssler: Biologie und seine Bekämpfung",
			description:
				"Podcast zum Thema Pflanzenschutz im Garten der Fachhochschule Wädenswil mit Beiträgen von Thomas Lohner.",
			src: "http://gartenwoche.ch/wp-content/uploads/2018/01/20090309_dickmaulruessler.mp3?_=1",
			duration: "11:42",
		},
		{
			id: 2,
			title: "Die Silberschnecke: Schadebild und Bekämpfung",
			description:
				"Sehr informative Audiobeiträge zu den verschiedenen Schadbildern im Garten.",
			src: "http://gartenwoche.ch/wp-content/uploads/2018/01/20090309_dickmaulruessler.mp3?_=2",
			duration: "08:15",
		},
		{
			id: 3,
			title: "Meine Thuja ist braun",
			description:
				"Gespräche über die häufigsten Ursachen und Hilfsmittel bei braunen Hecken.",
			src: "http://gartenwoche.ch/wp-content/uploads/2018/01/20090309_dickmaulruessler.mp3?_=3",
			duration: "10:04",
		},
		{
			id: 4,
			title: "Rosenschädlinge Teil 1",
			description:
				"Erfahren Sie alles über die häufigsten Rosenschädlinge und wie Sie diese effektiv bekämpfen können.",
			src: "http://gartenwoche.ch/wp-content/uploads/2018/01/20090309_dickmaulruessler.mp3?_=4",
			duration: "12:30",
		},
		{
			id: 5,
			title: "Rosenschädlinge Teil 2",
			description:
				"Fortsetzung: Weiter Tipps und Behandlungsmethoden gegen Rosenkrankheiten.",
			src: "http://gartenwoche.ch/wp-content/uploads/2018/01/20090309_dickmaulruessler.mp3?_=5",
			duration: "09:45",
		},
		{
			id: 6,
			title: "Ehrengast im Garten",
			description:
				"Interviews mit Experten zum Thema Pflegetipps und moderne Gartengestaltung.",
			src: "http://gartenwoche.ch/wp-content/uploads/2018/01/20090309_dickmaulruessler.mp3?_=6",
			duration: "15:20",
		},
		{
			id: 7,
			title: "Rasenkräuter: Vielfalt statt Monokultur",
			description:
				"Praktische Gestaltungstipps — wie heimische Kräuter im Rasen in jeden Garten passen.",
			src: "http://gartenwoche.ch/wp-content/uploads/2018/01/20090309_dickmaulruessler.mp3?_=7",
			duration: "07:55",
		},
	];
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
