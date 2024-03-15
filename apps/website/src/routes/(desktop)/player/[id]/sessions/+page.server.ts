import { prisma } from '$lib/prismaConnection';

export const load = async ({ params }) => {
	const sessions = await prisma.session.findMany({
		where: {
			user: {
				some: {
					id: params.id
				}
			}
		},
		include: {
			user: true,
			game: true
		}
	});

	return {
		sessions
	};
};
