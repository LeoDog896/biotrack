import { prisma } from '$lib/prismaConnection';
import { validateGame } from '$lib/server/validateGame';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';

export const GET: RequestHandler = async ({ params }) => {
	await validateGame(params.id);

	const rawJoinRequests = await prisma.joinRequest.findMany({
		where: {
			gameId: parseInt(params.id),
			acknowledged: false,
			terminated: false,
			linkedJoinRequest: {
				is: null
			}
		},
		select: {
			id: true,
			userId: true,
			gameId: true,
			createdAt: true,
			acknowledged: true,
			terminated: true,
			linkedJoinRequest: true,
			user: {
				select: {
					id: true,
					name: true,
					sessions: {
						select: {
							id: true,
							scoreBlock: {
								select: {
									id: true,
									score: true,
									data: true
								}
							},
							data: true,
							user: {
								select: {
									name: true,
									id: true
								}
							}
						}
					}
				}
			}
		}
	});

	const joinRequests = rawJoinRequests.map((joinRequest) => ({
		...joinRequest,
		user: {
			...joinRequest.user,
			score: joinRequest.user.sessions.reduce((acc, session) => {
				acc += session.scoreBlock.reduce((acc, scoreBlock) => {
					acc += scoreBlock.score;
					return acc;
				}, 0);

				return acc;
			}, 0)
		}
	}));

	return json({
		joinRequests
	});
};
