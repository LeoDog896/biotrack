import { prisma } from '$lib/prismaConnection';

export const load = async () => {
	return {
		users: await prisma.user.findMany({
			include: {
				scoreLedger: true
			}
		})
	};
};
