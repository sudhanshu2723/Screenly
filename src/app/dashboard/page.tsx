import { onAuthenticatedUser } from "@/actions/user"
import { redirect } from "next/navigation"


export default async function Page(){
    const auth = await onAuthenticatedUser()
    // if the user is authenticated and its entry have been created or its entry exists in the db then redirect it to users dashboard page
    if(auth.status===200 || auth.status===201){
        return redirect(`/dashboard/${auth.user?.workspace[0].id}`)
    }
    // is some error have occured during authentication then redirect them to sign-in page
    if(auth.status===400 || auth.status===500 || auth.status===404){
        return redirect('/auth/sign-in')
    }

}