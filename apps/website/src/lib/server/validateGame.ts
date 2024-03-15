import { prisma } from "$lib/prismaConnection";
import { error } from "@sveltejs/kit";

export async function validateGame(gameId: string | undefined | null) {
    if (!gameId) {
		error(400, 'No game id provided');
	}

	const game = await prisma.game.findUnique({
		where: {
			id: parseInt(gameId)
		}
	});

	if (!game) {
		error(400, 'Game not found');
	}

    return game;
}