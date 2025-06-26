<svelte:head>
    <title>GitHub Stats - Compare Users</title>
    <meta name="description" content="Compare GitHub statistics of two users." />
    </svelte:head>


<script lang="ts">
    import { signOut } from "@auth/sveltekit/client";
    import type { PageData } from "./$types";
    import type { codingLang, user, projectLang } from "$lib/types";
    import { Chart } from "chart.js";
    import { goto } from '$app/navigation';
    let { data }: { data: PageData } = $props();

    let user1Promise = data.user1;
    let user2Promise = data.user2;

    let user1: user | null = $state(null);
    let user2: user | null = $state(null);
    let processedLangs: any[] = $state([]);
    let filteredLangs: any[] = $state([]);
    let compareUsers = $state(false);
    let langComp =  $state<Record<string, { user1: number; user2: number; user1win: boolean; user2win: boolean; user1percent: number; user2percent: number; }>>({});

    //handles adding the data once the user1 and user2 promises resolve
    user1Promise.then((finishedData) => {

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

    // Wait for both promises to resolve before generating the comparison
    Promise.all([user1Promise, user2Promise]).then(() => {
        if ( user1 && user2) {
            langComp = generateLangComparison(user1, user2);
        }
    });





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

    //Formats numbers with commas for better readability
    function numberWithCommas(x: number | string): string {
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

// Determines the winner based on the number of repositories or lines of code
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

    // Generates a comparison object for the languages used by both users
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
        <div class="users">
            <div class="user user1">
                <div>
                    <h1></h1>
                    <div class="avatar-skeleton"></div>
                    <div class="user-stats">
                        <h2 style="margin-bottom: 5rem;"></h2>
                        {#each Array(20) as item}
                        <div class = "language-single-stat single-stat-loading">
                            <h3>
                            
                            </h3>
                            <h4></h4>
                            <h4></h4>

                        </div>


                        {/each}
                    </div>
                </div>
            </div>
            <div class="user user2">
                <div>
                    <h1></h1>
                    <div class="avatar-skeleton"></div>
                    <div class="user-stats">
                        <h2 style="margin-bottom: 5rem;"></h2>
                        {#each Array(20) as item}
                        <div class = "language-single-stat single-stat-loading ">
                            <h3>
                            
                            </h3>
                            <h4></h4>
                            <h4></h4>

                        </div>


                        {/each}
                    </div>
                </div>
            </div>
        </div>
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
                        <div class = "language-single-stat ">
                            <h3 style="color: {getColor(lang)}">{lang}{#if stats.user1win}
                            👑
                            {/if}</h3>
                            <h4><strong>Lines: </strong> {numberWithCommas(stats.user1)}</h4>
                            <h4>{stats.user1percent}% of aggregated code</h4>

                        </div>


                        {/each}
                    </div>
                    <form class = "view-user-form" method="POST" action="../..?/search">
            <input type="hidden" name="username" value={user1?.name} />
            <button>View</button>
        </form>
                </div>
                
            </div>
            <div  class="user user2">
                <div>
                    <h1>{user2?.name}</h1>
                    <img src={user2?.avatar} alt="{user2?.name}'s avatar" style="width:64px;height:64px;border-radius:50%;border:2px solid #444;" />
                    <div class="user-stats">
                        <h2>Repositories: {user2?.repositories?.length || 0} {#if getWinner(user2?.repositories?.length, user1?.repositories?.length)}👑{/if}</h2>
                        {#each Object.entries(langComp) as [lang, stats]}
                        <div class = "language-single-stat ">
                            <h3 style="color: {getColor(lang)}">{lang}{#if stats.user2win}
                            👑
                            {/if}</h3>
                            <h4><strong>Lines:</strong> {numberWithCommas(stats.user2)}</h4>
                            <h4>{stats.user2percent}% of aggregated code</h4>
                            
                        </div>


                        {/each}
                    </div>
                    <form class = "view-user-form" method="POST" action="../..?/search">
            <input type="hidden" name="username" value={user2?.name} />
            <button>View</button>
        </form>
                </div>
                
            </div>
        </div>

    </main>
{:catch error}
    <p>Error loading user data: {error.message}</p>
{/await}

<style>
    .users{
        display: flex;
        flex-direction: row;
        height: 100%;
        align-items: stretch;
    }
    .user1, .user2 {
        display: flex;
        width: 50%;
        height: 100%;
        justify-content: center;
        align-items: stretch;
    }
    .user1 > div, .user2 > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        background: rgba(40,40,50,0.95);
        border-radius: 18px;
        box-shadow: 0 4px 24px 0 rgba(0,0,0,0.18);
        padding: 2rem 2.5rem 1.5rem 2.5rem;
        margin-bottom: 1.5rem;
        min-width: 240px;
        max-width: 420px;
        height: 100%;
    }
    .view-user-form{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1rem;
    }
    .view-user-form button {
        background-color: #2b7489;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
    }
    .single-stat-loading{
        height: 4.5rem;
        width: 100%;
        animation: skeleton-loading 1.2s infinite linear;
        background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.336) 0%,
            rgba(185, 185, 180, 0.18) 30%,
            rgba(43, 116, 137, 0.18) 60%,
            rgba(255, 255, 255, 0.08) 100%
        );
    }
    .user1 h1, .user2 h1 {
        text-align: center;
        width: 100%;
        color: #f1e05a;
        font-size: 2rem;
        margin-bottom: 1.2rem;
        font-weight: 700;
        letter-spacing: 0.5px;
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
        max-width: 350px;
        gap: 0.7em;
        background: rgba(30,30,40,0.92);
        border-radius: 12px;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
        padding: 1em 0.5em 1.2em 0.5em;
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
        background: linear-gradient(135deg, rgba(40,40,50,0.98) 70%, #232526 100%);
        border-radius: 14px;
        margin: 0.7em 0;
        padding: 1em 1.5em 1.2em 1.5em;
        box-shadow: 0 4px 18px 0 rgba(0,0,0,0.18);
        min-width: 140px;
        max-width: 340px;
        width: 100%;
        border: 2px solid #232526;
        transition: box-shadow 0.2s, border 0.2s;
        position: relative;
        overflow: hidden;
    }
    .language-single-stat:hover {
        box-shadow: 0 6px 24px 0 rgba(0,0,0,0.22);
        border: 2px solid #f1e05a;
    }
    .language-single-stat h3 {
        color: #f1e05a;
        font-size: 1.2em;
        margin-bottom: 0.2em;
        margin-top: 0;
        text-align: center;
        letter-spacing: 0.5px;
        font-weight: 700;
        text-shadow: 0 1px 2px #222;
    }
    .language-single-stat h4 {
        color: #fff;
        font-size: 1em;
        margin: 0.1em 0;
        text-align: center;
        font-weight: 500;
    }

    .language-single-stat::before {
        content: '';
        position: absolute;
        left: 0; top: 0; right: 0; bottom: 0;
        background: linear-gradient(120deg, transparent 60%, rgba(241,224,90,0.08) 100%);
        z-index: 0;
        border-radius: 14px;
        pointer-events: none;
    }
    .language-single-stat > * {
        z-index: 1;
    }
    .user-stats {
        gap: 0.7em;
        background: rgba(30,30,40,0.92);
        border-radius: 12px;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
        padding: 1em 0.5em 1.2em 0.5em;
        margin-top: 0.7em;
        width: 100%;
        max-width: 350px;
    }
    .user1 > div, .user2 > div {
        background: rgba(40,40,50,0.95);
        border-radius: 18px;
        box-shadow: 0 4px 24px 0 rgba(0,0,0,0.18);
        padding: 2rem 2.5rem 1.5rem 2.5rem;
        margin-bottom: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-width: 240px;
        max-width: 420px;
    }
    .user1 h1, .user2 h1 {
        color: #f1e05a;
        font-size: 2rem;
        margin-bottom: 1.2rem;
        text-align: center;
        font-weight: 700;
        letter-spacing: 0.5px;
    }
    .user1 img, .user2 img {
        margin-bottom: 0.7em;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
    }
    @media (max-width: 900px) {
        .users {
            flex-direction: column;
            align-items: center;
        }
        .user1, .user2 {
            width: 100%;
            max-width: 98vw;
            align-items: stretch;
        }
        .user1 > div, .user2 > div {
            min-width: unset;
            max-width: 98vw;
            padding: 1.2rem 0.7rem 1.2rem 0.7rem;
            height: auto;
        }
    }
    .avatar-skeleton {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.336) 0%,
            rgba(185, 185, 180, 0.18) 30%,
            rgba(43, 116, 137, 0.18) 60%,
            rgba(255, 255, 255, 0.08) 100%
        );
    animation: skeleton-loading 1.2s infinite linear;
    border: 2px solid #444;
    margin-top: 2.5rem;
}
@keyframes skeleton-loading {
    0% { background-position: -64px 0; }
    100% { background-position: 64px 0; }
}
</style>
