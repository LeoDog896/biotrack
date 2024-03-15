import { prisma } from '$lib/prismaConnection';

export const load = async () => {
	return {
		players: await prisma.user.count(),
		games: await prisma.game.count(),
		sessions: await prisma.session.count()
	};
};
