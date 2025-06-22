import type { PageServerLoad } from '../$types';
import { redirect } from '@sveltejs/kit';


export const load = (async ({ params, fetch }) => {
    let username = params.username
    try{
    let res = await fetch(`/api/user/${encodeURIComponent(username)}`, {
        method: 'GET',

    });
    let userData = await res.json();
    console.log(userData)
    return {
        userData
    };
    }
    catch(err){
        console.log("some error happend in loading")
        console.log(err)
        redirect(404, "/error");
    }

    
}) satisfies PageServerLoad;


