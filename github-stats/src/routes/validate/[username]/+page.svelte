<script lang="ts">
    import { onMount } from "svelte";
    import type { PageData } from "../$types";
    import { enhance } from "$app/forms";


    let { data, form }: { data: PageData; form: FormData } = $props();
    let username: string = $state(data.username || "");
    let resume: File | null = $state(null);
    let userData: any = $state(null);
    let resumeText: string = $state("");

    onMount(async () => {
        if (data.username && sessionStorage.getItem("alreadySubmitted") == "false") {
            console.log("it ran!");
            username = data.username;
            // 1. Get base64 from sessionStorage
            const base64 = JSON.parse(sessionStorage.getItem("resume") || "{}").resume;
            if (base64) {
                // 2. Convert base64 to Blob
                function base64ToBlob(base64: string, mime = "application/pdf") {
                    const byteString = atob(base64.split(",")[1]);
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    for (let i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    return new Blob([ab], { type: mime });
                }
                const pdfBlob = base64ToBlob(base64);

                // 3. Create a File (optional, for filename)
                resume = new File([pdfBlob], "resume.pdf", { type: "application/pdf" });

                // 4. Create FormData and append
                const formData = new FormData();
                formData.append("username", username);
                formData.append("resume", resume);

                // 5. Send to server
                let res = await fetch("/api/validate", {
                    method: "POST",
                    body: formData,
                });
                console.log(res);
                if (res.ok) {
                    console.log("Resume loaded successfully");
                    const result = await res.json();
                    userData = result.userData;
                    resumeText = result.resumeText || "";
                } else {
                    console.error("Failed to load resume:", res);
                }
            }
        }
    });





    
</script>


<main></main>
