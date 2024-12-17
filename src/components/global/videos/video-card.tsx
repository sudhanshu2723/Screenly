import ChangeVideoLocation from "@/components/forms/change-video-location"
import Loader from "../loader"
import CardMenu from "./video-card-menu"


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
  
    return (
      //  <Loader state={false}>
      //   <div className=" group overflow-hidden cursor-pointer bg-[#171717] relative border-[1px] border-[#252525] flex flex-col rounded-xl">
      //   <div className="absolute top-3 right-3 z-50 gap-x-3 hidden group-hover:flex">
      
      //       <CardMenu
      //        currentFolderName={props.Folder?.name}
      //        videoId={props.id}
      //        currentWorkspace={props.workspaceId}
      //        currentFolder={props.Folder?.id}
      //       />
            
      //   </div>
      //   </div>
      //  </Loader>
      <ChangeVideoLocation/>
    )
}