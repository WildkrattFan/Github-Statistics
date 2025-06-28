import { error, isRedirect, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import * as z from "zod/v4";
import type { user } from '$lib/types';

export const load = (async ({ params }) => {
    return {
        username: params.username
    };
}) satisfies PageServerLoad;


// export const actions = {
//     loadPage: async ({ params, request }) => {

//         const dataSchema = z.object({
//             username: z.string("Username must be a string.")
//                 .min(6, "Username must be at least 6 characters.")
//                 .max(39, "Username must be under 39 characters."),
//             resume: z.instanceof(File).refine((file) => ["application/pdf"].includes(file.type), {
//                 message: 'Resume must be a PDF file.'
//             })
//         });

//         try {
//             let formData = await request.formData();
//             let formObject = Object.fromEntries(formData.entries());
//             console.log("Form data received:", formObject);
//             let dataValid = dataSchema.parse({ username: params.username, resume: formObject.resume });

//             let username = dataValid.username;
//             let resume = formObject.resume as File;
//             if (!resume) {
//                 throw new Error("Resume file is required.");
//             }

//             let userData = fetch(`/api/user/${encodeURIComponent(username)}`, {
//                 method: 'GET',
//             }).then(async (res) => {
//                 if (res.status !== 200) {
//                     const errData = await res.json();
//                     throw error(res.status, errData?.error || 'Failed to load user data');
//                 }

//                 return res.json();
//             });

//             return {
//                 userData: userData
//             };



//         } catch (err) {
//             if (isRedirect(err)) {
//                 // throw redirect(err.status, err.location);
//             } else {
//                 if (err instanceof z.ZodError) {
//                     if (err.issues.length > 0 && err.issues[0].path.includes('resume')) {
//                         let errorMessage = (z.formatError(err).resume._errors[0]);
//                         console.error("Resume validation error:", errorMessage);
//                         return {ok: false, resumeError: errorMessage };
//                     }
//                     let errorMessage = (z.formatError(err).username._errors[0]);
//                     return {ok: false, usernameError: errorMessage };
//                 } else {

                    
//                     return {ok: false, error: "Internal Server Error" };
//                     };

//                 }
//             }
//         }
//     }
