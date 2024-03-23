import type { Context } from '$lib/server/trpc/context';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Event } from 'ts-typed-events';
import { observable } from '@trpc/server/observable';

const pingEvent = new Event<string>();

export const t = initTRPC.context<Context>().create();

export const router = t.router({
	ping: t.procedure
		.input(
			z.object({
				message: z.string()
			})
		)
		.mutation(async ({ input }) => {
			pingEvent.emit(input.message.substring(0, 280));
		}),
	pingSubscription: t.procedure.subscription(() => {
		return observable<string>((observer) => {
			const callback = (message: string) => {
				observer.next(message);
			};

			pingEvent.on(callback);

			return () => {
				pingEvent.off(callback);
			};
		});
	})
});

export type Router = typeof router;
