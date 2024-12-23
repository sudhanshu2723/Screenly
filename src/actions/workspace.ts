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
  
// function used to create new workspace for the user
  export async function CreateWorkspace(name:string){
    try{
      const user=await currentUser();
      if(!user)return {status:404}
      const authorized=await client.user.findUnique({
        where:{
          clerkid:user.id 
        },
        select:{
          subscription:{
            select:{
              plan:true 
            }
          }
        }
      })
      // if the user is in a PRO plan allow him to create new workspaces
      if(authorized?.subscription?.plan==='PRO'){
          const workspace=await client.user.update({
            where:{
              clerkid:user.id 
            },
            data:{
              workspace:{
                create:{
                  name,
                  type:'PUBLIC'
                }
              }
            }
          })
          if(workspace){
            return {status:201,data:'Workspace Created'}
          }
      }
      return {
        status:401,
        data:'You are not authorized to create a workspace.'
      }
    }
    catch(e){
      return {
        status:400
      }
    }
  }


  export async function renameFolders(folderId:string,name:string){
      try{
          const folder=await client.folder.update({
            where:{
              id:folderId
            },
            data:{
              name
            }
          })
          if(folder){return {status:200,data:'Folder Renamed'} }
          return {status:400,data:'Folder does not exist'}
        }
      catch(e){
         return {status:500,data:'Something went wrong'}
      }
  }

  export async function CreateFolders(workSpaceId:string){
      try{
          const isNewFolders=await client.workSpace.update({
            where:{
              id:workSpaceId
            },
            data:{
              folders:{
                create:{name:"Untitled"}
              }
            }
          })
          if(isNewFolders){
            return {status:200 ,message:"New Folder Created"}
          }
      }
      catch(e){
          return {status:500,message:"Something went wrong"}
      }
  }

  export async function getFolderInfo(folderId:string){
    try{
        const folder=await client.folder.findUnique({
          where:{
            id:folderId
          },
          select:{
            name:true,
            _count:{
              select:{
                videos:true
              }
            }
          }
        })
        if(folder){
          return {status:200,data:folder}
        }
        return {status:400,data:null}
    }
    catch(e){
        return {status:500,data:null}
    }
  }

  export const moveVideoLocation = async (
    videoId: string,
    workSpaceId: string,
    folderId: string
  ) => {
    try {
      const location = await client.video.update({
        where: {
          id: videoId,
        },
        data: {
          folderId: folderId || null,
          workSpaceId,
        },
      })
      if (location) return { status: 200, data: 'folder changed successfully' }
      return { status: 404, data: 'workspace/folder not found' }
    } catch (error) {
      return { status: 500, data: 'Oops! something went wrong' }
    }
  }