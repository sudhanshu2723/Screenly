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