import { prisma } from '$lib/prismaConnection';
import { error } from '@sveltejs/kit';
import { createId } from '@paralleldrive/cuid2';
import { validateSession } from '$lib/server/validateSession';

export const load = async ({ parent }) => {
	const officer = (await parent()).officer;

	if (!officer.admin) error(403, 'You are not an admin');
};

export const actions = {
	default: async ({ request, cookies }) => {
		const officer = await validateSession(cookies);

		if (!officer.admin) error(403, 'You are not an admin');

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
