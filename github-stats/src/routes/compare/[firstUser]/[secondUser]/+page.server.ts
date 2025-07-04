import type { PageServerLoad } from './$types';
import { isRedirect, redirect, error } from '@sveltejs/kit';

import type { user } from '$lib/types';


export const load = (async ({ params, fetch, locals }) => {
    let user1Name = params.firstUser
    let user2Name = params.secondUser


    try {
        const session = await locals.auth();
        if (!session?.user) throw redirect(303, '/');


        let user1Data: Promise<user> = fetch(`/api/user/${encodeURIComponent(user1Name)}`, {
            method: 'GET',
        }).then(async (res) => {
            if (res.status !== 200) {
                const errData = await res.json();
                throw error(res.status, errData?.error || 'Failed to load user data');
            }
            return res.json();
        });

        let user2Data: Promise<user> = fetch(`/api/user/${encodeURIComponent(user2Name)}`, {
            method: 'GET',
        }).then(async (res) => {
            if (res.status !== 200) {
                const errData = await res.json();
                throw error(res.status, errData?.error || 'Failed to load user data');
            }
            return res.json();
        });


        return {
            user1: user1Data,
            user2: user2Data
        };
    }
    catch (err) {
        if (isRedirect(err)) {
            throw err;
        }

        throw error(400, 'Failed to load user page');
    }

}) satisfies PageServerLoad;


