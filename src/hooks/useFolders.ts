import { useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";
import { useMutationData } from "./useMutationData";
import { getWorkspaceFolders, moveVideoLocation } from "@/actions/workspace";
import useZodForm from "./useZodForm";
import { moveVideoSchema } from "@/components/forms/change-video-location/schema";

type dataProps={
  folder_id:string 
  workspace_id:string 
}

export  function useMoveVideos(videoId:string,currentWorkspace:string){
      // get state of folders and workspaces from redux store
     const {folders}=useAppSelector((state)=>state.FolderReducer)
     const {workspaces}=useAppSelector((state)=>state.WorkSpaceReducer);
     // keeping track of folders fetching process
     const[isFetching,setIsFetching]=useState(false);
     const [isFolders, setIsFolders] = useState<
     | ({
         _count: {
           videos: number
         }
       } & {
         id: string
         name: string
         createdAt: Date
         workSpaceId: string | null
       })[] | undefined>(undefined);

      // use mutation data for creating optimistic change
        const {mutate,isPending}=useMutationData(['change-video-location'],(data:dataProps)=>moveVideoLocation(videoId,data.workspace_id,data.folder_id)) 
      // usezodForm to provide types
      const {errors,onFormSubmit,watch,register}=useZodForm(moveVideoSchema,mutate,{
        folder_id:null , workspace_id:currentWorkspace
      });
      
      // fetchfolders with use Effect
       const fetchFolders=async(workspace:string)=>{
          setIsFetching(true)
          const folders=await getWorkspaceFolders(workspace);
          setIsFetching(false)
          setIsFolders(folders.data)
       }
       useEffect(()=>{
        fetchFolders(currentWorkspace)
       },[]);

       useEffect(()=>{
        const workspace=watch(async(value)=>{
          if(value.workspace_id)fetchFolders(value.workspace_id)
        })
        return ()=>workspace.unsubscribe()
      },[watch]);
    

}