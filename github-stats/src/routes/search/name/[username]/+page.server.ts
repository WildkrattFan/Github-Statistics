import type { PageServerLoad } from '../$types';
import { isRedirect, redirect, error } from '@sveltejs/kit';
  import { signIn, signOut } from "@auth/sveltekit/client";


export const load = (async ({ params, fetch, locals }) => {
    let username = params.username
    

    try{
    const session = await locals.auth();
    if (!session?.user) throw redirect(303, '/');


    let res = await fetch(`/api/user/${encodeURIComponent(username)}`, {
        method: 'GET',

    });
    if (res.status !== 200) {
        const errData = await res.json();
        throw error(res.status, errData?.error || 'Failed to load user data');
    }
    let userData = await res.json();

    return {
        userData
    };
    }
    catch(err){
        if(isRedirect(err)){
            throw err;
        }
        console.log("some error happend in loading 1")
        console.log(err)
        throw error(400, 'Failed to load user page');
    }

}) satisfies PageServerLoad;


