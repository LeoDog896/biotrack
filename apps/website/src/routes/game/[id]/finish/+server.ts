import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/prismaConnection';
import cuid from 'cuid';
import { validateGame } from '$lib/server/validateGame';

export const POST: RequestHandler = async ({ params, url }) => {
	const game = await validateGame(params.id);

	const data = url.searchParams.get('data');
	const score = url.searchParams.get('score');
	const finished = url.searchParams.get('finished') === 'true' ? true : false;

	if (!data) error(400, 'No data provided');
	if (!score) error(400, 'No score provided');

	const session = await prisma.session.findFirst({
		where: {
			gameId: game.id,
			active: true
		}
	});

	if (!session) {
		error(400, 'No active session found');
	}

	const scoreBlocks = await prisma.scoreBlock.findMany({
		where: {
			sessionId: session.id
		}
	});

	await prisma.session.update({
		where: {
			id: session.id
		},
		data: {
			active: !finished,
			data,
			scoreBlock: {
				set: [
					...scoreBlocks,
					{
						id: cuid(),
						score: parseInt(score),
						data,
						sessionId: session.id
					}
				]
			}
		}
	});

	return json(params);
};
