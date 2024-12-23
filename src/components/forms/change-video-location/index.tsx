import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useMoveVideos } from "@/hooks/useFolders"



type Props={
    videoId:string 
    currentFolder?:string 
    currentWorkSpace?:string 
    currentFolderName?:string 
}
// changing the location of the video to a different folder
export default function ChangeVideoLocation({videoId,currentFolder,currentFolderName,currentWorkSpace}:Props){
    const {onFormSubmit,
        errors,
        register,
        isPending,
        folders,
        workspaces,
        isFetching,
        isFolders}=useMoveVideos(videoId,currentWorkSpace!);
      console.log("workspace is"+workspaces)
        const folder=folders.find((f)=>f.id===currentFolder);
        const workspace=workspaces.find((f)=>f.id===currentWorkSpace);
    return (
        <form className="flex flex-col gap-y-5">
            <div className="border-[1px] rounded-xl p-5">
                <h2 className="text-xs mb-5 text-[#a4a4a4]">Current</h2>
                {workspace && <p className="text-[#a4a4a4]">{workspace.name} Workspace</p>}
                <p className="text-[#a4a4a4] text-sm">This video has no folder</p>

            </div>
             <Separator orientation="horizontal"/>
             <div className="flex flex-col gap-y-5 p-5 border-[1px] rounded-xl">
                <h2 className="text-xs text-[#a4a4a4]">To</h2>
                <Label className="flex-col gap-y-2 flex">
                    <p className="text-xs">Workspace</p>
                    <select className="rounded-xl text-base bg-transparent">
                        <option className="text-[#a4a4a4]" value={'something'}>
                              workspace  
                        </option>
                    </select>
                </Label>

             </div>
        </form>
    )
}