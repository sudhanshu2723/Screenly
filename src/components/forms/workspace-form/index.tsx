import { useCreateWorkspace } from "@/hooks/useCreateWorkspace"

type dataProps={
    name:string 
}
// creating a form of the PRO user to create workspaces
export default function WorkspaceForm(){
    const {errors,isPending,onFormSubmit,register}=useCreateWorkspace();
    return (
       <form
       onSubmit={onFormSubmit}
       className="flex flex-col gap-y-3"
       >
fvfv
       </form>
    )
}