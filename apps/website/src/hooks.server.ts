import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import { createTRPCWebSocketServer } from 'trpc-sveltekit/websocket';
import { error, type Handle } from '@sveltejs/kit';
import { building } from '$app/environment';

if (!building) createTRPCWebSocketServer({ router, createContext });

/**
 * CSRF protection copied from SvelteKit but with the ability to turn it off for specific routes.
 * https://github.com/sveltejs/kit/issues/6784#issuecomment-1416104897
 */
const csrf =
	(
        allowFilter: (path: string) => boolean
    ): Handle =>
	async ({ event, resolve }) => {
        console.log(event.url.pathname)

		const forbidden =
			event.request.method === 'POST' &&
			event.request.headers.get('origin') !== event.url.origin &&
			isFormContentType(event.request) &&
            !allowFilter(event.url.pathname);

		if (forbidden) {
			error(
				403,
				`Cross-site ${event.request.method} form submissions are forbidden`,
			);
		}

		return resolve(event);
	};
function isContentType(request: Request, ...types: string[]) {
	const type = request.headers.get('content-type')?.split(';', 1)[0].trim() ?? '';
	return types.includes(type);
}
function isFormContentType(request: Request) {
	return isContentType(request, 'application/x-www-form-urlencoded', 'multipart/form-data');
}

export const handle = csrf(
    (path) => /^\/game\/\d+\/\w+/.test(path)
);
