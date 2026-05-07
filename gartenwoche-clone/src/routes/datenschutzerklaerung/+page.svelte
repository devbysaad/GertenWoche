<script lang="ts">
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
	const crumbs = [{ label: 'Datenschutzerklärung' }];
</script>

<svelte:head>
	<title>Datenschutzerklärung | Gartenwoche</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="static-page">
	<div class="container container-narrow">
		<Breadcrumb crumbs={crumbs} />
		<h1 class="static-title">Datenschutzerklärung</h1>
		<div class="prose">
			<h2>1. Datenschutz auf einen Blick</h2>
			<h3>Allgemeine Hinweise</h3>
			<p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>

			<h2>2. Allgemeine Hinweise und Pflichtinformationen</h2>
			<h3>Verantwortliche Stelle</h3>
			<p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist Gartenwoche (Peter Küng, Schweiz).</p>

			<h2>3. Datenerfassung auf dieser Website</h2>
			<h3>Cookies</h3>
			<p>Unsere Internetseite verwendet sogenannte „Cookies". Cookies sind kleine Datenpakete und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.</p>

			<h3>Server-Log-Dateien</h3>
			<p>Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.</p>

			<h2>4. Soziale Medien</h2>
			<p>Diese Website enthält Links zu sozialen Netzwerken (Facebook, Instagram, X). Beim Anklicken dieser Links werden Sie auf die Seiten der jeweiligen Anbieter weitergeleitet.</p>
		</div>
	</div>
</div>
