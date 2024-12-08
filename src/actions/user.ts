'use server'

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server"
//get the user from clerk
// if the user already exists return its personal workspace details
//if the user does not exists create the user and return its workspace and personal details
export const onAuthenticatedUser=async()=>{
     // check that after the authentication is complete the user exists
    try{
        // find the user from the clerk
        const user=await currentUser();
        if(!user){
           return {status:403}
        }
        // Check is a user with specific Clerkid is present and if it is present 
        // include the details of its workspace but only details of its personal workspace using nested 
        // conditions
        const userExists=await client.user.findUnique({
           where:{
               clerkid:user.id
           },
           include:{
            workspace:{
                where:{
                    User:{
                        clerkid:user.id
                    }
                }
            }
           }
        })
        if(userExists){
            return {status:200 ,user:userExists}
        }
        // if the user does not exists in the db already
        // create the user
        // default values of studio and subscription will be added
        // after creating the user get the details of its personal worksapce and subscription in newUser
        const newUser=await client.user.create({
            data:{
                clerkid:user.id,
                email:user.emailAddresses[0].emailAddress,
                firstname:user.firstName,
                lastname:user.lastName,
                image:user.imageUrl,
                studio:{
                    create:{}
                },
                subscription:{
                    create:{}
                },
                workspace:{
                    create:{
                        name:`${user.firstName}'s Workspace`,
                        type:"PERSONAL" 
                    }
                }
            },
            include:{
                workspace:{
                    where:{
                        User:{
                            clerkid:user.id
                        }
                    }
                },
                subscription:{
                    select:{
                        plan:true
                    }
                }
            }
        })
        if(newUser){
            return {status:200, user:newUser}
        }else{
            return {status:400}
        }
    }
    catch(e){
        return {status:500 , msg:"error in authentication "}
    }
}

export async function getNotifications() {
    try{
        const user=await currentUser();
        if(!user)return {status:404};
        const notifications=await client.user.findUnique({
            where:{
                clerkid:user.id
            },
            select:{
                notification:true,
                _count:{
                    select:{
                        notification:true
                    }
                }
            }
        })
        if(notifications && notifications.notification.length>0){
            return {status:200,data:notifications}
        }
        return {status:404,data:[]}
    }
    catch(e){
        return {status:400,data:[]}

    }
}