import { getFolderInfo, getWorkSpaces } from "@/actions/workspace"
import Loader from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useMoveVideos } from "@/hooks/useFolders"



type Props={
    videoId:string 
    currentFolder?:string 
    currentWorkSpace?:string 
    currentFolderName?:string 
}
// changing the location of the video to a different folder
export default  function ChangeVideoLocation({videoId,currentFolder,currentFolderName,currentWorkSpace}:Props){
    const {onFormSubmit,
        errors,
        register,
        isPending,
        folders,
        workspaces,
        isFetching,
        isFolders}=useMoveVideos(videoId,currentWorkSpace!);
     
        const folder=folders.find((f)=>f.id===currentFolder);
        const workspace=workspaces.find((f)=>f.id===currentWorkSpace);
      
    return (
        // after form is submitted the useMoveVideoHook will mode the videos
        <form className="flex flex-col gap-y-5" onSubmit={onFormSubmit}>
            <div className="border-[1px] rounded-xl p-5">
                <h2 className="text-xs mb-5 text-[#a4a4a4]">Current Workspace</h2>
                {workspace && <p>{workspace.name}</p>}
                <h2 className="text-xs text-[#a4a4a4] mt-4">Current Folder</h2>
                {folder ? <p>{folder.name}</p>: 'This video has not folder'}


            </div>
             <Separator orientation="horizontal"/>
             <div className="flex flex-col gap-y-5 p-5 border-[1px] rounded-xl">
                <h2 className="text-xs text-[#a4a4a4]">To</h2>
                <Label className="flex-col gap-y-2 flex">
                    <p className="text-xs">Workspace</p>
                    <select className="rounded-xl text-base bg-transparent" {...register("workspace_id")} >
                       {workspaces.map((space)=>(
                        <option key={space.id} className="text-[#a4a4a4]" value={space.id}>
                                {space.name} 
                        </option>
                       ))}
                    </select>
                </Label>
                    {isFetching ? <Skeleton className="w-full h-[40px] rounded-xl"/>:
                    <Label className="flex flex-col gap-y-2">
                        <p className="text-xs">Folders in this Workspace</p>
                        {isFolders && isFolders.length > 0 ? (
                            <select {...register('folder_id')}
                            className="rounded-xl bg-transparent text-base"
                            >
                                {isFolders.map((folder,key)=>key===0 ? (
                                    <option className="text-[#a4a4a4]"
                                    key={folder.id}
                                    value={folder.id}
                                    >
                                        {folder.name}
                                    </option>
                                ):( <option className="text-[#a4a4a4] bg-black"
                                    key={folder.id}
                                    value={folder.id}
                                    >
                                        {folder.name}
                                    </option>)
                            )}
                            </select>
                            ):(<p className="text-[#a4a4a4] text-sm">
                                This Workspace has no folders

                            </p>)
                        }
                        

                    </Label>
                    }
             </div>
             <Button>
                <Loader state={isPending} color="#000">
                    Transfer
                </Loader>
             </Button>
        </form>
    )
}