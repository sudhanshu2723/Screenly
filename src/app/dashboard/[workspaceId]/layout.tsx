import { getNotifications, onAuthenticatedUser } from "@/actions/user"
import verifyAccessToWorkspace, { getAllUserVideos, getWorkspaceFolders, getWorkSpaces } from "@/actions/workspace"
import { redirect } from "next/navigation"
import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query'
import React from "react"
import Sidebar from "@/components/global/sidebar"
import GlobalHeader from "@/components/global/global-header"


type Props={
    params:{workspaceId:string}
    children:React.ReactNode
}


export default async function Page({children,params:{workspaceId}}:Props){
    const auth=await onAuthenticatedUser();
    // if the workspace of the user does not exist
    // this is done to prevent ts error
    if(!auth.user?.workspace || !auth.user?.workspace.length)redirect('/auth/sign-in');
    // check if the user have access to this workspaceId  and returns the workspace of the user and well as the workspaces in which it is a member
    const hasAccess=await verifyAccessToWorkspace(workspaceId);
    if(hasAccess.status!==200){
        redirect(`/dashboard/${auth.user?.workspace[0].id}`)
    }
    if(!hasAccess.data?.workspace)return null;
    // caching the workspace folders already
    const query=new QueryClient();
    // The prefetchQuery function is used to prefetch data in advance and store it in the cache without returning the data directly. This is useful when you want to ensure that certain data is available in the cache before it is needed,
    await query.prefetchQuery({
        queryKey:["workspace-folders"],
        queryFn:()=>getWorkspaceFolders(workspaceId)
    })
    await query.prefetchQuery({
        queryKey:["user-videos"],
        queryFn:()=>getAllUserVideos(workspaceId)
    })
    await query.prefetchQuery({
        queryKey:["user-workspaces"],
        queryFn:()=>getWorkSpaces()
    })
    await query.prefetchQuery({
        queryKey:["user-notifications"],
        queryFn:()=>getNotifications()
    })

    return (
       <HydrationBoundary state={dehydrate(query)}>
            <div className="flex h-screen w-screen">
                <Sidebar activeWorkspaceId={workspaceId}/>
                <div className="w-full pt-28 p-6 overflow-y-scroll overflow-x-hidden">
                    <GlobalHeader workspace={hasAccess.data.workspace}/>
                    <div className="mt-4">{children}</div>

                </div>
            </div>
       </HydrationBoundary>
    )
}