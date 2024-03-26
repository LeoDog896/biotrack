import { prisma } from '$lib/prismaConnection.js';
import { validateSession } from '$lib/server/validateSession.js';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

const usersSchema = z.array(z.object({
	label: z.string(),
	value: z.string()
}))

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
				},
				orderBy: {
					createdAt: 'desc'
				}
			},
			sessions: {
				include: {
					user: true,
					scoreBlock: true
				},
				orderBy: {
					createdAt: 'desc'
				}
			}
		}
	});

	if (!game) {
		error(404, 'Game not found');
	}

	return {
		game,
		users: await prisma.user.findMany()
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
	},
	acknowledge: async ({ params, request, cookies }) => {
		await validateSession(cookies);

		const game = await prisma.game.findUnique({
			where: {
				id: parseInt(params.id)
			}
		});

		if (!game) {
			error(404, 'Game not found');
		}

		const data = await request.formData();

		const joinRequestId = data.get('joinRequestId');

		if (!joinRequestId) error(400, 'joinRequestId is required');
		if (typeof joinRequestId !== 'string') error(400, 'joinRequestId must be a string');

		const joinRequest = await prisma.joinRequest.findUnique({
			where: {
				id: parseInt(joinRequestId)
			},
			include: {
				game: true
			}
		});

		if (!joinRequest) error(404, 'Join request not found');

		await prisma.joinRequest.update({
			where: {
				id: joinRequest.id
			},
			data: {
				acknowledged: true
			}
		});

		const joinRequests = [joinRequest];

		const session = await prisma.session.create({
			data: {
				game: {
					connect: {
						id: game.id
					}
				},
				active: true,
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

		return {
			success: true,
			message: 'Session created',
			session
		};
	},
	joinRequest: async ({ params, request, cookies }) => {
		const officer = await validateSession(cookies);

		const data = await request.formData();

		const userId = data.get('userId');

		if (!userId) error(400, 'userId is required');
		if (typeof userId !== 'string') error(400, 'userId must be a string');

		const user = await prisma.user.findUnique({
			where: {
				id: userId
			}
		});

		if (!user) error(404, 'User not found');

		const game = await prisma.game.findUnique({
			where: {
				id: parseInt(params.id)
			}
		});

		if (!game) error(404, 'Game not found');

		const joinRequest = await prisma.joinRequest.create({
			data: {
				user: {
					connect: {
						id: user.id
					}
				},
				game: {
					connect: {
						id: game.id
					}
				},
				acknowledged: false,
				forceSent: {
					connect: {
						id: officer.id
					}
				}
			}
		});

		return {
			success: true,
			message: 'Join request created',
			joinRequest
		};
	},

	createSession: async ({ params, cookies, request }) => {
		await validateSession(cookies);

		const data = await request.formData();
		const users = data.get('users');

		if (!users) error(400, 'users is required');
		if (typeof users !== 'string') error(400, 'users must be a string');

		const parsedUsers = usersSchema.parse(JSON.parse(users));

		const game = await prisma.game.findUnique({
			where: {
				id: parseInt(params.id)
			}
		});

		if (!game) error(404, 'Game not found');

		const session = await prisma.session.create({
			data: {
				game: {
					connect: {
						id: game.id
					}
				},
				active: true,
				data: '',
				user: {
					connect: parsedUsers.map((user) => {
						return {
							id: user.value
						};
					})
				}
			}
		});

		return {
			success: true,
			message: 'Session created',
			session
		};
	}
};
