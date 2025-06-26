<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { LayoutData } from './$types';
    import Footer from '$lib/components/Footer.svelte';


    let { data, children }: { data: LayoutData, children: Snippet } = $props();
</script>

<div class="parrentBody">
{@render children()}
<Footer />
</div>
<style>
:global(body) {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    padding-bottom: 0;
    box-sizing: border-box;
    flex: 1;
}
</style>