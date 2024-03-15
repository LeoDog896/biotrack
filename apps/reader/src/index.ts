import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { z } from 'zod';

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
		.mutation(() => {
			// TODO: write to card
		})
});

// Export the app router type to be imported on the client side
export type AppRouter = typeof appRouter;

// Create HTTP server
const { listen } = createHTTPServer({
	router: appRouter
});

// Listen on port 2022
listen(2022);
