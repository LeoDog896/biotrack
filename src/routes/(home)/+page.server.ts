import { networkInterfaces } from 'node:os';

const interfaces = networkInterfaces();

let localAddress: string | undefined;

for (const networks of Object.values(interfaces)) {
	if (!networks) continue;
	for (const net of networks) {
		if (net.address.startsWith('192.168')) {
			localAddress = net.address;
			break;
		}
	}
}

if (!localAddress) throw new Error('No local address found');

export const load = async () => {
	return {
		localAddress
	};
};
