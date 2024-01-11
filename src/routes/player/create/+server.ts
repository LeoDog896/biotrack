import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/prismaConnection.js';

export const POST = ({ url }) => {
	const name = url.searchParams.get("name");

	if (!name) {
		error(400, "Name not specified");
	}

	const player = prisma.user.create({
		data: {
			name
		}
	})

	return json(player);
};
