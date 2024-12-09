'use client'

import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { useRouter } from "next/navigation"



type Props={
    activeWorkspaceId: string
}

export default function Sidebar({activeWorkspaceId}:Props){
    const router=useRouter();
    function onChangeActiveWorkspace(value:string){
        router.push(`/dashboard/${value}`);
    }
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
                    <SelectValue placeholder="Select a workspace">
                        <SelectContent className="bg-[#111111] backdrop-blur-xl">
                            <SelectGroup>
                                <SelectLabel>Workspaces</SelectLabel>
                            </SelectGroup>
                        </SelectContent>
                    </SelectValue>
                </SelectTrigger>
            </Select>
        </div>
    )
}