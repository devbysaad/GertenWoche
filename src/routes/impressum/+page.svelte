<script lang="ts">
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';

	const crumbs = [{ label: 'Impressum' }];
</script>

<svelte:head>
	<title>Impressum | Gartenwoche</title>
	<meta name="description" content="Impressum und Angaben gemäss Art. 5 UWG für Gartenwoche.ch." />
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="static-page">
	<div class="container container-narrow">
		<Breadcrumb crumbs={crumbs} />
		<h1 class="static-title">Impressum</h1>
		<div class="prose">
			<h2>Angaben gemäss Art. 5 UWG</h2>
			<p><strong>Gartenwoche</strong><br />
			Das unabhängige Gartenmagazin<br />
			Schweiz</p>

			<h2>Inhaber</h2>
			<p>Peter Küng<br />
			E-Mail: <a href="mailto:redaktion@gartenwoche.ch">redaktion@gartenwoche.ch</a></p>

			<h2>Haftungsausschluss</h2>
			<p>Die Inhalte unserer Seiten wurden mit grösster Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</p>

			<h2>Urheberrecht</h2>
			<p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem Schweizer Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung ausserhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
		</div>
	</div>
</div>
