import { prisma } from '$lib/prismaConnection.js'
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
    const officer = await prisma.officer.findFirst({
        where: {
            id: params.id
        },
        select: {
            name: true,
            id: true,
            admin: true
        }
    });

    if (!officer) {
        error(404, 'Officer not found');
    }

    return {
        officer
    }
}