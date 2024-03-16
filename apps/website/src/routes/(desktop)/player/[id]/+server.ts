import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/prismaConnection.js';

export const GET = async ({ params }) => {
	const user = await prisma.user.findUnique({
		where: {
			id: params.id,
			archived: false
		}
	});

	if (!user) {
		error(400, 'User not found');
	}

	return json(user);
};
