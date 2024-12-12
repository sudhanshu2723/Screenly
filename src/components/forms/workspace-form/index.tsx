import { useMutationData } from "@/hooks/useMutationData"
import { useMutation } from "@tanstack/react-query"

type dataProps={
    name:string 
}

export default function WorkspaceForm(){
    const {}=useMutationData(['create-workspace'],(data:dataProps)=>CreateWorkspace(data.name),'user-workspace')
    return (
        <div>

        </div>
    )
}