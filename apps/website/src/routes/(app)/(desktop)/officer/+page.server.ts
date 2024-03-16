import { error } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
    const sessionString = cookies.get("session")!;

    
}