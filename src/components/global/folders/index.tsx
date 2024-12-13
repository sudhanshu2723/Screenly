import FolderDuotone from "@/components/icons/folder-duotone"
import { ArrowRight } from "lucide-react"

type Props={
    workspaceId:string
}

export default function Folders({workspaceId}:Props){
    // get all the folders

    // optimisitic variable for optimistic UI
    return (
        <div
      className="flex flex-col gap-4"
      suppressHydrationWarning
    >
      <div className="flex items-center  justify-between">
        <div className="flex items-center gap-4">
          <FolderDuotone />
          <h2 className="text-[#BDBDBD] text-xl"> Folders</h2>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[#BDBDBD]">See all</p>
          <ArrowRight color="#707070" />
        </div>
      </div>
      <section>
        
      </section>

        </div>
    )
}