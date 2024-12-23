import ChangeVideoLocation from "@/components/forms/change-video-location"
import Loader from "../loader"
import CardMenu from "./video-card-menu"
import CopyLink from "./copy-link"
import Link from "next/link"


type Props = {
    User: {
      firstname: string | null
      lastname: string | null
      image: string | null
    } | null
    id: string
    Folder: {
      id: string
      name: string
    } | null
    createdAt: Date
    title: string | null
    source: string
    processing: boolean
    workspaceId: string
  }
  
// component for displaying the card
export default function VideoCard(props: Props){
  // get the time before which the video was made
  const daysAgo=Math.floor(
    (new Date().getTime()-props.createdAt.getTime())/(24*60*60*1000)
  )

    return (
       <Loader  className="bg-[#171717]  flex justify-center items-center border-[1px] border-[#252525] rounded-xl"
       state={!props.processing}>
        <div className="group  cursor-pointer bg-[#171717] relative border-[1px] border-[#252525] flex flex-col rounded-xl">
        <div className="absolute top-3 right-3 z-50 flex flex-col">
            <CardMenu
             currentFolderName={props.Folder?.name}
             videoId={props.id}
             currentWorkspace={props.workspaceId}
             currentFolder={props.Folder?.id}
            />
            {/* when we click on this icon it is going to save on the clipboard */}
            <CopyLink variant={'ghost'} className="p-0 h-5 bg-hover:bg-transparent" videoId={props.id}/>
            {/* component having thumbnail , avatar image and other info */}
            <Link href={`/preview/${props.id}`} className="hover:bg-[#252525] transition duration-150 flex flex-col justify-between h-full" >
            <video controls={false} preload="metadata" className="w-full aspect-video opacity-50 z-20">
                <source src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${props.source}#t=1`} />

            </video>
            <div className="px-5 py-3 flex flex-col gap-7-2 z-20">
              <h2 className="text-sm font-semibold text-[#BDBDBD]">
                {props.title}

              </h2>

            </div>
            </Link>
        </div>
        </div>
      
  
       </Loader>
    )
}