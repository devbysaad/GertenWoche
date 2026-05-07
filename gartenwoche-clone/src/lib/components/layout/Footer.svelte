<script lang="ts">
	import Logo from './Logo.svelte';
</script>

<footer class="site-footer">
	<!-- 3-column grid -->
	<div class="container footer-grid">
		<!-- Col 1: Logo + description -->
		<div class="footer-col">
			<div class="footer-brand">
				<div class="footer-logo-wrap">
					<span class="footer-logo-text">
						<span class="fl-garten">Garten</span><span class="fl-woche">woche</span>
					</span>
					<span class="pro-badge">PRO</span>
				</div>
				<p class="footer-desc">Das unabhängige Gartenmagazin für die Schweiz</p>
			</div>
		</div>

		<!-- Col 2: Pro Links -->
		<div class="footer-col">
			<h3 class="footer-heading">Pro Links</h3>
			<ul class="footer-links">
				<li><a href="/branchenverzeichnis">Branchenverzeichnis</a></li>
				<li><a href="/stellenangebote-fuer-die-gruene-branche">Stellenangebote für die grüne Branche</a></li>
				<li><a href="/veranstaltungen">Veranstaltungen</a></li>
			</ul>
		</div>

		<!-- Col 3: Legal -->
		<div class="footer-col">
			<h3 class="footer-heading">Rechtliches</h3>
			<ul class="footer-links">
				<li><a href="/datenschutzerklaerung">Datenschutzerklärung</a></li>
				<li><a href="/allgemeine-geschaeftsbedingungen">Allgemeine Geschäftsbedingungen</a></li>
				<li><a href="/abonnement">Abonnement</a></li>
				<li><a href="/impressum">Impressum</a></li>
				<li><a href="/schreiben-sie-uns">Schreiben Sie uns</a></li>
			</ul>
		</div>
	</div>

	<!-- AWIN Affiliate Banner -->
	<div class="footer-affiliate">
		<a
			href="https://www.awin1.com/cread.php?s=2436107&v=15934&q=368245&r=602261"
			target="_blank"
			rel="noopener noreferrer sponsored"
			class="affiliate-banner"
			aria-label="Partnerangebot"
		>
			<div class="affiliate-placeholder">
				<span>Werbung</span>
			</div>
		</a>
	</div>

	<!-- Bottom bar -->
	<div class="footer-bottom">
		<div class="container footer-bottom-inner">
			<p class="footer-copyright">© 2025 Gartenwoche. Alle Rechte vorbehalten.</p>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		background: var(--color-primary);
		color: rgba(255, 255, 255, 0.85);
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 40px;
		padding-top: 48px;
		padding-bottom: 40px;
	}

	.footer-brand {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.footer-logo-wrap {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.footer-logo-text {
		font-family: var(--font-heading);
		font-weight: 900;
		font-size: 22px;
		line-height: 1;
	}

	.fl-garten {
		color: #fff;
	}

	.fl-woche {
		color: var(--color-accent);
	}

	.footer-desc {
		font-family: var(--font-body);
		font-size: 13px;
		color: rgba(255, 255, 255, 0.65);
		margin: 0;
		line-height: 1.5;
	}

	.footer-heading {
		font-family: var(--font-heading);
		font-size: 12px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-accent);
		margin-bottom: 16px;
	}

	.footer-links {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.footer-links a {
		font-family: var(--font-body);
		font-size: 13px;
		color: rgba(255, 255, 255, 0.8);
		transition: color 0.2s ease;
		line-height: 1.4;
	}

	.footer-links a:hover {
		color: var(--color-accent);
	}

	/* Affiliate */
	.footer-affiliate {
		display: flex;
		justify-content: center;
		padding: 24px 0;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.affiliate-banner {
		display: block;
	}

	.affiliate-placeholder {
		width: 300px;
		height: 250px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px dashed rgba(255, 255, 255, 0.2);
		border-radius: var(--radius-sm);
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.3);
		font-family: var(--font-heading);
		font-size: 12px;
		letter-spacing: 0.06em;
	}

	/* Bottom bar */
	.footer-bottom {
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		padding: 16px 0;
	}

	.footer-bottom-inner {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.footer-copyright {
		font-family: var(--font-body);
		font-size: 12px;
		color: rgba(255, 255, 255, 0.5);
		margin: 0;
	}

	/* Responsive */
	@media (max-width: 767px) {
		.footer-grid {
			grid-template-columns: 1fr;
			gap: 28px;
			padding-top: 32px;
			padding-bottom: 28px;
		}
	}

	@media (min-width: 768px) and (max-width: 1023px) {
		.footer-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
