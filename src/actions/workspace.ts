"use server"

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server"

export default async function verifyAccessToWorkspace(workspaceId:string){
      try{
        // get the user details from clerk
         const user=await currentUser();
         if(!user)return {status:403}

      //   This query checks if a user (user.id) is associated with a specific workspace (workspaceId) in one of two ways:
        // Directly: The workspace has a User with the same clerkid as the user.
         //Indirectly: The user is part of the workspace's members
         const isUserIntoWorkspace=await client.workSpace.findUnique({
            where:{
                id:workspaceId,
                OR:[
                    {
                        User:{
                            clerkid:user.id
                        }
                    },
                    {
                        members:{
                            every:{
                                User:{
                                    clerkid:user.id
                                }
                            }
                        }
                    }
                ]
            }
         })
         return {
            status:200,
            data:{workspace:isUserIntoWorkspace}
         }
      }
      catch(e){
        return {
            status:403,
            data:{workspace:null}
        }
      }
}

// getWorkspaceFolders: Fetches all folders associated with a given workspace ID from the database, including a count of videos in each folder. Returns the folders if found,
// or an appropriate status code otherwise.
export async function getWorkspaceFolders(workspaceId:string){
    try{
        const isFolders=await client.folder.findMany({
            where:{
                workSpaceId:workspaceId
            },
            include:{
                _count:{
                    select:{
                        videos:true
                    }
                }
            }
        })
        if(isFolders && isFolders.length>0){
            return {status:200,data:isFolders}
        }
        return {status:404,data:[]}
    }
    catch(error){
        return {status:500,data:[]}
    }
}
// getAllUserVideos: Retrieves videos linked to a specific workspace or folder ID, along with associated folder and user details. Returns a list of videos ordered by creation date
// or an error/status message if none are found.
export async function getAllUserVideos(workSpaceId:string){
    try{
        const user=await currentUser();
        if(!user)return {status:404}
        const videos=await client.video.findMany({
            where:{
                OR:[{workSpaceId},{folderId:workSpaceId}]
            },
            select:{
                id:true,
                title:true,
                createdAt:true,
                source:true,
                processing:true,
                Folder:{
                    select:{
                        id:true,
                        name:true
                    }
                },
                User:{
                    select:{
                        firstname:true,
                        lastname:true,
                        image:true
                    }
                }
            },
            orderBy:{
                createdAt:'desc'
            }
        })
        if(videos && videos.length>0){
            return {status:200,data:videos}
        }
        return {status:404,msg:"no videos found"}

    }
    catch(e){
        return {status:400,msg:'some error occured in finding user videos'}
    }
}
// getWorkSpaces: Fetches all workspaces associated with the current user, including their subscription details and memberships. Returns the workspace data
// if found or an appropriate error/status code
export const getWorkSpaces = async () => {
    try {
      const user = await currentUser()
  
      if (!user) return { status: 404 }
  
      const workspaces = await client.user.findUnique({
        where: {
          clerkid: user.id,
        },
        select: {
          subscription: {
            select: {
              plan: true,
            },
          },
          workspace: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          members: {
            select: {
              WorkSpace: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                },
              },
            },
          },
        },
      })
  
      if (workspaces) {
        return { status: 200, data: workspaces }
      }
    } catch (error) {
      return { status: 400 }
    }
  }
  

  export async function CreateWorkspace(){
    
  }