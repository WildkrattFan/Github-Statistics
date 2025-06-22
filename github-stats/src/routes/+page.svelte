<script>
    import {SignIn, SignOut} from "@auth/sveltekit/components"
    import {page} from "$app/stores"
    import { signIn, signOut } from "@auth/sveltekit/client"
    let password
</script>

<form method = "POST" action="?/search">
    <label for="search-query">Search by github username</label>
<input id = "search-query" type="text" name = "username">
<button>Search</button>
</form>

<div>
    {#if $page.data.session}
    {#if $page.data.session.user?.image}
      <img
        src={$page.data.session.user.image}
        class="avatar"
        alt="User Avatar"
      />
    {/if}
    <span class="signedInText">
      <small>Signed in as</small><br />
      <strong>{$page.data.session.user?.name ?? "User"}</strong>
    </span>
    <!-- <SignOut>
      <div slot="submitButton" class="buttonPrimary">Sign out</div>
    </SignOut> -->
    <button on:click={() => signOut()}>
        Sign Out
      </button>
  {:else}
    <span class="notSignedInText">You are not signed in</span>
    <!-- <SignIn>
      <div slot="submitButton" class="buttonPrimary">Sign in</div>
    </SignIn> -->
    <button on:click={() => signIn("github")}>Sign In with GitHub</button>
  {/if}
</div>