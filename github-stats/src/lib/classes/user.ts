import type { repositroy, user, GitHubRepo, projectLang } from "$lib/types";

export class User {
    private username: String;
    private languages: Record<string, number> = {};

    constructor(username: String){
        this.username = username;
    }

    addToLangs(langs: projectLang[]): void {
        //TODO: Implement
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
    //Object.entries(jsonData).map(([name, lines]) => ({name, lines})) as projectLang[];
    getLangsArray(): projectLang[]{
        const langArray: projectLang[] = [];
        Object.assign(this.languages, langArray)
        console.log(langArray)
        return langArray;
    }
}