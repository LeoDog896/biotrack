import { networkInterfaces } from 'node:os';

const interfaces = networkInterfaces();

let localAddress: string | undefined;

for (const [key, networks] of Object.entries(interfaces)) {
	if (!networks) continue;
	for (const { address } of networks) {
		if (key === 'wlo1' && address.includes('.')) {
			localAddress = address;
			break;
		}

		if ((key === 'Wi-Fi' && address.includes('.')) || address.startsWith('192.168')) {
			localAddress = address;
			break;
		}
	}
}

if (!localAddress) {
	throw new Error('No local address found');
}

export const load = async () => {
	return {
		localAddress
	};
};
