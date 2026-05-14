<script lang="ts">
	let { data } = $props();
	const entry = $derived(data.entry);

	const fullAddress = $derived(
		[entry.address, entry.zip && entry.city ? `${entry.zip} ${entry.city}` : entry.city, entry.country]
			.filter(Boolean)
			.join(', ')
	);

	const pageTitle = $derived(`${entry.name} | Branchenverzeichnis | Gartenwoche`);

	function formatWebsite(url: string): string {
		try {
			return new URL(url).hostname.replace(/^www\./, '');
		} catch {
			return url;
		}
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={`${entry.name} – ${entry.city}, ${entry.country}. ${entry.description?.slice(0, 150) ?? ''}`} />
	<link rel="canonical" href="https://gartenwoche.ch/branchenverzeichnis/eintrag/{entry.slug}" />
</svelte:head>

<div class="entry-page">
	<div class="container">

		<!-- Breadcrumb -->
		<nav class="breadcrumb" aria-label="Brotkrümelpfad">
			<a href="/">Home</a>
			<span class="bc-sep">›</span>
			<a href="/branchenverzeichnis">Branchenverzeichnis</a>
			<span class="bc-sep">›</span>
			<span>{entry.name}</span>
		</nav>

		<!-- Main card -->
		<div class="entry-card">

			<!-- Top section: Logo left + Contact right -->
			<div class="entry-top">
				<!-- Logo -->
				<div class="entry-logo-wrap">
					{#if entry.logo && entry.logo.trim() !== ''}
						<img
							src={entry.logo}
							alt="{entry.name} Logo"
							class="entry-logo-img"
							loading="eager"
						/>
					{:else}
						<div class="entry-logo-ph">
							<span>{entry.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}</span>
						</div>
					{/if}
				</div>

				<!-- Contact details -->
				<div class="entry-contact">
					{#if fullAddress}
						<div class="contact-row">
							<svg class="ci" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-label="Adresse">
								<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
								<circle cx="12" cy="10" r="3"/>
							</svg>
							<span>{fullAddress}</span>
						</div>
					{/if}

					{#if entry.phone}
						{#each entry.phone as tel}
							<div class="contact-row">
								<svg class="ci" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-label="Telefon">
									<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.42 2 2 0 0 1 3.62 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.27 6.27l.91-1.36a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
								</svg>
								<a href="tel:{tel.replace(/\s/g,'')}" class="contact-link">{tel}</a>
							</div>
						{/each}
					{/if}

					{#if entry.email}
						<div class="contact-row">
							<svg class="ci" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-label="E-Mail">
								<rect x="2" y="4" width="20" height="16" rx="2"/>
								<path d="M2 8l10 7 10-7"/>
							</svg>
							<a href="mailto:{entry.email}" class="contact-link">{entry.email}</a>
						</div>
					{/if}

					{#if entry.website}
						<div class="contact-row">
							<svg class="ci" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-label="Webseite">
								<circle cx="12" cy="12" r="10"/>
								<line x1="2" y1="12" x2="22" y2="12"/>
								<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
							</svg>
							<a href={entry.website} target="_blank" rel="noopener noreferrer" class="contact-link">
								{formatWebsite(entry.website)}
							</a>
						</div>
					{/if}

					{#if entry.category}
						<div class="contact-row">
							<span class="entry-cat-badge">{entry.category}</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Description -->
			{#if entry.description}
				<div class="entry-desc">
					{#each entry.description.split('\n\n') as para}
						<p>{para}</p>
					{/each}
				</div>
			{/if}

			<!-- Action buttons -->
			<div class="entry-actions">
				<button class="action-btn" type="button">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
						<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
					</svg>
					Share
				</button>
				<button class="action-btn" type="button">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
					</svg>
					Bookmark
				</button>
				<a href="/schreiben-sie-uns" class="action-btn action-report">
					Diesen Eintrag beanstanden
				</a>
			</div>

			<!-- Tabs -->
			<div class="entry-tabs" role="tablist">
				<a href="#reviews" class="tab-item" role="tab">Reviews</a>
				<a href="#photos" class="tab-item" role="tab">Photos (1)</a>
				<a href="#related" class="tab-item" role="tab">Related Listings</a>
				<a href="#nearby" class="tab-item" role="tab">Nearby Listings</a>
			</div>

			<!-- Tab placeholder panels -->
			<div id="reviews" class="tab-panel">
				<p class="tab-empty">Noch keine Bewertungen vorhanden.</p>
			</div>
		</div>

	</div>
</div>

<style>
	.entry-page { padding: 20px 0 48px; background: #f7f7f7; }

	/* Breadcrumb */
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 16px;
		font-family: 'Open Sans', sans-serif;
		font-size: 12px;
		color: #777;
		flex-wrap: wrap;
	}
	.breadcrumb a { color: #2D1B69; text-decoration: none; }
	.breadcrumb a:hover { text-decoration: underline; }
	.bc-sep { color: #CCC; }

	/* Main card */
	.entry-card {
		background: #fff;
		border: 1px solid #E0E0E0;
		border-radius: 4px;
		overflow: hidden;
	}

	/* Top: logo + contact */
	.entry-top {
		display: flex;
		gap: 0;
		border-bottom: 1px solid #E0E0E0;
	}

	/* Logo panel */
	.entry-logo-wrap {
		width: 180px;
		min-height: 140px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		border-right: 1px solid #E0E0E0;
		background: #fafafa;
	}
	.entry-logo-img {
		max-width: 140px;
		max-height: 100px;
		object-fit: contain;
	}
	.entry-logo-ph {
		width: 100px;
		height: 80px;
		background: #E0E0E0;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.entry-logo-ph span {
		font-family: 'Roboto', sans-serif;
		font-size: 22px;
		font-weight: 900;
		color: #888;
	}

	/* Contact info */
	.entry-contact {
		padding: 20px 24px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
	}
	.contact-row {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		font-family: 'Open Sans', sans-serif;
		font-size: 13px;
		color: #444;
	}
	.ci {
		flex-shrink: 0;
		margin-top: 1px;
		color: #777;
	}
	.contact-link {
		color: #2D1B69;
		text-decoration: none;
	}
	.contact-link:hover { text-decoration: underline; }

	.entry-cat-badge {
		display: inline-block;
		background: #F7C900;
		color: #2D1B69;
		font-family: 'Roboto', sans-serif;
		font-size: 10px;
		font-weight: 700;
		padding: 2px 8px;
		border-radius: 2px;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	/* Description */
	.entry-desc {
		padding: 20px 24px;
		border-bottom: 1px solid #E0E0E0;
	}
	.entry-desc p {
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #444;
		line-height: 1.7;
		margin: 0 0 12px;
	}
	.entry-desc p:last-child { margin-bottom: 0; }

	/* Actions */
	.entry-actions {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 12px 24px;
		border-bottom: 1px solid #E0E0E0;
		flex-wrap: wrap;
	}
	.action-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 14px;
		border: 1px solid #D0D0D0;
		border-radius: 3px;
		background: #fff;
		color: #555;
		font-family: 'Roboto', sans-serif;
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
		text-decoration: none;
		transition: all 0.15s;
	}
	.action-btn:hover { border-color: #2D1B69; color: #2D1B69; }
	.action-report {
		margin-left: auto;
		background: #F7C900;
		color: #2D1B69;
		border-color: #F7C900;
	}
	.action-report:hover { background: #e6b800; border-color: #e6b800; color: #2D1B69; }

	/* Tabs */
	.entry-tabs {
		display: flex;
		border-bottom: 1px solid #E0E0E0;
		overflow-x: auto;
	}
	.tab-item {
		display: block;
		padding: 12px 20px;
		font-family: 'Roboto', sans-serif;
		font-size: 13px;
		font-weight: 600;
		color: #2D1B69;
		text-decoration: none;
		border-bottom: 3px solid transparent;
		white-space: nowrap;
		transition: all 0.15s;
	}
	.tab-item:first-child { border-bottom-color: #2D1B69; }
	.tab-item:hover { background: #f7f7f7; }

	/* Tab panel */
	.tab-panel { padding: 24px; }
	.tab-empty {
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		color: #888;
		margin: 0;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.entry-top { flex-direction: column; }
		.entry-logo-wrap { width: 100%; min-height: 100px; border-right: none; border-bottom: 1px solid #E0E0E0; }
		.action-report { margin-left: 0; }
	}
</style>
