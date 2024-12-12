'use client'

import { getWorkSpaces } from "@/actions/workspace"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useQueryData } from "@/hooks/useQueryData"
import { NotificationProps, WorkspaceProps } from "@/types/index.type"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import Modal from "../modal"
import { PlusCircle } from "lucide-react"
import Search from "../search"
import { MENU_ITEMS } from "@/constants"
import { Item } from "@radix-ui/react-select"
import SidebarItem from "./sidebar-item"
import { getNotifications } from "@/actions/user"



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
    // getting the notifications for the user from the db
    const { data:notifications}=useQueryData(['user-notifications'],getNotifications);
    const {data:count}=notifications as NotificationProps;
    // getting the details of the currentWorkspace
    const currentWorkspace=workspace.workspace.find((s)=>s.id===activeWorkspaceId)
    // get all the dynamic routes
    const menuItems=MENU_ITEMS(activeWorkspaceId);
    const pathname=usePathname();
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
            {/* {only a paid and user with public workspace can invite other members to its workspace} */}
            {currentWorkspace?.type==='PUBLIC' && workspace.subscription?.plan==='PRO' && ( <Modal trigger={
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
                    <Search workspaceId={activeWorkspaceId}/>
            </Modal>
        )}
        <p className="w-full text-[#9D9D9D] font-bold mt-4">Menu</p>
        <nav className="w-full">
            <ul>{menuItems.map((item)=>(
            <SidebarItem
            href={item.href}
            icon={item.icon}
            selected={pathname===item.href}
            title={item.title}
            key={item.title}
            notifications={
                (item.title==='Notifications' && 
                    count._count &&
                    count._count.notification) || 0 }>
            </SidebarItem>
            ))}</ul>
        </nav>
        <Separator className="w-4/5" />
        <p className="w-full text-[#9D9D9D] font-bold mt-4 ">Workspaces</p>
            
        </div>
    )
}