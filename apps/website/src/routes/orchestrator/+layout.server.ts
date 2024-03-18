import { redirect } from '@sveltejs/kit'

export const load = ({ url }) => {
    console.log(url)
    // we only permit localhost, that way, only the hosting computer can access the orchestrator
    if (url.host !== 'localhost:5000') {
        redirect(302, '/');
    }
}
