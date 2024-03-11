import { prisma } from "$lib/prismaConnection";

export const load = async () => {
	return {
		games: await prisma.game.findMany()
	};
};
