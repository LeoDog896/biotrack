import { prisma } from '$lib/prismaConnection.js';
import { validateSession } from '$lib/server/validateSession.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params, parent }) => {
	const officer = await prisma.officer.findFirst({
		where: {
			id: params.id
		},
		select: {
			name: true,
			id: true,
			admin: true
		}
	});

	if (!officer) {
		error(404, 'Officer not found');
	}

	return {
		officer,
		thisOfficer: (await parent()).officer
	};
};

export const actions = {
	promote: async ({ cookies, params }) => {
		const officer = await validateSession(cookies);

		if (!officer.admin) {
			error(403, 'You do not have permission to view this page');
		}

		await prisma.officer.update({
			where: {
				id: params.id
			},
			data: {
				admin: true
			}
		});
	}
}
