<script lang="ts">
    import type { PageData } from "./$types";
    import type { codingLang } from "$lib/types";

    let { data }: { data: PageData } = $props();
    let userData = data.userData;
    console.log(userData);
    let processedLangs = (calculateLangPercent(userData.languages))



    function calculateLangPercent(langList: codingLang[]) {
        let totalLines = 0;
        let percentList: any[] = [];
        for (let lang of langList) {
            totalLines += lang.lines;
        }

        if (totalLines > 0) {
            for (let lang of langList) {
                percentList.push({
                    percent: (lang.lines / totalLines  * 100).toFixed(2),
                    name: lang.name,
                    lines: lang.lines,
                });
            }
        }
        percentList.sort((a,b) => b.lines - a.lines)
        return percentList
    }

    function getColor(name: string): string {
    const colors: Record<string, string> = {
        "JavaScript": "#f1e05a",
        "TypeScript": "#2b7489",
        "Python": "#3572A5",
        "Java": "#b07219",
        "C#": "#178600",
        "C++": "#f34b7d",
        "HTML": "#e34c26",
        "CSS": "#563d7c",
        // fallback
        "default": "#ccc"
    };
    return colors[name] || colors["default"];
}


</script>

<p>{userData.name}</p>
<!--Languages and % of languages that were used-->
<div class="lang-bar">
{#each processedLangs as lang}
<div class = "lang-section"
style="width: {lang.percent}%;
    background-color: {getColor(lang.name)}"
    title="{lang.name}: {lang.percent}%"
>
{#if lang.percent > 5}
<p>{lang.name}</p>
{/if}
</div>
{/each}
</div>

<style>
    .lang-bar {
    display: flex;
    width: 100%;
    max-width: 800px;
    height: 30px;
    border: 1px solid black;
    border-radius: 5px;
    overflow: hidden;
}
    .lang-section{
        display: flex;
       height: 100%; 
       justify-content: center;
       align-items: center;
       color: white;
       white-space: nowrap;
       
    }
</style>
