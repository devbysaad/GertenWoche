<script lang="ts">
	import { modalStore } from '$lib/stores/modal.store.js';
</script>

<section class="footer-cta">
	<div class="container cta-inner">
		<p class="cta-text">
			Dieser Blog ist unabhängig und wird privat betrieben. Wenn Ihnen die Inhalte gefallen,
			unterstützen Sie uns durch eine kostenlose Registrierung.
		</p>
		<button class="cta-btn" onclick={() => modalStore.openRegister()}>
			Hier registrieren
		</button>
	</div>
</section>

<style>
	.footer-cta {
		background: var(--color-bg);
		border-top: 1px solid var(--color-border);
		padding: 32px 0;
	}

	.cta-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 16px;
	}

	.cta-text {
		font-family: var(--font-body);
		font-size: 15px;
		color: var(--color-text-muted);
		max-width: 600px;
		margin: 0;
		line-height: 1.7;
	}

	.cta-btn {
		background: var(--color-primary);
		color: #fff;
		font-family: var(--font-heading);
		font-size: 14px;
		font-weight: 700;
		padding: 12px 32px;
		border-radius: var(--radius-sm);
		border: none;
		cursor: pointer;
		letter-spacing: 0.03em;
		transition: background 0.2s ease;
	}

	.cta-btn:hover {
		background: var(--color-primary-hover);
	}
</style>
