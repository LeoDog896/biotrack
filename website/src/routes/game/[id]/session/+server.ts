import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prismaConnection';
import { error } from 'console';

export const GET = async ({ params }) => {
	const session = await prisma.session.findFirst({
		where: {
			gameId: params.id,
			active: true
		}
	});

	if (!session) {
		error(404, 'No active sessions found.');
	}

	return json({
		session
	})
};
