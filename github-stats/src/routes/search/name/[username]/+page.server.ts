import type { PageServerLoad } from '../$types';
import { isRedirect, redirect } from '@sveltejs/kit';


export const load = (async ({ params, fetch, locals }) => {
    let username = params.username
    

    try{
    const session = await locals.auth();
    if (!session?.user) throw redirect(404, '/auth');


    let res = await fetch(`/api/user/${encodeURIComponent(username)}`, {
        method: 'GET',

    });
    let userData = await res.json();

    return {
        userData
    };
    }
    catch(err){
        if(isRedirect(err)){
            redirect(err.status, err.location)
        }
        console.log("some error happend in loading")
        console.log(err)
        redirect(400, "/error");
    }

}) satisfies PageServerLoad;


