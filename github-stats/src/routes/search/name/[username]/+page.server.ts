import type { PageServerLoad } from './$types';
import { isRedirect, redirect, error } from '@sveltejs/kit';

  import type { user } from '$lib/types';


export const load = (async ({ params, fetch, locals }) => {
    let username = params.username
    

    try{
    const session = await locals.auth();
    if (!session?.user) throw redirect(303, '/');


    let userData: Promise<user> = fetch(`/api/user/${encodeURIComponent(username)}`, {
        method: 'GET',
    }).then(async(res) =>{
        if(res.status !== 200){
            const errData = await res.json();
            throw error(res.status, errData?.error || 'Failed to load user data');
        }

        return res.json();
    });


    return {
        userData
    };
    }
    catch(err){
        if(isRedirect(err)){
            throw err;
        }

        throw error(400, 'Failed to load user page');
    }

}) satisfies PageServerLoad;


export const actions ={
    compare: async ({cookies, request}) => {
        let formData = await request.formData();
        let formObject = Object.fromEntries(formData.entries())
        throw redirect(303, `/compare/${formObject.firstUser}/${formObject.newUser}`)
    }
}