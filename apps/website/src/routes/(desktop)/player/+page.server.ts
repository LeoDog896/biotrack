import { prisma } from '$lib/prismaConnection';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createId } from '@paralleldrive/cuid2';

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name');

		if (!name) {
			return fail(400, { message: 'Name not specified' });
		}

		if (typeof name !== 'string') {
			return fail(400, { message: 'Name must be a string' });
		}

		const player = await prisma.user.create({
			data: {
				id: createId(),
				name
			}
		});

		return {
			player
		};
	}
} satisfies Actions;
