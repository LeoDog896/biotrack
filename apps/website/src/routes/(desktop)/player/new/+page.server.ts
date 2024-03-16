import { prisma } from '$lib/prismaConnection.js';
import { error } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const name = data.get('name');

		if (!name) {
			error(400, 'Name not specified');
		}

		if (typeof name !== 'string') {
			error(400, 'Name must be a string');
		}

		const user = await prisma.user.create({
			data: {
				name,
				archived: false
			}
		});

		return {
			success: true,
			message: `Player ${name} created (cuid=${user.id})`
		};
	}
};
