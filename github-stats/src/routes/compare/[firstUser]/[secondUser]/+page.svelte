<script lang="ts">
    import { signOut } from "@auth/sveltekit/client";
    import type { PageData } from "./$types";
    import type { codingLang, user, projectLang } from "$lib/types";
    import { Chart } from "chart.js";

    let { data }: { data: PageData } = $props();
    console.log(data);
    let user1Promise = data.user1;
    let user2Promise = data.user2;

    let user1: user | null = $state(null);
    let user2: user | null = $state(null);
    let processedLangs: any[] = $state([]);
    let filteredLangs: any[] = $state([]);
    let compareUsers = $state(false);
    let langComp =  $state<Record<string, { user1: number; user2: number; user1win: boolean; user2win: boolean; user1percent: number; user2percent: number; }>>({});

    user1Promise.then((finishedData) => {
        console.log("User Data Loaded:", user1);
        user1 = finishedData as user;

        processedLangs = calculateLangPercent(user1.languages || []);
        filteredLangs = processedLangs;

        if (user1.repositories) {
            user1.repositories = user1.repositories.map((repo) => ({
                ...repo,
                langs: repo.langs
                    ? calculateLangPercent(
                          repo.langs as unknown as codingLang[],
                      )
                    : [],
            }));
        }
    });

        user2Promise.then((finishedData) => {
        console.log("User Data Loaded:", user2);
        user2 = finishedData as user;

        processedLangs = calculateLangPercent(user2.languages || []);
        filteredLangs = processedLangs;

        if (user2.repositories) {
            user2.repositories = user2.repositories.map((repo) => ({
                ...repo,
                langs: repo.langs
                    ? calculateLangPercent(
                          repo.langs as unknown as codingLang[],
                      )
                    : [],
            }));
        }
    });
    Promise.all([user1Promise, user2Promise]).then(() => {
        if ( user1 && user2) {
            langComp = generateLangComparison(user1, user2);
        }
    });



    function startComparing() {
        compareUsers = true;
    }

    function calculateLangPercent(langList: codingLang[]) {
        let totalLines = 0;
        let percentList: any[] = [];
        for (let lang of langList) {
            totalLines += lang.lines;
        }

        if (totalLines > 0) {
            for (let lang of langList) {
                percentList.push({
                    percent: ((lang.lines / totalLines) * 100).toFixed(2),
                    name: lang.name,
                    lines: lang.lines,
                });
            }
        }
        percentList.sort((a, b) => b.lines - a.lines);
        return percentList;
    }

    function getColor(name: string): string {
        const colors: Record<string, string> = {
            JavaScript: "#f1e05a",
            TypeScript: "#2b7489",
            Python: "#3572A5",
            Java: "#b07219",
            "C#": "#178600",
            "C++": "#f34b7d",
            HTML: "#e34c26",
            CSS: "#563d7c",
            Ruby: "#701516",
            PHP: "#4F5D95",
            Go: "#00ADD8",
            Rust: "#dea584",
            Swift: "#ffac45",
            Kotlin: "#F18E33",
            C: "#555555",
            Shell: "#89e051",
            "Objective-C": "#438eff",
            Scala: "#c22d40",
            Perl: "#0298c3",
            Dart: "#00B4AB",
            Lua: "#000080",
            R: "#198CE7",
            Haskell: "#5e5086",
            Elixir: "#6e4a7e",
            Clojure: "#db5855",
            Groovy: "#e69f56",
            "Visual Basic": "#945db7",
            Assembly: "#6E4C13",
            MATLAB: "#e16737",
            CoffeeScript: "#244776",
            VHDL: "#adb2cb",
            "F#": "#b845fc",
            Erlang: "#B83998",
            // fallback
            default: "#ccc",
        };
        return colors[name] || colors["default"];
    }

    function getWinner(currentUSer?: number, otherUser?: number): boolean {
        if (currentUSer === undefined && otherUser === undefined) {
            return false; // If either number is undefined, treat as a tie
        }
        if (currentUSer === undefined) {
            return false; // If user 1's number is undefined, user 2 is the winner
        }
        if (otherUser === undefined) {
            return true; // If user 2's number is undefined, user 1 is the winner
        }
        if (currentUSer > otherUser) {
            return true;
        } else if (otherUser > currentUSer) {
            return false;
        } else {
            return false;
        }
    }

    function generateLangComparison(user1: user, user2: user){
        let languageComparison: Record<string, { user1: number; user2: number; user1win: boolean; user2win: boolean; user1percent: number; user2percent: number; }> = {};
        const allLangs = new Set([
            ...(user1.languages || []).map((lang) => lang.name),
            ...(user2.languages || []).map((lang) => lang.name),
        ]);
        allLangs.forEach((lang) => {
            const user1Lang = user1.languages?.find((l) => l.name === lang);
            const user2Lang = user2.languages?.find((l) => l.name === lang);
            const user1Lines = user1Lang ? user1Lang.lines : 0;
            const user2Lines = user2Lang ? user2Lang.lines : 0;

            languageComparison[lang] = {
                user1: user1Lines,
                user2: user2Lines,
                user1win: getWinner(user1Lines, user2Lines),
                user2win: getWinner(user2Lines, user1Lines),
                user1percent: user1Lines + user2Lines === 0 ? 0 : parseFloat(((user1Lines / (user1Lines + user2Lines)) * 100).toFixed(2)),
                user2percent: user1Lines + user2Lines === 0 ? 0 : parseFloat(((user2Lines / (user1Lines + user2Lines)) * 100).toFixed(2)),
            };
        });
        return languageComparison;
    }

