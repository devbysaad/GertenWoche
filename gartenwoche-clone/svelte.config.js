import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	compilerOptions: {
		// Enable Svelte 5 runes for all non-node_modules files
		runes: ({ filename }) =>
			filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},

	kit: {
		adapter: adapter({
			// Output directory for the built server
			out: 'build',
			// Precompress static assets with brotli + gzip
			precompress: true,
			// Environment variable prefix for production secrets
			envPrefix: 'GARTENWOCHE_'
		}),

		alias: {
			$components: './src/lib/components',
			$stores: './src/lib/stores',
			$types: './src/lib/types',
			$data: './src/lib/data',
			$utils: './src/lib/utils',
			$api: './src/lib/api'
		},

		// Content Security Policy
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': ['self', 'unsafe-inline'],
				'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
				'font-src': ['self', 'https://fonts.gstatic.com'],
				'img-src': ['self', 'data:', 'https:', 'blob:'],
				'connect-src': ['self', 'https://gartenwoche.ch', 'https://api.openweathermap.org'],
				'frame-src': ['https://www.youtube.com', 'https://www.youtube-nocookie.com'],
				'media-src': ['self'],
				'object-src': ['none'],
				'base-uri': ['self'],
				'form-action': ['self'],
				'upgrade-insecure-requests': true
			}
		},

		// HTML output settings
		output: {
			preloadStrategy: 'modulepreload'
		}
	}
};

export default config;
