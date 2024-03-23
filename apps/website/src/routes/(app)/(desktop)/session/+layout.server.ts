import { prisma } from '$lib/prismaConnection';

export const load = async () => {
	return {
		sessions: await prisma.session.findMany({
			include: {
				game: {
					select: {
						name: true,
						id: true
					}
				},
				user: {
					select: {
						id: true
					}
				},
				scoreBlock: {
					select: {
						id: true
					}
				}
			}
		})
	};
};
