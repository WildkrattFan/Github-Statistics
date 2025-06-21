import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    search: async({cookies, request}) => {
        let formdata = await request.formData();
        let username = formdata.get("username")
        
        //TODO: add some data validation here

        throw redirect(303, `search/name/${username}`)
    }
} satisfies Actions