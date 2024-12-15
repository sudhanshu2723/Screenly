'use client'
import FolderDuotone from "@/components/icons/folder-duotone"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import Folder from "./folder"
import { useQueryData } from "@/hooks/useQueryData"
import { getWorkspaceFolders } from "@/actions/workspace"
import { useMutationDataState } from "@/hooks/useMutationData"

type Props={
    workspaceId:string
}
export type FolderProps={
  status:number 
  data:({
    _count:{
      videos:number 
    }
  } & {
    id:string 
    name:string 
    createdAt:Date 
    workSpaceId:string | null 
  })[]
}

export default function Folders({workspaceId}:Props){
    // get all the folders
    const {data,isFetched}=useQueryData(['workspace-folders'],()=>getWorkspaceFolders(workspaceId))
    // optimisitic variable for optimistic UI
    // we can get the latest folder through variables in react-query
    const {latestVariables}=useMutationDataState(['create-folder']);
    const {status,data:folders}=data as FolderProps
    // if(isFetched && folders){
       
    // }
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
      <section className={(cn(status!==200 && 'justify-center', 'flex items-center gap-4 overflow-x-auto w-full'))}>
        {status!==200 ? <p className="text-neutral-300">No folders in Workspace</p>:
        <>{latestVariables && latestVariables.status==="pending" && (
          <Folder name={latestVariables.variables.name}
          id={latestVariables.variables.id}
          optimistic
          />
        )}
        {folders.map((folder)=>(
          <Folder
          name={folder.name}
          count={folder._count.videos}
          id={folder.id}
          key={folder.id}
          >

          </Folder>
        ))}
        </>

        }
      </section>

        </div>
    )
}