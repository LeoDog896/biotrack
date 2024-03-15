import { PrismaClient } from '@prisma/client';

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

	await prisma.game.create({
		data: {
			id: 1,
			name: 'Guess the Number',
			playerCount: 1
		}
	});

	await prisma.game.create({
		data: {
			id: 2,
			name: 'Pong',
			playerCount: 2
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