</script>

<div class="nav-bar">
    <a class="home-link" href="/">GitHub Stats</a>
    <!-- <button onclick={() => signOut()}>Sign Out</button> -->
    <div class="search-bar">
        <form method="POST" action="../..?/search">
            <input type="text" name="username" />
            <button>Search</button>
        </form>
    </div>
</div>

{#await Promise.all([user1Promise, user2Promise])}
    <main>
        
    </main>
{:then userData}
    <main>
        <div class="users">
            <div class="user user1">
                <div>
                    <h1>{user1?.name}</h1>
                    <img src={user1?.avatar} alt="{user1?.name}'s' avatar" style="width:64px;height:64px;border-radius:50%;border:2px solid #444;" />
                    <div class="user-stats">
                        <h2>Repositories: {user1?.repositories?.length || 0} {#if getWinner(user1?.repositories?.length, user2?.repositories?.length)}👑{/if}</h2>
                        {#each Object.entries(langComp) as [lang, stats]}
                        <div class = "language-single-stat">
                            <h3 style="color: {getColor(lang)}">{lang}{#if stats.user1win}
                            👑
                            {/if}</h3>
                            <h4><strong>Lines: </strong> {stats.user1}</h4>
                            <h4>{stats.user1percent}% of aggregated code</h4>

                        </div>


                        {/each}
                    </div>
                </div>
            </div>
            <div class="user user2">
                <div>
                    <h1>{user2?.name}</h1>
                    <img src={user2?.avatar} alt="{user2?.name}'s avatar" style="width:64px;height:64px;border-radius:50%;border:2px solid #444;" />
                    <div class="user-stats">
                        <h2>Repositories: {user2?.repositories?.length || 0} {#if getWinner(user2?.repositories?.length, user1?.repositories?.length)}👑{/if}</h2>
                        {#each Object.entries(langComp) as [lang, stats]}
                        <div class = "language-single-stat">
                            <h3 style="color: {getColor(lang)}">{lang}{#if stats.user2win}
                            👑
                            {/if}</h3>
                            <h4><strong>Lines:</strong> {stats.user2}</h4>
                            <h4>{stats.user2percent}% of aggregated code</h4>
                            
                        </div>


                        {/each}
                    </div>
                </div>
            </div>
        </div>

        <!-- <div class="language-bars"> -->

            <!-- <div class="language-bar center-diverging-bar">
                <div class="lang-half left-from-center" style="width: 34000px; background: {getColor('Python')};">
                    <span class="lang-label left">Python</span>
                </div>
                
                <div class="lang-half right-from-center" style="width: 20px; background: {getColor('Python')};">
                    <span class="lang-label right">Python</span>
                </div>
                <div class="center-divider"></div>
            </div>
            <div class="line-count">
                <h3 class={getWinner(200,400)}>200</h3>
                <h3 class={getWinner(400,200)}>400</h3>
            </div> -->
<!--             
        </div> -->
    </main>
{:catch error}
    <p>Error loading user data: {error.message}</p>
{/await}

<style>
    .users{
        display: flex;
        flex-direction: row;
        height: 100%;
    }
    .user1, .user2 {
        display: flex;
        width: 50%;
        height: 100%;
        justify-content: center;
        align-items: center;
    }
    .user1 > div, .user2 > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
    }
    .user1 h1, .user2 h1 {
        text-align: center;
        width: 100%;
    }
    .user-stats {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #f1e05a;
        font-size: 1.2em;
        margin-top: 0.5em;
        width: 100%;
        text-align: center;
    }
    .more-lines{
        color: #4CAF50; /* Green */
    }
    .less-lines{
        color: #F44336; /* Red */
    }
    .language-bars {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
    }
    .line-count{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        padding: 0 1em;
        color: #fff;
        font-size: 1.2em;
        font-weight: bold;
    }
    .language-bar.center-diverging-bar {
        position: relative;
        width: 60%;
        min-width: 240px;
        max-width: 600px;
        height: 2.5rem;
        background: rgba(40, 40, 50, 0.95);
        border-radius: 5px;
        margin-bottom: 0.5em;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: visible;
    }
    .lang-half.left-from-center {
        position: absolute;
        right: 50%;
        height: 100%;
        border-radius: 5px 0 0 5px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        transition: width 0.4s;
        z-index: 1;
        flex-direction: row-reverse;
    }
    .lang-half.right-from-center {
        position: absolute;
        left: 50%;
        height: 100%;
        border-radius: 0 5px 5px 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        transition: width 0.4s;
        z-index: 1;
    }
    .center-divider {
        position: absolute;
        left: 50%;
        top: 0;
        width: 2px;
        height: 100%;
        background: #444;
        z-index: 2;
        transform: translateX(-1px);
    }
    .lang-label.left {
        margin-right: 0.5em;
        color: #fff;
        font-size: 0.95em;
        font-weight: 600;
        white-space: nowrap;
        text-shadow: 0 1px 2px #222;
    }
    .lang-label.right {
        margin-left: 0.5em;
        color: #fff;
        font-size: 0.95em;
        font-weight: 600;
        white-space: nowrap;
        text-shadow: 0 1px 2px #222;
    }

    main {
        background: rgba(30, 30, 40, 0.92);
        min-height: 100vh;
        padding: 2rem 0;
        display: flex;
        flex-direction: column;

        gap: 2rem;
        font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
            "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
    }

    
    .home-link {
        color: white;
        font-size: 2em;
    }



    a {
        text-decoration: none;
        color: inherit;
    }
    



    @media (max-width: 600px) {
        
        .nav-bar {
            flex-direction: column;
            gap: 1em;
            padding: 0.5em 0.5em;
            font-size: 1rem;
        }
        .home-link {
            font-size: 1.2em;
        }
        .search-bar {
            width: 100%;
            min-width: unset;
            max-width: 98vw;
            margin-right: 0;
            padding: 0.2em 0.2em 0.2em 0.5em;
        }
        .search-bar input {
            font-size: 1em;
            padding: 0.4em 0.6em;
            min-width: 0;
            width: 60vw;
        }
        .search-bar button {
            font-size: 1em;
            padding: 0.4em 0.8em;
        }
        
    }
    .user-stats{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #f1e05a;
        font-size: 1.2em;
        margin-top: 0.5em;
    }

    .nav-bar {
        width: 100%;
        background: #232526;
        padding: 1em;
        font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
            "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
        font-weight: bold;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 2em;
        color: white;
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
        position: sticky;
        justify-content: space-between;
    }

    

    .search-bar {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-right: 5em;
    }
    .search-bar input {
        background-color: white;
        border: none;
        padding-top: 8px;
        padding-bottom: 8px;
        border-radius: 5px;
    }
    .search-bar button {
        background-color: #2b7489;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        margin-left: 0.5em;
        cursor: pointer;
    }
    

    @keyframes loadingAnimation {
        0% {
            background-position: 100% 0;
        }
        100% {
            background-position: 0 0;
        }
    }
    .language-single-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(40, 40, 50, 0.85);
        border-radius: 10px;
        margin: 0.5em 0;
        padding: 0.7em 1.2em;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
        min-width: 120px;
        max-width: 320px;
        width: 100%;
        border: 2px solid #232526;
        transition: box-shadow 0.2s;
    }
    .language-single-stat h3 {
        color: #f1e05a;
        font-size: 1.1em;
        margin-bottom: 0.2em;
        margin-top: 0;
        text-align: center;
    }
    .language-single-stat h4 {
        color: #fff;
        font-size: 1em;
        margin: 0.1em 0;
        text-align: center;
    }
    .language-single-stat h1 {
        font-size: 1.3em;
        margin: 0.2em 0 0 0;
        text-align: center;
    }
    .user-stats {
        gap: 0.5em;
    }
    @media (max-width: 900px) {
        .language-single-stat {
            min-width: 90px;
            max-width: 98vw;
            padding: 0.5em 0.5em;
        }
    }
</style>
