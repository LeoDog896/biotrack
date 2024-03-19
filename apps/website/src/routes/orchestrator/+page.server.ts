import { prisma } from "$lib/prismaConnection"
import { makePassword } from "$lib/server/password.js";
import { createId } from "@paralleldrive/cuid2";
import { error } from "@sveltejs/kit";

export const load = async () => {
    const officers = await prisma.officer.findMany({
        select: {
            name: true,
            admin: true,
            id: true
        }
    });

    return {
        officers
    }
}

export const actions = {
    add: async ({ request, url }) => {
        const isLocal = url.host === "localhost:5000";

        if (!isLocal) error(403, "You are not authorized to perform this action");

        const data = await request.formData();

        const name = data.get("name");
        const password = data.get("password");
        const confirmPassword = data.get("passwordConfirm");
        const admin = data.get("admin") === "on";

        if (!name) error(400, "Name is required");
        if (!password) error(400, "Password is required");
        if (password !== confirmPassword) error(400, "Passwords do not match");

        if (typeof name !== "string") error(400, "Name must be a string");
        if (typeof password !== "string") error(400, "Password must be a string");

        const { hash: hashedPassword, salt } = await makePassword(password);

        const officer = await prisma.officer.create({
            data: {
                name,
                admin,
                password: hashedPassword,
                salt,
                id: createId()
            }
        });

        return {
            officer
        }
    }
}