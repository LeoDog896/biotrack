import { prisma } from '$lib/prismaConnection.js'
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
    const session = await prisma.session.findFirst({
        where: {
            gameId: parseInt(params.id),
            id: parseInt(params.sessionId)
        },
        include: {
            user: true,
            scoreBlock: true,
            game: true
        }
    });

    if (!session) error(404, 'Session not found');

    return {
        session
    }
}
