import { prisma } from '$lib/prismaConnection';

export const load = async () => {
	return {
		players: await prisma.user.count({
			where: {
				archived: false
			}
		}),
		games: await prisma.game.count(),
		sessions: await prisma.session.count(),
		activeSessions: await prisma.session.count({
			where: {
				active: true
			}
		}),
		joinRequests: await prisma.joinRequest.count(),
		activeJoinRequests: await prisma.joinRequest.count({
			where: {
				acknowledged: false,
				linkedJoinRequest: {
					is: null
				},
				terminated: false
			}
		}),
	};
};
