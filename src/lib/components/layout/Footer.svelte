<script lang="ts">
	import Logo from './Logo.svelte';
</script>

<footer class="site-footer">

	<!-- ── TOP ROW: Logo (left) + Pro links (right) ── -->
	<div class="footer-top">
		<div class="container footer-top-inner">

			<!-- Logo image -->
			<Logo compact />

			<!-- Horizontal pro links -->
			<nav class="footer-pro-links" aria-label="Pro-Links">
				<a href="/branchenverzeichnis">Branchenverzeichnis</a>
				<a href="/stellenangebote-fuer-die-gruene-branche">Stellenangebote für die grüne Branche</a>
				<a href="/veranstaltungen">Veranstaltungen</a>
			</nav>
		</div>
	</div>

	<!-- Horizontal rule -->
	<div class="footer-rule">
		<div class="container"><hr /></div>
	</div>

	<!-- ── MAIN: Legal (left) | Hinweis (right) ── -->
	<div class="footer-main">
		<div class="container footer-main-inner">

			<!-- Left: legal links (vertical list) -->
			<nav class="footer-legal" aria-label="Rechtliches">
				<a href="/datenschutzerklaerung">Datenschutzerklärung</a>
				<a href="/allgemeine-geschaeftsbedingungen">Allgemeine Geschäftsbedingungen</a>
				<a href="/abonnement">Abonnement</a>
				<a href="/impressum">Impressum</a>
				<a href="/schreiben-sie-uns">Kontaktformular</a>
			</nav>

			<!-- Right: Hinweis in eigener Sache -->
			<div class="footer-hinweis">
				<h3 class="hinweis-heading">Hinweis in eigener Sache</h3>
				<p class="hinweis-text">
					Dieser Blog ist unabhängig und wird privat betrieben. Wenn Ihnen die Inhalte gefallen
					und Sie die Fortführung unterstützen möchten, können Sie dies mit einem
					<strong>Abonnement</strong> tun.
				</p>
				<a href="/abonnement" class="hinweis-btn">Hier registrieren</a>
			</div>

		</div>
	</div>

	<!-- ── AD BANNER + COPYRIGHT ── -->
	<div class="footer-bottom">
		<div class="container footer-bottom-inner">
			<!-- Affiliate banner (alltours style) -->
			<a
				href="https://www.awin1.com/cread.php?s=2436107&v=15934&q=368245&r=602261"
				target="_blank"
				rel="noopener noreferrer sponsored"
				class="affiliate-link"
				aria-label="Partnerangebot"
			>
				<div class="affiliate-placeholder" aria-hidden="true">
					<span>Werbung</span>
				</div>
			</a>

			<p class="footer-copyright">© 2025 Gartenwoche. Alle Rechte vorbehalten.</p>
		</div>
	</div>

</footer>

<style>
	.site-footer {
		background: #ffffff;
		border-top: 1px solid #e0e0e0;
		font-family: 'Roboto', sans-serif;
	}

	/* ── TOP ROW ── */
	.footer-top {
		padding: 22px 0 16px;
	}

	.footer-top-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
	}

	/* Horizontal pro links — right side */
	.footer-pro-links {
		display: flex;
		align-items: center;
		gap: 28px;
	}

	.footer-pro-links a {
		font-family: 'Roboto', sans-serif;
		font-size: 14px;
		font-weight: 500;
		color: #333;
		text-decoration: none;
		white-space: nowrap;
		transition: color 0.15s;
	}

	.footer-pro-links a:hover { color: #2D1B69; }

	/* ── DIVIDER ── */
	.footer-rule { padding: 0; }
	.footer-rule hr {
		border: none;
		border-top: 1px solid #e0e0e0;
		margin: 0;
	}

	/* ── MAIN: 2 columns ── */
	.footer-main {
		padding: 28px 0 24px;
	}

	.footer-main-inner {
		display: grid;
		grid-template-columns: 220px 1fr;
		gap: 48px;
		align-items: start;
	}

	/* Legal links (left column) */
	.footer-legal {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.footer-legal a {
		font-family: 'Roboto', sans-serif;
		font-size: 14px;
		color: #333;
		text-decoration: none;
		transition: color 0.15s;
		line-height: 1.4;
	}

	.footer-legal a:hover { color: #2D1B69; }

	/* Hinweis block (right column) */
	.footer-hinweis {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		max-width: 460px;
	}

	.hinweis-heading {
		font-family: 'Roboto', sans-serif;
		font-size: 16px;
		font-weight: 700;
		color: #222;
		margin: 0;
	}

	.hinweis-text {
		font-family: Verdana, Geneva, sans-serif;
		font-size: 14px;
		color: #444;
		line-height: 1.65;
		margin: 0;
	}

	/* Green "Hier registrieren" button */
	.hinweis-btn {
		display: inline-block;
		background: #4a8c3f;
		color: #ffffff;
		font-family: 'Roboto', sans-serif;
		font-size: 14px;
		font-weight: 500;
		padding: 10px 22px;
		border-radius: 4px;
		text-decoration: none;
		border: 2px solid #4a8c3f;
		transition: background 0.15s, border-color 0.15s;
		cursor: pointer;
	}

	.hinweis-btn:hover {
		background: #3a7030;
		border-color: #3a7030;
		color: #fff;
	}

	/* ── BOTTOM: affiliate + copyright ── */
	.footer-bottom {
		padding: 16px 0 20px;
		border-top: 1px solid #ebebeb;
	}

	.footer-bottom-inner {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	/* Ad placeholder (shows where alltours banner would load) */
	.affiliate-link {
		display: inline-block;
	}

	.affiliate-placeholder {
		width: 230px;
		height: 170px;
		background: #f5f5f5;
		border: 1px solid #ddd;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #aaa;
		font-size: 11px;
		font-family: 'Roboto', sans-serif;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.footer-copyright {
		font-family: 'Roboto', sans-serif;
		font-size: 13px;
		color: #666;
		margin: 0;
	}

	/* ── RESPONSIVE ── */
	@media (max-width: 767px) {
		.footer-top-inner {
			flex-direction: column;
			align-items: flex-start;
			gap: 16px;
		}

		.footer-pro-links {
			flex-direction: column;
			align-items: flex-start;
			gap: 10px;
		}

		.footer-main-inner {
			grid-template-columns: 1fr;
			gap: 28px;
		}
	}
</style>
