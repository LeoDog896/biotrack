import { prisma } from '$lib/prismaConnection.js';
import { validateSession } from '$lib/server/validateSession';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const session = await prisma.session.findFirst({
		where: {
			id: parseInt(params.id)
		},
		include: {
			user: true,
			scoreBlock: true,
			game: true
		}
	});

	if (!session) error(404, 'Session not found');

	return {
		session
	};
};

export const actions = {
	finish: async ({ params, cookies }) => {
		await validateSession(cookies);

		const session = await prisma.session.findFirst({
			where: {
				id: parseInt(params.id)
			},
			include: {
				user: true
			}
		});

		if (!session) error(404, 'Session not found');

		const data = await prisma.session.update({
			where: {
				id: session.id
			},
			data: {
				active: false
			}
		});

		return {
			success: true,
			message: 'Session finished',
			session: data
		};
	}
};
