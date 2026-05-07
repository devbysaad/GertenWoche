import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],


	build: {
		// Increase inline limit to avoid tiny file requests
		assetsInlineLimit: 4096,
		// No source maps in production (smaller bundle)
		sourcemap: false,
		// Modern output target
		target: 'esnext',
		rollupOptions: {
			output: {
				// Split large vendor chunks using function form (required by Rollup)
				manualChunks(id: string) {
					if (id.includes('node_modules/date-fns')) return 'vendor-datefns';
					if (id.includes('node_modules/marked')) return 'vendor-marked';
					if (id.includes('node_modules/lucide')) return 'vendor-icons';
				}
			}
		}
	},

	server: {
		port: 5173
	},

	// Pre-bundle these for faster dev startup
	optimizeDeps: {
		include: ['date-fns', 'marked']
	}
});
