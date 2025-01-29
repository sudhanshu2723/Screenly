'use client'

import { getWorkSpaces } from "@/actions/workspace"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useQueryData } from "@/hooks/useQueryData"
import { NotificationProps, WorkspaceProps } from "@/types/index.type"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import Modal from "../modal"
import { Menu, PlusCircle } from "lucide-react"
import Search from "../search"
import { MENU_ITEMS } from "@/constants"

import SidebarItem from "./sidebar-item"
import { getNotifications } from "@/actions/user"
import WorkspacePlaceholder from "./workspace-placeholder"
import GlobalCard from "../global-card"
import { Button } from "@/components/ui/button"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import InfoBar from "../info-bar"

import { useDispatch } from 'react-redux'
import { WORKSPACES } from "@/redux/slices/workspaces"
import PaymentButton from "../payment-button"


type Props={
    activeWorkspaceId: string
}

export default function Sidebar({activeWorkspaceId}:Props){
    const router=useRouter();
    const dispatch = useDispatch()  
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
// used for redux store to store the details of the workspace
    if(isFetched && currentWorkspace){
        dispatch(WORKSPACES({workspaces:workspace.workspace}))
    }
    const SidebarSection= (
        <div className="bg-[#111111]  flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden">
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
                                    workspace.members.map((workspace)=>workspace.WorkSpace && (
                                        <SelectItem value={workspace.WorkSpace.id} key={workspace.WorkSpace.id}>
                                                {workspace.WorkSpace.name}
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
            {/* telling user to purchase for PRO plan if he is in free plan */}
            {/* if a user is in free plan then it will have only one personal workspace and will not be a member of other workspaces */}
            {workspace.workspace.length === 1 && workspace.members.length === 0 && (
            <div className="w-full mt-[-10px]">
                <p className="text-[#3c3c3c] font-medium text-sm">
                   {workspace.subscription?.plan === 'FREE'
                     ? 'Upgrade to create workspaces'
                     : 'No Workspaces'}
                 </p>
            </div>
      )}
       <Separator className="w-4/5"/>
           
           {workspace.subscription?.plan==='FREE' && 
           (<GlobalCard
           title="Upgrade to Pro"
           description="Unlock AI features like transcription, AI summary, and more"
           footer={
             <PaymentButton />
           }
           />)}
        {/* all the workspaces that the person owns and are public workspaces */}
            <nav className="w-full">
                <ul className="h-[150px] overflow-auto overflow-x-hidden fade-layer">
                    {workspace.workspace.length> 0 && workspace.workspace.map((item)=>(
                        <SidebarItem 
                        href={`/dashboaard/${item.id}`}
                        selected={pathname === `/dashboard/${item.id}`}
                        title={item.name}
                        notifications={0}
                        key={item.name}
                        icon={<WorkspacePlaceholder>
                            {item.name.charAt(0)}
                        </WorkspacePlaceholder>}
                        >

                        </SidebarItem>
                    ))}
                    {/* Rendering all the workspace members */}
                    {workspace.members.length>0 && workspace.members.map((item)=>(
                        <SidebarItem
                        href={`dashboard/${item.WorkSpace.id}`}
                        selected={pathname===`/dashboard/${item.WorkSpace.id}`}
                        title={item.WorkSpace.name}
                        notifications={0}
                        key={item.WorkSpace.name}
                        icon={
                            <WorkspacePlaceholder>
                                {item.WorkSpace.name.charAt(0)}
                            </WorkspacePlaceholder>
                        }
                        >
                        </SidebarItem>
                    )) }

                </ul>
          
            </nav>
            {/* a button by which users can upgrade to pro plan */}
            {/* <Separator className="w-4/5"/>
           
            {workspace.subscription?.plan==='FREE' && 
            (<GlobalCard
            title="Upgrade to Pro"
            description="Unlock AI features like transcription, AI summary, and more"
            footer={
              <PaymentButton />
            }
            />)} */}
               
        </div>
      )
   
        {/* Infobar */}
        {/* sheet for mobile and desktop  */}
        return (
            <div className="full">
                <InfoBar/>
              <div className="md:hidden fixed my-4">
                <Sheet>
                  <SheetTrigger
                    asChild
                    className="ml-2"
                  >
                    <Button
                      variant={'ghost'}
                      className="mt-[2px]"
                    >
                      <Menu />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side={'left'}
                    className="p-0 w-fit h-full"
                  >
                    {SidebarSection}
                  </SheetContent>
                </Sheet>
              </div>
              <div className="md:block hidden h-full">{SidebarSection}</div>
            </div>
          )
}