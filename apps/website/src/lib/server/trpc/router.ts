import type { Context } from '$lib/server/trpc/context';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Event } from 'ts-typed-events';
import { observable } from '@trpc/server/observable';
import { prisma } from '$lib/prismaConnection';

const pingEvent = new Event<Message>();

interface Message {
	message: string;
	officerID: string;
	officerName: string;
}

export const t = initTRPC.context<Context>().create();

export const router = t.router({
	ping: t.procedure
		.input(
			z.object({
				message: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			await prisma.message.create({
				data: {
					content: input.message.substring(0, 280),
					officer: {
						connect: {
							id: ctx.officer.id
						}
					}
				}
			});
			pingEvent.emit({
				message: input.message.substring(0, 280),
				officerID: ctx.officer.id,
				officerName: ctx.officer.name
			});
		}),
	pingSubscription: t.procedure.subscription(() => {
		return observable<Message>((observer) => {
			const callback = (message: Message) => {
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
