import { apiFetch } from '$lib/server/localFetch.js';
import { error, type NumericRange } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const cuid = data.get('cuid');
		const game = data.get('game');

		if (!cuid) error(400, 'Missing player cuid');
		if (!game) error(400, 'Missing game ID');

		if (typeof game !== 'string') error(400, 'Invalid game ID');
		if (typeof cuid !== 'string') error(400, 'Invalid cuid');

        const response = await apiFetch(`/game/${game}/join?user=${cuid}`, {
            method: 'POST'
        });

        if (!response.ok) {
            const text = await response.text();
            if (response.status > 599 || response.status < 400) error(500, `Unbound error: ${response.status}; ${text}`);
            error(response.status as NumericRange<400, 599>, text);
        }

        return {
            joinRequest: await response.json()
        }
	}
};
