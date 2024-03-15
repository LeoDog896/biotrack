import { prisma } from '$lib/prismaConnection.js';
import { error } from '@sveltejs/kit';

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();

        const name = data.get('name');

        if (!name) {
            error(400, 'Name not specified');
        }

        if (typeof name !== 'string') {
            error(400, 'Name must be a string');
        }

        await prisma.user.create({
            data: {
                name
            }
        });

        return {
            success: true,
            message: 'Player created'
        }
    }
}