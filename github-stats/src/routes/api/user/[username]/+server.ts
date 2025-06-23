import type { RequestHandler } from '@sveltejs/kit';
import type { repositroy, user, GitHubRepo, projectLang } from "$lib/types";
import { server } from "$lib/mocks/node";
import { User } from '$lib/classes/user';
import { env } from '$env/dynamic/private';


export const GET: RequestHandler = async ({ params, locals }) => {
    const { username } = params;
    // console.log(username)
    // console.log("getting user data for " + username)
    const session = await locals.auth();
    // console.log("session user is")
    // console.log(session)
    if (!username) {
        return new Response(JSON.stringify({ error: "Username parameter is missing" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }
    try {
        const userData = await getUsernameData(username, session);
        // console.log(userData)
        return new Response(JSON.stringify(userData), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }
    catch (err) {
        return new Response(JSON.stringify({ error: "User not found or an error occurred" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
        });
    }
};




async function getUsernameData(username: string, session: any) {


    // console.log("access token in getUsernameData")
    // console.log(session?.access_token)
    try {
        if (env.ENVIRONMENT && env.ENVIRONMENT == "prod") {
            const res = await fetch(`https://api.github.com/users/${username}/repos`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                    Accept: "application/json"
                }
            });
            let response = await res.json();
            // console.log("response:")
            // console.log(response)

            const data = response as GitHubRepo[]

            const user = await organizeData(data, username, data[0].owner.avatar_url, session);

            return user;
        }
        else {
            server.listen()
            const res = await fetch(`https://api.mockuser.com/users/${username}/repos`)

            const data = await res.json() as GitHubRepo[]

            const user = await organizeData(data, username, data[0].owner.avatar_url) as user

            server.close()
            return user
        }
    }
    catch (err) {
        console.log("Error in getUsernameData:")
        console.log(err)
        throw err; // Re-throw the error to be caught in the GET handler
    }
}

async function getRepoLangs(langUrl: string, userObj: User, session?: any) {

    // console.log("access token in getRepoLangs")
    // console.log(session?.access_token)
    try {
        const res = await fetch(langUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
                Accept: "application/json"
            }
        });
        const jsonData = await res.json();
        const data = Object.entries(jsonData).map(([name, lines]) => ({ name, lines })) as projectLang[];
        userObj.addToLangs(data)

        return data;
    }
    catch (err) {
        console.log("Error in getRepoLangs:")
        console.log(err)
        throw err; // Re-throw the error to be caught in the GET handler
    }

}

async function organizeData(repos: GitHubRepo[], username: string, avatar_url: string, session?: any) {

    let userObj = new User(username);

    let user: user = { name: username, avatar: avatar_url, repositories: null, languages: null };
    try {
        const repoList = await Promise.all(repos.map(async (repo: GitHubRepo) => {
            let projectLangs = await getRepoLangs(repo.languages_url, userObj, session);

            let newRepo: repositroy = {
                name: repo.name,
                description: repo.description,
                created_at: repo.created_at,
                updated_at: repo.updated_at,
                pushed_at: repo.pushed_at,
                URL: repo.html_url,
                langs: projectLangs
            }
            return newRepo


        }))



        // console.log(userObj.getLangsArray())
        user.repositories = repoList
        user.languages = userObj.getLangsArray();
        return user;
    } catch (err) {
        console.log("Error in organizeData:")
        console.log(err)
        throw err; // Re-throw the error to be caught in the GET handler
    }
}