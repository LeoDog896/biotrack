import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const POST = ({ params }) => {
	return json(params);
};