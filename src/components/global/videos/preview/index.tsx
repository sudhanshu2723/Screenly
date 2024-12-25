'use client'
import { getPreviewVideo } from "@/actions/workspace"
import { useQueryData } from "@/hooks/useQueryData"
import { VideoProps } from "@/types/index.type"
import { useRouter } from "next/navigation"
import CopyLink from "../copy-link"
import RichLink from "./rich-link"
import { truncate } from "fs"
import { truncateString } from "@/lib/utils"
import { Download } from "lucide-react"
import TabMenu from "../../tabs"
import AiTools from "../../ai-tools"
import VideoTranscript from "../../video-transcript"
import { TabsContent } from "@/components/ui/tabs"


type Props={
    videoId:string 
}

export default function VideoPreview({videoId}:Props){
    // if any other user have viewed your video then increase the view count

    const router=useRouter();
    // get the details of the video
    const {data}=useQueryData(['preview-video'],()=>getPreviewVideo(videoId))
    const {data:video,status,author}=data as VideoProps;
   // send the user to the home page if some error have occured in previewing the video
    if(status!==200)router.push('/')
      // get the time before which the video was made
     const daysAgo=Math.floor(
    (new Date().getTime()-video.createdAt.getTime())/(24*60*60*1000)
     )

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 lg:py-10 overflow-y-auto gap-5">
      <div className="flex flex-col lg:col-span-2 gap-y-10">
        <div>
            {/* Display the title of the video and if you are the author then you have edit access */}
          <div className="flex gap-x-5 items-start justify-between">
            <h2 className="text-white text-4xl font-bold">{video.title}</h2>
            {/* {author ? (
              <EditVideo
                videoId={videoId}
                title={video.title as string}
                description={video.description as string}
              />
            ) : (
              <></>
            )} */}
          </div>
          <span className="flex gap-x-3 mt-2">
            <p className="text-[#9D9D9D] capitalize">
              {video.User?.firstname} {video.User?.lastname}
            </p>
            <p className="text-[#707070]">
              {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
            </p>
          </span>
        </div>
        <video
          preload="metadata"
          className="w-full aspect-video opacity-50 rounded-xl"
          controls
        >
            {/* Take  the video directly from the cloufront URL */}
          <source
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}#1`}
          />
        </video>
        <div className="flex flex-col text-2xl gap-y-4">
          <div className="flex gap-x-5 items-center justify-between">
            {/* If you are author then you can change the description of the video */}
            <p className="text-[#BDBDBD] text-semibold">Description</p>
            {/* {author ? (
              <EditVideo
                videoId={videoId}
                title={video.title as string}
                description={video.description as string}
              />
            ) : (
              <></>
            )} */}
          </div>
          <p className="text-[#9D9D9D] text-lg text-medium">
            {video.description}
          </p>
        </div>
      </div>
      <div className="lg:col-span-1 flex flex-col gap-y-16">
        <div className="flex justify-end gap-x-3 items-center">
         {/* component used to copy the link of the video on the clipboard */}
          <CopyLink
            variant="outline"
            className="rounded-full bg-transparent px-10"
            videoId={videoId}
          />
          {/*  component used to copy the ttile,description,video,link and give it to any other user */}
          <RichLink
          description={truncateString(video.description as string,150)}
          id={videoId}
          source={video.source}
          title={video.title as string}
          />
          <Download className="text-[#4c4c4c]"/>
          </div>
          <div>
            <TabMenu defaultValue="Ai tools" triggers={['Ai tools','Transcript','Activity']}>
                <AiTools plan="FREE" trial={false} videoId={videoId} />
                <VideoTranscript transcript={video.description!}/>
                <TabsContent value="Activity">
                    Make changes to your account here. 
                </TabsContent>
            </TabMenu>
          </div>
         </div>
        </div>

    )
}