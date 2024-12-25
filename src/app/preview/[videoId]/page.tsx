import { getPreviewVideo } from "@/actions/workspace";
import VideoPreview from "@/components/global/videos/preview";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"


type Props={
    params:{
        videoId:string
    }
}


// page where other users can view your video
export default async function VideoPage({params:{videoId}}:Props){
    // prefetch the details of the video
    const query=new QueryClient();
    await query.prefetchQuery({
        queryKey:['preview-video'],
        queryFn:()=>getPreviewVideo(videoId)
    })
    return (
       <HydrationBoundary state={dehydrate(query)}>
            <VideoPreview videoId={videoId}/>
       </HydrationBoundary>
    )
}