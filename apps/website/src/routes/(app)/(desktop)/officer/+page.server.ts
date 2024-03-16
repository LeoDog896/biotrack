import { prisma } from '$lib/prismaConnection';

export const load = async () => {
    const officers = await prisma.officer.findMany({
        select: {
            name: true,
            id: true,
            admin: true
        }
    });

    return {
        officers
    }
}
