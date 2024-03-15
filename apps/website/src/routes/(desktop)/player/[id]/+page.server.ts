import { prisma } from '$lib/prismaConnection';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const user = await prisma.user.findUnique({
		where: {
			id: params.id
		}
	});

	if (!user) {
		error(404, 'User not found');
	}

	return {
		user
	};
};

export const actions = {
	// TODO: minor security vulnerability
	name: async ({ request, params }) => {
		const data = await request.formData();
		const name = data.get('name');

		if (!name) {
			return error(400, { message: 'Name not specified' });
		}

		if (typeof name !== 'string') {
			return error(400, { message: 'Name must be a string' });
		}

		const player = await prisma.user.findUnique({
			where: {
				id: params.id
			}
		});

		if (!player) {
			return error(404, 'Player not found');
		}

		await prisma.user.update({
			where: {
				id: params.id
			},
			data: {
				name
			}
		});

		return {
			success: true,
			message: 'Name updated'
		};
	}
};
