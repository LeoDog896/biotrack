import { initTRPC } from '@trpc/server';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { z } from 'zod';
import ws from 'ws';

const wss = new ws.Server({
	port: 2022,
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
console.log('✅ WebSocket Server listening on ws://localhost:3001');

process.on('SIGTERM', () => {
	console.log('SIGTERM');
	handler.broadcastReconnectNotification();
	wss.close();
});
