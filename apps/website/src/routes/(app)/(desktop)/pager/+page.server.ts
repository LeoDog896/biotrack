import { prisma } from '$lib/prismaConnection';

export const load = async () => {
	return {
		messages: await prisma.message.findMany({
			include: {
				officer: {
					select: {
						name: true,
						id: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			},
			take: 200
		})
	};
};
