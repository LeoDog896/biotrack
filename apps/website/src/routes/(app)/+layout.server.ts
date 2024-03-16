import type { LayoutServerLoad } from './$types';
import { validateSession } from '$lib/server/validateSession';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const officer = await validateSession(cookies);

	return {
		officer
	};
};
