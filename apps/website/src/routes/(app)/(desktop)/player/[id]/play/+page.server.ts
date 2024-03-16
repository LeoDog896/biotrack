import { prisma } from '$lib/prismaConnection';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const sessions = await prisma.session.findMany({
		where: {
			user: {
				some: {
					id: params.id
				}
			}
		},
		include: {
			user: true,
			game: true
		}
	});

	const activeSession = sessions.find((session) => session.active);

	const joinRequests = await prisma.joinRequest.findMany({
		where: {
			userId: params.id
		},
		include: {
			game: true,
			linkedJoinRequest: true
		}
	});

	const activeJoinRequest = joinRequests.find(
		(joinRequest) =>
			!joinRequest.acknowledged && !joinRequest.linkedJoinRequest && !joinRequest.terminated
	);

	const user = await prisma.user.findUnique({
		where: {
			id: params.id,
			archived: false
		}
	});

	if (!user) {
		error(404, 'User not found');
	}

	return {
		sessions,
		activeSession,
		joinRequests,
		activeJoinRequest,
		user
	};
};

export const actions = {
	// cancels the active join request
	cancel: async ({ params }) => {
		const joinRequest = await prisma.joinRequest.findFirst({
			where: {
				userId: params.id,
				acknowledged: false,
				linkedJoinRequest: {
					is: null
				}
			}
		});

		if (!joinRequest) {
			return error(400, 'No active join request');
		}

		await prisma.joinRequest.update({
			where: {
				id: joinRequest.id
			},
			data: {
				terminated: true
			}
		});

		return {
			joinRequest
		};
	}
};
