<script lang="ts">
  import { SignIn, SignOut } from "@auth/sveltekit/components";
  import { page } from "$app/stores";
  import { signIn, signOut } from "@auth/sveltekit/client";
  let password;
  let { form }: { form: any } = $props();
</script>

<main>
  <div class="main-box card">
    {#if $page.data.session}
      <form class="username-search" method="POST" action="?/search">
        <h1 class ="main-header">Search GitHub Users</h1>
        <input id="search-query" type="text" name="username" placeholder="Enter GitHub username..." />
        <button>Search</button>
        {#if form && form.usernameError}
          <p class="error-msg">{form.usernameError}</p>
        {/if}
      </form>
      <span class="signedInText">
        <small>Signed in as&nbsp;</small><strong>{$page.data.session.user?.name ?? "User"}</strong><br />
        
      </span>
      <button class="signout-btn" onclick={() => signOut()}>Sign Out</button>
    {:else}
      <span class="notSignedInText">Sign In To Search Users</span>
      <button class="signin-btn" onclick={() => signIn("github")}>Sign In with GitHub</button>
    {/if}
  </div>
</main>

<style>
  main {
    background: rgba(30, 30, 40, 0.92);
    min-height: 100vh;
    padding: 2rem 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
  .main-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 340px;
    max-width: 420px;
    width: 100%;
    gap: 1.5rem;
  }
  .main-header {
    color: #f1e05a;
    font-size: 2rem;
    margin-bottom: 1.2rem;
    text-align: center;
  }
  .username-search {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    align-items: center;
  }
  #search-query {
    padding: 0.7em 1.2em;
    border-radius: 8px;
    border: 1px solid #444;
    background: #232526;
    color: #f5f5f5;
    font-size: 1.1rem;
    width: 100%;
    max-width: 260px;
    margin-bottom: 0.5em;
    transition: border 0.2s, background 0.2s;
  }
  #search-query:focus {
    outline: none;
    border: 1.5px solid #f1e05a;
    background: #232526;
  }
  button {
    background: #2b7489;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 0.7em 1.5em;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 0.5em;
    transition: background 0.2s, color 0.2s;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
  }
  button:hover {
    background: #f1e05a;
    color: #232526;
  }
  .signout-btn, .signin-btn {
    width: 100%;
    margin-top: 1em;
  }
  .signedInText, .notSignedInText {
    color: #f5f5f5;
    font-size: 1.1rem;
    text-align: center;
    margin-top: 0.5em;
  }
  .error-msg {
    color: #f34b7d;
    font-size: 1rem;
    margin-top: 0.5em;
    text-align: center;
  }
  @media (max-width: 600px) {
    .card, .main-box {
      padding: 1rem;
      min-width: unset;
      max-width: 98vw;
    }
    .main-header {
      font-size: 1.3rem;
    }
    #search-query {
      font-size: 1rem;
      max-width: 98vw;
    }
  }
</style>
