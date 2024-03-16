import { prisma } from '$lib/prismaConnection';
import { redirect, type Cookies } from '@sveltejs/kit';

interface Officer {
	name: string;
	id: string;
	admin: boolean;
	archived: boolean;
}

export const validateSessionOptional = async (cookies: Cookies): Promise<Officer | null> => {
	const sessionString = cookies.get('session');

	if (!sessionString) {
		return null;
	}

	const officer = await prisma.officer.findFirst({
		where: {
			sessions: {
				some: {
					token: sessionString
				}
			},
			archived: false
		},
		select: {
			name: true,
			id: true,
			admin: true,
			archived: true
		}
	});

	return officer;
};

export const validateSession = async (cookies: Cookies): Promise<Officer> => {
	const officer = await validateSessionOptional(cookies);

	if (!officer) {
		redirect(302, '/login');
	}

	return officer;
};
