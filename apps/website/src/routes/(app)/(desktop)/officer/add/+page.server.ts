import { prisma } from '$lib/prismaConnection';
import { makePassword } from '$lib/server/password.js';
import { validateSession } from '$lib/server/validateSession.js';
import { createId } from '@paralleldrive/cuid2';
import { error } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { officer: thisOfficer } = await parent();

	if (!thisOfficer.admin) {
		error(403, 'You do not have permission to view this page');
	}
};

export const actions = {
	default: async ({ cookies, request }) => {
		const officer = await validateSession(cookies);

		if (!officer.admin) {
			error(403, 'You do not have permission to view this page');
		}

		const data = await request.formData();

		const name = data.get('name');
		const password = data.get('password');
		const confirmPassword = data.get('passwordConfirm');
		const admin = data.get('admin') === 'on';

		if (!name) error(400, 'Name is required');
		if (!password) error(400, 'Password is required');
		if (password !== confirmPassword) error(400, 'Passwords do not match');

		if (typeof name !== 'string') error(400, 'Name must be a string');
		if (typeof password !== 'string') error(400, 'Password must be a string');

		const { hash: hashedPassword, salt } = await makePassword(password);

		const newOfficer = await prisma.officer.create({
			data: {
				name,
				admin,
				password: hashedPassword,
				salt,
				id: createId(),
				createdByOfficerId: officer.id
			},
			select: {
				id: true,
				name: true,
				admin: true
			}
		});

		return {
			newOfficer
		};
	}
};
