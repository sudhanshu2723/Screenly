import { onAuthenticatedUser } from "@/actions/user"
import verifyAccessToWorkspace from "@/actions/workspace"
import { redirect } from "next/navigation"

import React from "react"


type Props={
    params:{workspaceId:string}
    children:React.ReactNode
}


export default async function ({children,params:{workspaceId}}:Props){
    const auth=await onAuthenticatedUser();
    // if the workspace of the user does not exist
    // this is done to prevent ts error
    if(!auth.user?.workspace || !auth.user?.workspace.length)redirect('/auth/sign-in');
    // check if the user have access to this workspaceId  and returns the workspace of the user and well as the workspaces in which it is a member
    const hasAccess=await verifyAccessToWorkspace(workspaceId);


    return (
        <div>
            {workspaceId}
            {children}
        </div>
    )
}