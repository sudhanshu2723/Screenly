'use client'
import { WorkSpace } from "@prisma/client"
import { usePathname } from "next/navigation"


type Props={
    workspace:WorkSpace
}

// building the header according to the Menu item
export default function GlobalHeader({workspace}:Props){
    // finding the path in which we are present
    const pathName=usePathname().split(`/dashboard/${workspace.id}`)[1]


    return (
        // displaying the type of page in which we are present
        <article className="flex flex-col gap-2">
        <span className="text-[#707070] text-xs">
          {pathName.includes('video') ? '' : workspace.type.toLocaleUpperCase()}
        </span>
        <h1 className="text-4xl font-bold">
          {pathName && !pathName.includes('folder') && !pathName.includes('video')
            ? pathName.charAt(1).toUpperCase() + pathName.slice(2).toLowerCase()
            : pathName.includes('video')
            ? ''
            : 'My Library'}
        </h1>
      </article>
      
    )
}