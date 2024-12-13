'use client'
import { getWorkSpaces } from "@/actions/workspace"
import { useQueryData } from "@/hooks/useQueryData"
import Modal from "../modal"
import { Button } from "@/components/ui/button"
import FolderPlusDuotine from "@/components/icons/folder-plus-duotone"
import WorkspaceForm from "@/components/forms/workspace-form"

type dataType={
    status:number 
    data:{
        subscription:{
            plan:'PRO'|'FREE'
        } | null
    }
}

export default function CreateWorkspace(){
    // getting the details of the workspace
    const {data}=useQueryData(['user-workspaces'],getWorkSpaces);
    // giving the type
    const {data:plan}=data as dataType;
    // if plan is free then you cannot create a workspace
   if(plan.subscription?.plan==='FREE'){
       return <></>
   }
   if(plan.subscription?.plan==='PRO'){
        return (
            <Modal 
            title="Create a Workspace"
            description="Workspaces helps you collaborate with team members. You are assigned a default personal workspace where you can share videos in private with yourself."
            trigger={<Button className="bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl">
               <FolderPlusDuotine/>
                Create a Workspace
              </Button>}
            >
            <WorkspaceForm/>
            </Modal>
        )
   }
   
}