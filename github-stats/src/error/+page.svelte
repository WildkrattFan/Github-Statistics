<script lang="ts">
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
</script>

<main>
    <div class = "error-box">
        <h1>Some Error Occured!</h1>
        <a href="/">Home</a>
    </div>
</main>
