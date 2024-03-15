import { prisma } from '$lib/prismaConnection.js'
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
    const game = await prisma.game.findUnique({
        where: {
            id: parseInt(params.id)
        }
    });

    if (!game) {
        error(404, 'Game not found');
    }

    return {
        game
    }
}