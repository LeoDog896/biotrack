import type { inferAsyncReturnType } from '@trpc/server';
import { validateSessionString } from '../validateSession';
import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import cookieParser from 'cookie';

export async function createContext(event: CreateHTTPContextOptions | CreateWSSContextFnOptions) {
	if (!event.req.headers.cookie) throw new Error('Missing cookie header');
	
	const cookie = cookieParser.parse(event.req.headers.cookie);
	if (!cookie.session) throw new Error('Missing session cookie');
	const officer = await validateSessionString(cookie.session);

	return {
		officer,
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
