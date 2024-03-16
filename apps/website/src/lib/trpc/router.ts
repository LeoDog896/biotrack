import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Event } from 'ts-typed-events';

const pingEvent = new Event<string>();

export const t = initTRPC.context<Context>().create();

export const router = t.router({
	ping: t.procedure
		.input(
			z.object({
				message: z.string()
			})
		)
		.mutation(async (message) => {})
});

export type Router = typeof router;
