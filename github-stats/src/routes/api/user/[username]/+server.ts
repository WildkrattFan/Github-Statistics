import type { RequestHandler } from '@sveltejs/kit';
import type { repositroy, user, GitHubRepo, projectLang } from "$lib/types";
import { server } from "$lib/mocks/node";
import { User } from '$lib/classes/user';


export const GET: RequestHandler = async ({ params }) => {
    const {username} = params;
    // console.log(username)
    if (!username) {
        return new Response(JSON.stringify({ error: "Username parameter is missing" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }
    const userData = await getUsernameData(username);
    // console.log(userData)
    return new Response(JSON.stringify(userData), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
};




async function getUsernameData(username: string) {


    
    if (process.env.ENVIRONMENT == "prod" || true) {
        const res = await fetch(`https://api.github.com/users/${username}/repos`, {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        });

        const data = await res.json() as GitHubRepo[]

        const user = await organizeData(data, username);

        return user;
    }
    else {
        server.listen()
        const res = await fetch(`https://api.mockuser.com/users/${username}/repos`)

        const data = await res.json()

        const user = await organizeData(data, username) as user
        
        server.close()
        return user
    }
}

async function getRepoLangs(langUrl: string, userObj: User) {


    const res = await fetch(langUrl, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    });
    const jsonData = await res.json();
    const data = Object.entries(jsonData).map(([name, lines]) => ({name, lines})) as projectLang[];
    userObj.addToLangs(data)

    return data;


}

async function organizeData(repos: GitHubRepo[], username: String) {

    let userObj = new User(username);

    let user: user = { name: username, repositories: null, languages: null };

    const repoList = await Promise.all(repos.map(async (repo: GitHubRepo) => {
        let projectLangs = await getRepoLangs(repo.languages_url, userObj);

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



    // console.log(userObj.getLangsArray())
    user.repositories = repoList
    user.languages = userObj.getLangsArray();
    return user;
}