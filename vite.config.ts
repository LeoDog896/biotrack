import { sveltekit } from '@sveltejs/kit/vite';
import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit(), basicSsl()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
