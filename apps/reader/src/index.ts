import { initTRPC } from '@trpc/server';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { z } from 'zod';
import ws from 'ws';
import { createServer } from 'node:https';
import { createServer as createHttpServer } from 'node:http';
import selfsigned from 'selfsigned';
import fs from 'node:fs';

const pems = selfsigned.generate(undefined, {
	days: 365
});

const server = createServer({
	cert: pems.cert,
	key: pems.private
});

const wss = new ws.Server({
	noServer: true
});

const t = initTRPC.create();

const appRouter = t.router({
	read: t.procedure.query(() => {
		// TODO: query for card
		return 'data';
	}),
	write: t.procedure
		.input(
			z.object({
				data: z.string()
			})
		)
		.mutation(async () => {
			// TODO: write to card
			return 'done';
		})
});

const handler = applyWSSHandler({ wss, router: appRouter });

export type AppRouter = typeof appRouter;

wss.on('connection', (ws) => {
	console.log(`+ Connection (${wss.clients.size})`);
	ws.once('close', () => {
		console.log(`- Connection (${wss.clients.size})`);
	});
});

server.on('upgrade', function upgrade(request, socket, head) {
	wss.handleUpgrade(request, socket, head, function done(ws) {
		wss.emit('connection', ws, request);
	});
});

// get 'ferret.jpg' relative to this file
const ferret = new URL('ferret.jpg', import.meta.url);
const ferretContent = fs.readFileSync(ferret);
const ferretServer = createHttpServer((req, res) => {
	/**
	 * the reason why we serve an image is
	 * because of [Mixed Block](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content#mixed_active_content).
	 *
	 * Mixed block means we can't try to scan for these APIs
	 * unless they're:
	 * - in the same protocol (http / http, https / https)
	 * - OR an image
	 *
	 * So, we request this image to be able to scan for the WebSocket API.
	 */
	if (req.url === '/ferret.jpg') {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
		res.writeHead(200, { 'Content-Type': 'image/jpeg' });
		res.end(ferretContent);
		return;
	}
});

// on the /health endpoint, disable CORS
server.on('request', (req, res) => {
	if (req.url === '/health') {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(
			JSON.stringify({
				size: wss.clients.size
			})
		);
	}
});

process.on('SIGTERM', () => {
	handler.broadcastReconnectNotification();
	wss.close();
	server.close();
});

server.listen(2022);
ferretServer.listen(2023);

console.log('✅ WebSocket Server listening on wss://localhost:2022');
console.log('✅ Check status at http://localhost:2023/ferret.jpg');
