import type { PageServerLoad } from '../$types';



export const load = (async ({params, fetch}) => {
    let username = params["username"]
    console.log("username == " + username);
    let res = await fetch(`/api/user/${encodeURIComponent(username)}`, {
        method: 'GET',

    });
    let data = await res.json();
    return {};
}) satisfies PageServerLoad;


