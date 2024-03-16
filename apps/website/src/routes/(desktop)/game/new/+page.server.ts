import { prisma } from '$lib/prismaConnection';
import { error } from '@sveltejs/kit';
import { createId } from '@paralleldrive/cuid2';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const name = data.get('name');

		if (!name) {
			error(400, 'Name is required');
		}

		if (typeof name !== 'string') {
			error(400, 'Name must be a string');
		}

		await prisma.game.create({
			data: {
				name,
				token: createId()
			}
		});

		return {
			success: true,
			message: 'Game created'
		};
	}
};
