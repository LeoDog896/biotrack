import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.game.create({
        data: {
            id: 1,
            name: 'Guess the Number',
        }
    });
    await prisma.game.create({
        data: {
            id: 2,
            name: 'Pong',
        }
    });
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
