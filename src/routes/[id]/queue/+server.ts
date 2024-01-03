import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET = ({ params }) => {
	return json(params);
};