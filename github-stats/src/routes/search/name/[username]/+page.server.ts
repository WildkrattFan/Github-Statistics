import type { PageServerLoad } from '../$types';
import { getUsernameData } from '$lib/utils/github/userAPIAcess';

export const load = (async ({params}) => {
    let { username } = params;
    console.log("username == " + username);
    let data = await getUsernameData(username);
    return {};
}) satisfies PageServerLoad;


