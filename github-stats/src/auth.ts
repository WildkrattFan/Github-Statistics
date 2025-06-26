import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"
import { env } from "$env/dynamic/private"
 
export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
  const authOptions = {
    providers: [
      GitHub({
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_SECRET,
        authorization: {params: {scope: "read:user"}}
      })
    ],
    secret: env.AUTH_SECRET,
    trustHost: true,
    callbacks:{
        async jwt({token, account, name}) {
            if(account){
                token.access_token = account.access_token
            }
            return token;
        },
        async session({session, token}) {
            if(token){
                session.access_token = token.access_token
            }
            return session;
        }
    }
  }
  return authOptions
})