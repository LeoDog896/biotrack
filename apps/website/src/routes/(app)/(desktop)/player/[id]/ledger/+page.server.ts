import { prisma } from '$lib/prismaConnection';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const user = await prisma.user.findUnique({
		where: {
			id: params.id,
			archived: false
		},
		include: {
			scoreLedger: {
				include: {
					session: {
						include: {
							game: true
						}
					}
				}
			}
		}
	});

	if (!user) {
		error(404, 'User not found');
	}

	return {
		user
	};
};
