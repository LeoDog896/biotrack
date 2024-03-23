import { prisma } from '$lib/prismaConnection';
import { redirect, type Cookies } from '@sveltejs/kit';

interface Officer {
	name: string;
	id: string;
	admin: boolean;
	archived: boolean;
	sessions: {
		expires: Date;
		lastUsed: Date;
		ip: string;
		createdAt: Date;
		userAgent: string;
	}[];
}

export const validateSessionOptionalString = async (sessionString: string | undefined): Promise<Officer | null> => {
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
			archived: true,
			sessions: {
				select: {
					expires: true,
					lastUsed: true,
					ip: true,
					createdAt: true,
					userAgent: true
				},
				orderBy: {
					lastUsed: 'desc'
				}
			}
		}
	});

	return officer;
};

export const validateSessionOptional = async (cookies: Cookies): Promise<Officer | null> => {
	const sessionString = cookies.get('session');

	return validateSessionOptionalString(sessionString);
};

export const validateSessionString = async (sessionString: string): Promise<Officer> => {
	const officer = await validateSessionOptionalString(sessionString);

	if (!officer) {
		redirect(302, '/login');
	}

	return officer;
}

export const validateSession = async (cookies: Cookies): Promise<Officer> => {
	const officer = await validateSessionOptional(cookies);

	if (!officer) {
		redirect(302, '/login');
	}

	return officer;
};
