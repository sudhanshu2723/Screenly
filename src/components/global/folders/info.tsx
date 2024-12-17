'use client'
import { getFolderInfo } from "@/actions/workspace"
import { useQueryData } from "@/hooks/useQueryData"
import { FolderProps } from "@/types/index.type"



type Props={
    folderId:string 
}

export default function FolderInfo({folderId,}:Props){
//    getting details of the folder
    const {data}=useQueryData(['folder-info'],()=>getFolderInfo(folderId));
    const {data:folder}=data as FolderProps;
    return (
        <div className="flex items-center">
            <h2 className="text[#BdBdBd] text-2xl">{folder.name}</h2>
            
        </div>
    )
}