import { prisma } from '$lib/prismaConnection.js';
import { validateSession } from '$lib/server/validateSession.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const game = await prisma.game.findUnique({
		where: {
			id: parseInt(params.id)
		},
		include: {
			joinRequests: {
				include: {
					user: true,
					forceSent: {
						select: {
							name: true,
							id: true
						}
					}
				}
			},
			sessions: {
				include: {
					user: true,
					scoreBlock: true
				}
			}
		}
	});

	if (!game) {
		error(404, 'Game not found');
	}

	return {
		game
	};
};

export const actions = {
	name: async ({ params, request, cookies }) => {
		await validateSession(cookies);

		const data = await request.formData();

		const name = data.get('name');

		if (!name) {
			error(400, 'Name is required');
		}

		if (typeof name !== 'string') {
			error(400, 'Name must be a string');
		}

		const game = await prisma.game.findUnique({
			where: {
				id: parseInt(params.id)
			}
		});

		if (!game) {
			error(404, 'Game not found');
		}

		await prisma.game.update({
			where: {
				id: game.id
			},
			data: {
				name
			}
		});

		return {
			success: true,
			message: 'Name updated'
		};
	}
};
