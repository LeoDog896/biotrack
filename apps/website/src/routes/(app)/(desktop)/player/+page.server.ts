import { prisma } from '$lib/prismaConnection';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createId } from '@paralleldrive/cuid2';
import { validateSession } from '$lib/server/validateSession';

export const actions = {
	create: async ({ request, cookies }) => {
		const officer = await validateSession(cookies);

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
				name,
				createdByOfficerId: officer.id
			}
		});

		return {
			player
		};
	}
} satisfies Actions;
