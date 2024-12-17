'use client'
import { getAllUserVideos } from "@/actions/workspace"
import VideoRecorderDuotone from "@/components/icons/video-recorder-duotone"
import { useQueryData } from "@/hooks/useQueryData"
import { cn } from "@/lib/utils"
import { VideosProps } from "@/types/index.type"
import VideoCard from "./video-card"

type Props={
    folderId:string 
    videosKey:string 
    workspaceId:string 
}

export default function Videos({folderId,videosKey,workspaceId}:Props){
    // getting video data    
    const {data:videoData}=useQueryData([videosKey],()=>getAllUserVideos(folderId));
    const {status:videosStatus,data:videos}=videoData as VideosProps;
    const mockVideosData: VideosProps = {
      status: 200,
      data: [
        {
          User: {
            firstname: "John",
            lastname: "Doe",
            image: "https://example.com/image.jpg"
          },
          id: "video1",
          processing: false,
          Folder: {
            id: "folder1",
            name: "My Videos"
          },
          createdAt: new Date("2023-10-01T10:00:00Z"),
          title: "Sample Video",
          source: "https://example.com/video.mp4"
        },
        {
          User: {
            firstname: "Jane",
            lastname: "Smith",
            image: null
          },
          id: "video2",
          processing: true,
          Folder: null,
          createdAt: new Date("2023-10-02T12:00:00Z"),
          title: null,
          source: "https://example.com/video2.mp4"
        }
      ]
    };
    return (
        <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <VideoRecorderDuotone/>
                  <h2 className="text-[#BdBdBd] text-xl">Videos</h2>  
                </div>
            </div>
            <section className={cn(videosStatus!==200 ? 'p-5': 'grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5')}>
            {videosStatus != 200 ? (
          mockVideosData.data.map((video) => (
            <VideoCard
              key={video.id}
              workspaceId={workspaceId}
              {...video}
            />
            
          ))
        ) : (
          <p className="text-[#BDBDBD]"> No videos in workspace</p>
        )} 
            </section>
        </div>
    )
}