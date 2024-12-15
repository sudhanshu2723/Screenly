import { CreateFolders } from "@/actions/workspace"
import { useMutationData } from "./useMutationData"

export default function useCreateFolders(workspaceId:string){
     const {mutate}=useMutationData(
        ['create-folder'],()=>CreateFolders(workspaceId),'workspace-folders'
     )

     const onCreateNewFolder=()=>mutate({name:"Untitled",id:'optimistic--id'})
     return {onCreateNewFolder}
}