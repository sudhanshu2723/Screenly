import { getAllUserVideos, getFolderInfo } from "@/actions/workspace"
import FolderInfo from "@/components/global/folders/info"
import Videos from "@/components/global/videos"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"


type Props={
    params:{
        folderId:string 
        workspaceId:string 
    }
}

export default async function Folder({params:{folderId,workspaceId}}:Props){
    // prefetch the videos which are in the folder
    const query=new QueryClient();
    await query.prefetchQuery({
        queryKey:['folder-videos'], 
        queryFn:()=>getAllUserVideos(folderId)
    })
    // prefetch the folder info
    await query.prefetchQuery({
        queryKey:['folder-info'],
        queryFn:()=>getFolderInfo(folderId)
    })

    return (
        <HydrationBoundary state={dehydrate(query)}>
            <FolderInfo folderId={folderId}/>
            <Videos workspaceId={workspaceId} folderId={folderId} videosKey="folder-videos" />
        </HydrationBoundary>
    )
}