import type { repositroy, user, GitHubRepo, projectLang } from "$lib/types";

export class User {
    username: String;
    languages: Record<string, number> = {};

    constructor(username: String){
        this.username = username;
    }

    addToLangs(langs: projectLang[]): void {
        //TODO: Implement
        langs.forEach((lang: projectLang) =>{
            
        }) 
    }
}