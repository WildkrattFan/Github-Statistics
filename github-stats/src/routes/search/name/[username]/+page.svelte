<script lang="ts">
    import { signOut } from "@auth/sveltekit/client";
    import type { PageData } from "./$types";
    import type { codingLang, user, projectLang } from "$lib/types";
    import { Chart } from "chart.js";

    let { data }: { data: PageData } = $props();
    let userPromise = data.userData;
    let userData: user | null = $state(null);
    let processedLangs: any[] = $state([]);
    let filteredLangs: any[] = $state([]);
    let compareUsers = $state(false);
    userPromise.then((finishedData) => {
        console.log("User Data Loaded:", userData);
        userData = finishedData as user;

        processedLangs = calculateLangPercent(userData.languages || []);
        filteredLangs = processedLangs;

        if (userData.repositories) {
            userData.repositories = userData.repositories.map((repo) => ({
                ...repo,
                langs: repo.langs
                    ? calculateLangPercent(
                          repo.langs as unknown as codingLang[],
                      )
                    : [],
            }));
        }
    });
    // let userData = data.userData as user;

    // let processedLangs = calculateLangPercent(userData.languages || []);
    // let filteredLangs = $state(processedLangs);

    // Ensure each repo's langs are processed to include percent
    // if (userData.repositories) {
    //     userData.repositories = userData.repositories.map((repo) => ({
    //         ...repo,
    //         langs: repo.langs ? calculateLangPercent(repo.langs as unknown as codingLang[]) : []
    //     }));
    // }

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

    function filterLangs(name: string) {
        if (filteredLangs.some((lang) => lang.name == name)) {
            let partialLangsLines = 0;
            let partialLangs = filteredLangs.filter((lang) => {
                if (lang.name != name) {
                    partialLangsLines += lang.lines;
                    return true;
                }
                return false;
            });
            if (partialLangsLines > 0) {
                partialLangs = partialLangs.map((lang) => {
                    return {
                        name: lang.name,
                        lines: lang.lines,
                        percent: (
                            (lang.lines / partialLangsLines) *
                            100
                        ).toFixed(2),
                    };
                });
            }

            filteredLangs = partialLangs;
        } else {
            let reAddedLang = processedLangs.find((lang) => lang.name == name);
            filteredLangs.push(reAddedLang);
            filteredLangs = calculateLangPercent(filteredLangs);
        }
    }

    function updateRepoLangs(userData: user) {
        userData.repositories =
            userData.repositories?.map((repo) => {
                return {
                    ...repo,
                    langs: calculateLangPercent(
                        (repo.langs ?? []) as unknown as codingLang[],
                    ),
                };
            }) ?? null;
    }

    function dateToTimeAgo(dateStr: string) {
        const date = new Date(dateStr);
        const now = new Date();

        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        const intervals: [number, string][] = [
            [31536000, "year"],
            [2592000, "month"],
            [604800, "week"],
            [86400, "day"],
            [3600, "hour"],
            [60, "minute"],
            [1, "second"],
        ];

        for (const [secs, label] of intervals) {
            const interval = Math.floor(seconds / secs);
            if (interval >= 1) {
                return `${interval} ${label}${interval !== 1 ? "s" : ""} ago`;
            }
        }
        return "just now";
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

{#await data.userData}
    <main>
        <div class="loading-container">
            <div class="userHeader"></div>

            <div class="langGroup">
                <h1 class="lang-header">Languages</h1>
                <div class="lang-bar card loading-card-animation"></div>
                <div class="lang-filter-loading card">
                    <span class="filter-label">Filter by language:</span>
                    {#each Array(12) as lang}
                        <label class="pill loading-pill">
                            <input type="checkbox" />
                            <p></p>
                        </label>
                    {/each}
                </div>
            </div>
            <div class="Repos">
                <h3 class="repo-header">Repositories</h3>
                <div class="repo-boxes">
                    {#each Array(20) as _}
                        <div
                            class="repo-box fake-repo card loading-card-animation"
                        ></div>
                    {/each}
                </div>
            </div>
        </div>
    </main>
{:then userData}
    {#if compareUsers}
        <div class="compare-form">
            <form method="post" action="?/compare">
                <h3>Compare Two GitHub Accounts!</h3>
                <input type="text" name="newUser" />
                <input type="hidden" name="firstUser" value={userData.name}>
                <button>Submit</button>
            </form>
        </div>
    {/if}
    <main>
        <div class="userHeader">
            <img class="avatar" src={userData.avatar} alt="User PFP " />
            <a
                class="username"
                href="https://www.github.com/{userData.name}"
                target="_blank">Stats for {userData.name}</a
            >
            <div class="compare">
                <button
                    onclick={() => {
                        startComparing();
                    }}>Compare</button
                >
            </div>
        </div>

        <!--Languages and % of languages that were used-->
        <div class="langGroup">
            <h1 class="lang-header">Languages</h1>
            <div class="lang-bar card">
                {#each filteredLangs as lang}
                    <div
                        class="lang-section"
                        style="width: {lang.percent}%; background-color:  {getColor(
                            lang.name,
                        )};"
                        title="{lang.name}: {lang.percent}% lines: {lang.lines}"
                    >
                        {#if lang.percent > 5}
                            <p>{lang.name}</p>
                        {/if}
                    </div>
                {/each}
            </div>

            <div class="lang-filter card">
                <span class="filter-label">Filter by language:</span>
                {#each processedLangs as lang}
                    <label class="pill">
                        <input
                            type="checkbox"
                            onclick={() => filterLangs(lang.name)}
                        />
                        {lang.name}
                    </label>
                {/each}
            </div>
        </div>

        <div class="Repos">
            <h3 class="repo-header">Repositories</h3>
            <div class="repo-boxes">
                {#if userData.repositories}
                    {#each userData.repositories as repo}
                        <a href={repo.URL} class="repo-box">
                            <h5 class="repo-title">{repo.name}</h5>
                            <p>{repo.description}</p>

                            <div class="lang-bar">
                                {#if repo.langs}
                                    {#each repo.langs as lang}
                                        <div
                                            class="lang-section"
                                            style="width: {lang.percent}%; background-color:  {getColor(
                                                lang.name,
                                            )};"
                                            title="{lang.name}: {lang.percent}% lines: {lang.lines}"
                                        >
                                            {#if lang.percent && lang.percent > 5}
                                                <p>{lang.name}</p>
                                            {/if}
                                        </div>
                                    {/each}
                                {/if}
                            </div>
                            <div class="repo-additional-info">
                                <p>Created: {dateToTimeAgo(repo.created_at)}</p>
                                <p>
                                    Last Commit: {dateToTimeAgo(repo.pushed_at)}
                                </p>
                            </div>
                        </a>
                    {/each}
                {/if}
            </div>
        </div>
    </main>
{:catch error}
    <p>Error loading user data: {error.message}</p>
{/await}

<style>
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

    .card {
        background: rgba(40, 40, 50, 0.95);
        border-radius: 18px;
        box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.18);
        padding: 2rem 2.5rem;
        margin-bottom: 1.5rem;
    }
    .home-link {
        color: white;
        font-size: 2em;
    }

    .userHeader {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        justify-content: center;
    }
    .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 3px solid #444;
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.18);
        object-fit: cover;
    }

    .username {
        font-size: 2rem;
        font-weight: 700;
        color: #f1e05a;
        text-decoration: none;
        transition: color 0.2s;
    }
    .username:hover {
        color: #2b7489;
    }

    a {
        text-decoration: none;
        color: inherit;
    }
    .loading-container {
        margin-top: 6%;
    }
    .repo-header {
        color: #f1e05a;
        font-size: 1.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }
    .repo-boxes {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
    }
    .repo-box {
        max-width: 20%;
        min-width: 20%;
        background: rgba(40, 40, 50, 0.95);
        border-radius: 18px;
        box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.18);
        padding: 2rem 2.5rem;
        margin-bottom: 1.5rem;
        color: rgb(238, 234, 234);
    }
    .repo-box:hover {
        transform: scale(1.1);
        -webkit-transition: all 0.5s;
        -moz-transition: all 0.5s;
        transition: all 0.5s;
    }
    .repo-title {
        color: white;
        font-size: 1.5em;
        margin-top: 0;
    }

    .lang-bar {
        display: flex;
        max-width: 90%;
        width: 100%;
        height: 38px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
        margin-bottom: 1.5rem;
    }
    .lang-section {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-weight: 600;
        font-size: 1rem;
        transition: background 0.3s;
        cursor: pointer;
        height: 100%;
        white-space: nowrap;
    }

    .lang-header {
        color: white;
        font-size: 1.5 em;
    }

    .langGroup {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .lang-section:hover {
        filter: brightness(1.2);
        box-shadow: 0 0 8px 2px rgba(241, 224, 90, 0.15);
    }

    .lang-filter {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;
        justify-content: flex-start;
        background: rgba(30, 30, 40, 0.85);
        border-radius: 12px;
        padding: 1rem 1.5rem;
    }

    .filter-label {
        font-size: 1.1rem;
        font-weight: 500;
        margin-right: 1rem;
        color: #f1e05a;
        width: 100%;
    }

    .pill {
        display: flex;
        align-items: center;
        background: #232526;
        border-radius: 999px;
        padding: 0.4em 1em;
        font-size: 1rem;
        color: #f5f5f5;
        cursor: pointer;
        border: 1px solid #444;
        transition:
            background 0.2s,
            color 0.2s,
            border 0.2s;
        margin-right: 0.5em;
    }
    .pill input[type="checkbox"] {
        accent-color: #f1e05a;
        margin-right: 0.5em;
    }
    .pill:hover {
        background: #2b7489;
        color: #fff;
        border: 1px solid #f1e05a;
    }

    @media (max-width: 600px) {
        .card {
            padding: 1rem;
            width: 100%;
            min-width: unset;
            max-width: 98vw;
        }
        .userHeader {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
        .avatar {
            width: 56px;
            height: 56px;
        }
        .username {
            font-size: 1.2rem;
        }
        .repo-header {
            font-size: 1.1rem;
        }
        .repo-boxes {
            flex-direction: column;
            align-items: stretch;
        }
        .repo-box {
            min-width: 90vw;
            max-width: 98vw;
            padding: 1rem;
            margin-bottom: 1rem;
        }
        .lang-bar {
            height: 24px;
            max-width: 100%;
            margin-bottom: 1rem;
        }
        .lang-header {
            font-size: 1.1rem;
        }
        .lang-filter {
            flex-direction: column;
            gap: 0.5rem;
            padding: 0.5rem 0.5rem;
        }
        .filter-label {
            font-size: 1rem;
            margin-bottom: 0.5rem;
        }
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
        .Repos {
            padding: 0 0.5em;
        }
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

    .compare-form {
        display: flex;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: red;
        align-items: center;
        justify-content: center;
        padding: 5em;
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
    .lang-filter-loading {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;
        justify-content: flex-start;
        background: rgba(30, 30, 40, 0.85);
        border-radius: 12px;
        padding: 1rem 1.5rem;
    }
    .loading-card-animation {
        background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.336) 0%,
            rgba(185, 185, 180, 0.18) 30%,
            rgba(43, 116, 137, 0.18) 60%,
            rgba(255, 255, 255, 0.08) 100%
        );
        background-size: 300% 100%;
        animation: loadingAnimation 1.8s linear infinite;
        filter: blur(0.2px) brightness(1.08) contrast(1.1);
        position: relative;
        overflow: hidden;
    }

    @keyframes loadingAnimation {
        0% {
            background-position: 100% 0;
        }
        100% {
            background-position: 0 0;
        }
    }
    .fake-repo {
        width: 5rem;
        height: 9rem;
    }
    .loading-pill {
        display: flex;
        align-items: center;
        flex-direction: row;
        min-width: 2rem;
    }
</style>
