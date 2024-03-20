import { prisma } from '$lib/prismaConnection.js';
import { error } from '@sveltejs/kit';
import { createId } from '@paralleldrive/cuid2';
import { validateSession } from '$lib/server/validateSession.js';

export const actions = {
	default: async ({ request, cookies }) => {
		const officer = await validateSession(cookies);

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
				id: createId(),
				name,
				archived: false,
				createdByOfficerId: officer.id
			}
		});

		return {
			success: true,
			message: `Player ${name} created (cuid=${user.id})`,
			id: user.id
		};
	}
};
