import { networkInterfaces } from 'node:os';

const interfaces = networkInterfaces();

function calculateLocalAddress(): string | undefined {
	for (const [key, networks] of Object.entries(interfaces)) {
		if (!networks) continue;
		for (const { address } of networks) {
			if (key === 'wlo1' && address.includes('.')) {
				return address;
			}

			if ((key === 'Wi-Fi' && address.includes('.')) || address.startsWith('192.168')) {
				return address;
			}
		}
	}
}

const localAddress = calculateLocalAddress();

if (!localAddress) {
	throw new Error('No local address found');
}

export const load = async () => {
	return {
		localAddress
	};
};
