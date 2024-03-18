import { prisma } from '$lib/prismaConnection';

export const load = async () => {
	return {
		games: await prisma.game.findMany({
			include: {
				sessions: true,
				joinRequests: true
			}
		})
	};
};
