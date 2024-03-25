import { prisma } from '$lib/prismaConnection.js';
import { validateSession } from '$lib/server/validateSession';
import { createId } from '@paralleldrive/cuid2';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const session = await prisma.session.findFirst({
		where: {
			id: parseInt(params.id)
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
	};
};

export const actions = {
	finish: async ({ params, cookies }) => {
		await validateSession(cookies);

		const session = await prisma.session.findFirst({
			where: {
				id: parseInt(params.id)
			},
			include: {
				user: true
			}
		});

		if (!session) error(404, 'Session not found');

		const data = await prisma.session.update({
			where: {
				id: session.id
			},
			data: {
				active: false
			}
		});

		return {
			success: true,
			message: 'Session finished',
			session: data
		};
	},
	scoreBlock: async ({ params, cookies, request }) => {
		await validateSession(cookies);

		const data = await request.formData();

		const score = data.get('score');
		if (!score) error(400, 'No score found.');
		if (typeof score !== 'string') error(400, 'Improper score')

		const session = await prisma.session.findFirst({
			where: {
				id: parseInt(params.id)
			},
			include: {
				user: true
			}
		});

		if (!session) error(404, 'Session not found');

		for (const user of session.user) {
			await prisma.scoreBlock.create({
				data: {
					id: createId(),
					user: {
						connect: {
							id: user.id
						}
					},
					session: {
						connect: {
							id: session.id
						}
					},
					score: Math.round(parseInt(score)),
					data: ''
				}
			})
		}

		return {
			success: true
		}
	}
};
