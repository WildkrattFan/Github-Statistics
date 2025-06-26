import type { repositroy, user, GitHubRepo, projectLang, codingLang } from "$lib/types";

export class User {
    private username: String;
    private languages: Record<string, number> = {};

    constructor(username: String){
        this.username = username;
    }

    addToLangs(langs: projectLang[]): void {

        langs.forEach((lang: projectLang) =>{
            let langName = lang.name
            if(this.languages[langName]){
                this.languages[langName] += lang.lines as number
            }
            else{
                this.languages[langName] = lang.lines
            }
        }) 

    }

    getLangs(): Record<string, number>{
        return this.languages;
    }

    getLangsArray(): codingLang[]{
        const langArray: codingLang[] = Object.entries(this.languages).map(([name, lines]) => ({ name, lines } as codingLang));

        return langArray;
    }
}