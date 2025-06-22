import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

import { signIn } from "../../auth"
import type { Actions } from "./$types"
export const actions: Actions = { default: signIn }