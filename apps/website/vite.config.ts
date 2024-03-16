import { sveltekit } from '@sveltejs/kit/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { defineConfig } from 'vitest/config';
import Icons from 'unplugin-icons/vite';
import { vitePluginTrpcWebSocket } from 'trpc-sveltekit/websocket';

export default defineConfig({
	plugins: [
		sveltekit(),
		basicSsl(),
		Icons({
			compiler: 'svelte'
		}),
		vitePluginTrpcWebSocket
	],
	server: {
		proxy: {},
		port: 5000
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
