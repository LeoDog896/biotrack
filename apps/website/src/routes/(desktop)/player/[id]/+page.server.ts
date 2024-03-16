import { prisma } from '$lib/prismaConnection';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const user = await prisma.user.findUnique({
		where: {
			id: params.id
		}
	});

	if (!user) {
		error(404, 'User not found');
	}

	const scoreBlocks = await prisma.scoreBlock.findMany({
		where: {
			userId: user.id
		}
	});

	const score = scoreBlocks.reduce((acc, block) => acc + block.score, 0);

	return {
		user,
		score,
		sessions: await prisma.session.count({
			where: {
				user: {
					some: {
						id: user.id
					}
				}
			}
		}),
		joinRequests: await prisma.joinRequest.count({
			where: {
				userId: user.id
			}
		}),
		activeJoinRequest: await prisma.joinRequest.count({
			where: {
				userId: user.id,
				acknowledged: false,
				cancelled: false,
				supersededJoinRequest: {
					is: null
				}
			}
		})
	};
};

export const actions = {
	name: async ({ request, params }) => {
		const data = await request.formData();
		const name = data.get('name');

		if (!name) {
			return error(400, { message: 'Name not specified' });
		}

		if (typeof name !== 'string') {
			return error(400, { message: 'Name must be a string' });
		}

		const player = await prisma.user.findUnique({
			where: {
				id: params.id
			}
		});

		if (!player) {
			return error(404, 'Player not found');
		}

		await prisma.user.update({
			where: {
				id: params.id
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
