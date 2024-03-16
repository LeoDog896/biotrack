import { prisma } from '$lib/prismaConnection';

export const load = async () => {
	return {
		players: await prisma.user.count({
			where: {
				archived: false
			}
		}),
		games: await prisma.game.count(),
		sessions: await prisma.session.count()
	};
};
