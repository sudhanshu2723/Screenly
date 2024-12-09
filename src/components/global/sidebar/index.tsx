'use client'

import { getWorkSpaces } from "@/actions/workspace"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useQueryData } from "@/hooks/useQueryData"
import { WorkspaceProps } from "@/types/index.type"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Modal from "../modal"
import { PlusCircle } from "lucide-react"



type Props={
    activeWorkspaceId: string
}

export default function Sidebar({activeWorkspaceId}:Props){
    const router=useRouter();
    // function to change to workspace dashboard as we select a specific workspaceId
    function onChangeActiveWorkspace(value:string){
        router.push(`/dashboard/${value}`);
    }

    // extracting the workspaces with which user is associated with
    const {data,isFetched}=useQueryData(["user-workspaces"],getWorkSpaces);
    // providing types to the workspace
    const {data:workspace}=data as WorkspaceProps;
    return (
        <div className="bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden">
            <div className="bg-[#111111] p-4 flex gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0">
            <Image
            src="/opal-logo.svg"
             height={40}
             width={40}
             alt="logo"
            />
            <p className="text-2xl">Opal</p>
            </div>
            {/* // choosing a value using select tag will redirect the user to that specific dashboardId */}
            <Select defaultValue={activeWorkspaceId} onValueChange={onChangeActiveWorkspace}>
                <SelectTrigger className="mt-16 text-neutral-400 bg-transparent">
                    <SelectValue placeholder="Select a workspace"></SelectValue>
                    </SelectTrigger>
                        <SelectContent className="bg-[#111111] backdrop-blur-xl">
                            <SelectGroup>
                                <SelectLabel>Workspaces</SelectLabel>
                                <Separator/>
                                {/* showing your own workspaces */}
                                    {workspace.workspace.map((workspace)=>(
                                        <SelectItem key={workspace.id} value={workspace.id}>
                                                {workspace.name}
                                        </SelectItem>
                                    ))}
                                    {/* showing the workspaces in which you are a member */}
                                    {workspace.members.length>0 && 
                                    workspace.members.map((workspace)=>workspace.Workspace && (
                                        <SelectItem value={workspace.Workspace.id} key={workspace.Workspace.id}>
                                                {workspace.Workspace.name}
                                        </SelectItem>
                                    ))
                                    }
                            </SelectGroup>
                        </SelectContent>
            </Select>
            {/* Inviting other memebers to the workspace  */}
            <Modal trigger={
              <span className="text-sm cursor-pointer flex items-center justify-center bg-neutral-800/90  hover:bg-neutral-800/60 w-full rounded-sm p-[5px] gap-2">
                <PlusCircle
                  size={15}
                  className="text-neutral-800/90 fill-neutral-500"
                />
                <span className="text-neutral-400 font-semibold text-xs">
                  Invite To Workspace
                </span>
              </span>
            } title="Invite to Workspace" description="Invite other users to your workspace">
                    WorkspaceSearch
            </Modal>
        </div>
    )
}