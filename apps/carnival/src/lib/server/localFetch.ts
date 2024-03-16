import internalNodeFetch, { type RequestInit } from 'node-fetch';
import https from 'node:https';

const httpsAgent = new https.Agent({
	// since we're scanning localhost, we can ignore the self-signed certificate
	rejectUnauthorized: false
});

/**
 * Exports a modified version of fetch that respects the self-signed certificate
 */
export const apiFetch = (rawUrl: string, args?: RequestInit) => {
	const url = new URL('https://localhost:5000' + rawUrl);

	return internalNodeFetch(url, { ...args, agent: httpsAgent });
};
