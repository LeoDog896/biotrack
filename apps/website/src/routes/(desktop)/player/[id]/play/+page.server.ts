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
			userId: params.id,
		},
		include: {
			game: true,
			supersededJoinRequest: true
		}
	});

	const activeJoinRequest = joinRequests.find((joinRequest) => !joinRequest.acknowledged && !joinRequest.supersededJoinRequest);

	const user = await prisma.user.findUnique({
		where: {
			id: params.id
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
