import { prisma } from '$lib/prismaConnection';
import { makePassword } from '$lib/server/password.js';
import { validateSession } from '$lib/server/validateSession';
import { error } from '@sveltejs/kit';

export const load = async () => {
	const officers = await prisma.officer.findMany({
		select: {
			name: true,
			id: true,
			admin: true,
			sessions: true
		}
	});

	return {
		officers
	};
};

export const actions = {
	changePassword: async ({ request, cookies }) => {
		const officer = await validateSession(cookies);

		const data = await request.formData();
		const password = data.get('password');

		if (!password) error(400, 'Password is required');
		if (typeof password !== 'string') error(400, 'Password must be a string');

		const { hash, salt } = await makePassword(password);

		await prisma.officer.update({
			where: {
				id: officer.id
			},
			data: {
				password: hash,
				salt
			}
		});
	}
};
