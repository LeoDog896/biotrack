import { redirect } from '@sveltejs/kit'

export const load = async ({ parent }) => {
    const { local } = await parent();
    // we only permit localhost, that way, only the hosting computer can access the orchestrator
    if (!local) {
        redirect(302, '/');
    }
}
