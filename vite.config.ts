import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	server: {
		watch: {
			usePolling: true,
			useFsEvents: true
		}
	}
};

export default config;
