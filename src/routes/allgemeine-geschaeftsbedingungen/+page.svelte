<script lang="ts">
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
	const crumbs = [{ label: 'AGB' }];
</script>

<svelte:head>
	<title>Allgemeine Geschäftsbedingungen | Gartenwoche</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="static-page">
	<div class="container container-narrow">
		<Breadcrumb crumbs={crumbs} />
		<h1 class="static-title">Allgemeine Geschäftsbedingungen</h1>
		<div class="prose">
			<h2>§ 1 Geltungsbereich</h2>
			<p>Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung des Online-Angebotes von Gartenwoche (gartenwoche.ch).</p>

			<h2>§ 2 Registrierung</h2>
			<p>Die Nutzung bestimmter Dienste erfordert eine kostenlose Registrierung. Mit der Registrierung erklären Sie sich mit diesen AGB einverstanden.</p>

			<h2>§ 3 PRO-Mitgliedschaft</h2>
			<p>Die PRO-Mitgliedschaft gewährt Zugang zu exklusiven Inhalten. Die Abonnementgebühren werden gemäss den Angaben auf der Abonnement-Seite erhoben.</p>

			<h2>§ 4 Haftungsbeschränkung</h2>
			<p>Gartenwoche übernimmt keine Haftung für die Richtigkeit und Vollständigkeit der bereitgestellten Informationen.</p>

			<h2>§ 5 Änderungen</h2>
			<p>Gartenwoche behält sich das Recht vor, diese AGB jederzeit zu ändern. Die geänderten AGB werden auf der Website veröffentlicht.</p>
		</div>
	</div>
</div>
