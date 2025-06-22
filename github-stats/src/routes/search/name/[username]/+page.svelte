<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    let userData = data.userData
    console.log(userData)
</script>

<p>Test</p>
<p>{userData.name}</p>