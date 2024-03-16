import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { prisma } from "$lib/prismaConnection";

export const load: LayoutServerLoad = async ({ cookies }) => {
    const sessionString = cookies.get("session");

    if (!sessionString) {
        redirect(302, "/login");
    }

    const officer = await prisma.officer.findFirst({
        where: {
            sessions: {
                some: {
                    token: sessionString,
                },
            },
        },
        select: {
            name: true,
            id: true,
            admin: true
        }
    });

    if (!officer) {
        redirect(302, "/login");
    }

    return {
        officer
    }
}
