import { prisma } from '$lib/prismaConnection.js';
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
