import { error, isRedirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as z from "zod/v4";
import { extractTextFromPDF } from '$lib/utils/pdf/pdfHelpers';


export const GET: RequestHandler = async () => {
    return new Response();
};

export const POST: RequestHandler = async (event) => {
    const dataSchema = z.object({
        username: z.string("Username must be a string.")
            .min(6, "Username must be at least 6 characters.")
            .max(39, "Username must be under 39 characters."),
        resume: z.instanceof(File).refine((file) => ["application/pdf"].includes(file.type), {
            message: 'Resume must be a PDF file.'
        })
    });

    try {
        let formData = await event.request.formData();
        let formObject = Object.fromEntries(formData.entries());
        console.log("Form data received:", formObject);
        let dataValid = dataSchema.parse({ username: formObject.username, resume: formObject.resume });

        let username = dataValid.username;
        let resume = formObject.resume as File;
        if (!resume) {
            throw new Error("Resume file is required.");
        }

        let userData = await event.fetch(`/api/user/${encodeURIComponent(username)}`, {
            method: 'GET',
        })

        if (userData.status !== 200) {
            const errData = await userData.json();
            throw error(userData.status, errData?.error || 'Failed to load user data');
        }
        userData = await userData.json();
        let resumeText = await extractTextFromPDF(resume);

        console.log("Resume text extracted successfully");
        console.log(resumeText);





        return new Response(JSON.stringify({ userData }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });



    } catch (err: any) {
        if (isRedirect(err)) {
            // throw redirect(err.status, err.location);
        } else {
            if (err instanceof z.ZodError) {
                if (err.issues.length > 0 && err.issues[0].path.includes('resume')) {
                    let errorMessage = (z.formatError(err).resume._errors[0]);
                    console.error("Resume validation error:", errorMessage);
                    return new Response(JSON.stringify({ error: errorMessage }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    });
                }
                let errorMessage = (z.formatError(err).username._errors[0]);
                console.error("Username validation error:", errorMessage);
                return new Response(JSON.stringify({ error: errorMessage }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
            } else {

                console.error("An unexpected error occurred:", err);
                return new Response(JSON.stringify({ error: err?.message || "User not found or an error occurred" }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                });
            };

        }
        // Ensure a Response is always returned
        return new Response(JSON.stringify({ error: "Unknown error occurred" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}