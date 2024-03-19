import { PrismaClient } from '@prisma/client';
import { makePassword } from '../src/lib/server/password';
import { createId } from '@paralleldrive/cuid2';

const prisma = new PrismaClient();

async function main() {
	if (
		await prisma.game.findFirst({
			where: {
				id: 1,
				name: 'Guess the Number'
			}
		})
	) {
		console.log('The database is already seeded with the test games.');
		return;
	}

	const { salt, hash: password } = await makePassword('password');

	const primary = await prisma.officer.create({
		data: {
			id: createId(),
			name: 'primary',
			salt,
			password,
			admin: true
		}
	});

	await prisma.officer.create({
		data: {
			id: createId(),
			name: 'secondary',
			salt,
			password,
			admin: false,
			createdByOfficerId: primary.id
		}
	});

	await prisma.game.create({
		data: {
			id: 1,
			name: 'Guess the Number',
			playerCount: 1,
			token: 'guess-the-number',
			createdByOfficerId: primary.id
		}
	});

	await prisma.game.create({
		data: {
			id: 2,
			name: 'Pong',
			playerCount: 2,
			token: 'pong',
			createdByOfficerId: primary.id
		}
	});

	console.log('Seeded the database with the test games');
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
