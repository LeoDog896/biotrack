import { initTRPC } from '@trpc/server';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { z } from 'zod';
import ws from 'ws';
import { createServer } from 'node:http';

const server = createServer();

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
console.log('✅ WebSocket Server listening on ws://localhost:2022');

server.on('upgrade', function upgrade(request, socket, head) {
	wss.handleUpgrade(request, socket, head, function done(ws) {
		wss.emit('connection', ws, request);
	})
});

// on the /health endpoint, disable CORS
server.on('request', (req, res) => {
	if (req.url === '/health') {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({
			size: wss.clients.size
		}));
	}
});

process.on('SIGTERM', () => {
	handler.broadcastReconnectNotification();
	wss.close();
	server.close();
});

server.listen(2022);
