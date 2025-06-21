import type { RequestHandler } from '@sveltejs/kit';
import type { repositroy, user, GitHubRepo, projectLang } from "$lib/types";
import { server } from "$lib/mocks/node";

export const GET: RequestHandler = async ({ params }) => {
    const {username} = params;
    console.log(username)
    if (!username) {
        return new Response(JSON.stringify({ error: "Username parameter is missing" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }
    const userData = await getUsernameData(username);
    console.log(userData)
    return new Response(JSON.stringify(userData), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
};




async function getUsernameData(username: string) {
    
    if (process.env.ENVIRONMENT == "prod") {
        const res = await fetch(`https://api.github.com/users/${username}/repos`, {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        });

        const data = await res.json() as GitHubRepo[]

        const user = await organizeData(data, username);
        console.log("organized user data")
        console.log(user);
        return user;
    }
    else {
        server.listen()
        const res = await fetch(`https://api.mockuser.com/users/${username}/repos`)

        const data = await res.json()
        console.log("data")
        console.log(data)
    }
}

async function getRepoLangs(langUrl: string) {
    const res = await fetch(langUrl, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    });
    const data = await res.json() as projectLang[]


    return data;
}

async function organizeData(repos: GitHubRepo[], username: String) {

    let user: user = { name: username, repositories: null, languages: null };

    const repoList = await Promise.all(repos.map(async (repo: GitHubRepo) => {
        let projectLangs = await getRepoLangs(repo.languages_url);

        let newRepo: repositroy = {
            name: repo.name,
            description: repo.description,
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            pushed_at: repo.pushed_at,
            URL: repo.url,
            langs: projectLangs
        }
        return newRepo

    }))

    user.repositories = repoList
    return user;
}