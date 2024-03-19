import { prisma } from '$lib/prismaConnection';
import { verifyPassword } from '$lib/server/password.js';
import { error, redirect } from '@sveltejs/kit';
import { createId } from '@paralleldrive/cuid2';

const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

export const load = async ({ parent }) => {
	const data = await parent();
	const officerCount = await prisma.officer.count();

	return {
		shouldIndicateNoOfficers: officerCount === 0 && data.local
	};
};

export const actions = {
	login: async ({ request, cookies, getClientAddress }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		if (!username) error(400, 'Username is required');
		if (!password) error(400, 'Password is required');

		if (typeof username !== 'string') error(400, 'Username must be a string');
		if (typeof password !== 'string') error(400, 'Password must be a string');

		const officer = await prisma.officer.findFirst({
			where: {
				name: username
			},
			select: {
				password: true,
				salt: true
			}
		});

		if (!officer) error(400, 'Invalid username or password');

		if (!(await verifyPassword(password, officer.password, officer.salt))) {
			error(400, 'Invalid username or password');
		}

		const session = await prisma.officerSession.create({
			data: {
				officer: {
					connect: {
						name: username
					}
				},
				token: createId(),
				lastUsed: new Date(),
				expires: new Date(Date.now() + ONE_WEEK),
				ip: getClientAddress(),
				userAgent: request.headers.get('user-agent') || ''
			}
		});

		cookies.set('session', session.token, {
			path: '/',
			expires: new Date(Date.now() + ONE_WEEK),
			sameSite: 'strict',
			httpOnly: true
		});

		redirect(302, '/');
	}
};
