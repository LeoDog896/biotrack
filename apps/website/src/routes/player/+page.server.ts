import { prisma } from '$lib/prismaConnection';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load = async () => {
	return {
		users: await prisma.user.findMany()
	};
};

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
				name
			}
		});

		return {
			player
		};
	}
} satisfies Actions;
