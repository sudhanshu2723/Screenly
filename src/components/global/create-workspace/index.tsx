'use client'
import { getWorkSpaces } from "@/actions/workspace"
import { useQueryData } from "@/hooks/useQueryData"

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
            <div>
            
            </div>
        )
    }
   
}