import { prisma } from '$lib/prismaConnection';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateGame } from '$lib/server/validateGame';

export const POST: RequestHandler = async ({ params, url }) => {
	const game = await validateGame(params.id);

	const ids = url.searchParams.getAll('id');

	const joinRequests = await Promise.all(
		ids.map(async (id) => {
			const joinRequest = await prisma.joinRequest.findUnique({
				where: {
					id: parseInt(id)
				}
			});

			if (!joinRequest) {
				error(400, 'Join request not found');
			}

			return joinRequest;
		})
	);

	if (joinRequests.length !== ids.length) {
		for (const id of ids) {
			if (!joinRequests.find((jr) => jr.id === parseInt(id))) {
				error(400, `Join request ${id} not found`);
			}
		}
	}

	const session = await prisma.session.create({
		data: {
			game: {
				connect: {
					id: game.id
				}
			},
			active: false,
			data: '',
			user: {
				connect: joinRequests.map((jr) => {
					return {
						id: jr.userId
					};
				})
			}
		}
	});

	await prisma.joinRequest.deleteMany({
		where: {
			id: {
				in: ids.map((id) => parseInt(id))
			}
		}
	});

	return json({
		session
	});
};
