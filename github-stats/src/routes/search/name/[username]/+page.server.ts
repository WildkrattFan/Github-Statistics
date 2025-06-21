import type { PageServerLoad } from '../$types';

export const load = (async ({params}) => {
    let { username } = params;
    console.log("username == " + username);
    return {};
}) satisfies PageServerLoad;