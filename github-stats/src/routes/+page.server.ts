import { isRedirect, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import * as z from "zod/v4";

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    search: async({cookies, request}) => {

        const dataSchema = z.object({
            username: z.string("Username must be a string.")
            .min(6, "Username must be at least 6 characters.")
            .max(39, "Username must be under 39 characters.")
        });

        try{
        const formdata = await request.formData();
        const formdataObject = Object.fromEntries(formdata.entries())

        let dataValid = dataSchema.parse(formdataObject);


        let username = formdataObject.username;
        
        //TODO: add some data validation here

        throw redirect(303, `search/name/${username}`)
        }
        catch(err){

            if(isRedirect(err)){
                throw redirect(err.status, err.location)
            }
            else{
                if(err instanceof z.ZodError){

                    let errorMessage = (z.formatError(err).username._errors[0])

                    return{
                        usernameError: errorMessage
                    }
                }
                else{
                    throw redirect(404, "/error");
                }
            }
        }
    },
    validateResume: async({cookies, request}) => {
        const dataSchema = z.object({
            username: z.string("Username must be a string.")
            .min(6, "Username must be at least 6 characters.")
            .max(39, "Username must be under 39 characters."),
            resume: z.instanceof(File).refine((file) => ["application/pdf"].includes(file.type), {
                message: 'Resume must be a PDF file.'
            })
        });

        try{
            const formdata = await request.formData();
            // const file = (await request.formData()).get('resume') as File;
            // console.log("Form data received:");
            // console.log(file);
            const formdataObject = Object.fromEntries(formdata.entries());

            console.log("formatted data object");
            console.log(formdataObject);
            let dataValid = dataSchema.parse(formdataObject);

            let username = formdataObject.username;
            let resume = formdataObject.resume;

            // sessionStorage.setItem("resume", JSON.stringify({resume}));

            return{
                validFiles: true
            }

        } catch(err){
            if(isRedirect(err)){
                console.log("Redirecting due to error");
                throw redirect(err.status, err.location)
            }
            else{
                if(err instanceof z.ZodError){

                    if(err.issues.some(issue => issue.path.includes('resume'))){
                        return {
                            usernameError: "Resume must be a PDF file."
                        }
                    }
                    let errorMessage = (z.formatError(err).username._errors[0]);


                    return{
                        usernameError: errorMessage
                    }
                }
                else{
                    throw redirect(300, "/error");
                }
            }
        }
    }
} satisfies Actions