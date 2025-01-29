'use server'

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server"
import nodemailer from 'nodemailer'
import Stripe from 'stripe'
// create a new stripe object
const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET as string)



export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  })

  const mailOptions = {
    to,
    subject,
    text,
    html,
  }
  return { transporter, mailOptions }
}


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
       console.log(e);
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
      console.log(e)
        return {status:400,data:[]}

    }
}
// function used to search workspaces related to query 
export async function searchUsers(query:string){
    try{
            const user=await currentUser();
            if(!user)return {status:404}
// The query retrieves a list of users (workspace) from the database using client.user.findMany.
// It searches for users whose firstname, email, or lastname contains the query string (case-insensitive) 
//while excluding the user with the provided clerkid. The results include selected fields: id, firstname, lastname
//, image, email, and their subscription plan.
            const users=await client.user.findMany({
                where:{
                    OR:[
                        {firstname:{contains:query}},
                        {email:{contains:query}},
                        {lastname:{contains:query}}
                    ],
                    NOT:[{clerkid:user.id}]
                },
                select:{
                    id:true,
                    subscription:{
                        select:{
                            plan:true
                        }
                    },
                    firstname:true,
                    lastname:true,
                    image:true,
                    email:true
                }
            })
            if(users && users.length>0){
                return {status:200,data:users}
            }
            return {status:404,data:undefined}
    }
    catch(e){
      console.log(e)
        return {status:500,data:undefined}
    }
}

// get the payment information of the user
export async function getPaymentInfo(){
    try {
        const user = await currentUser()
        if (!user) return { status: 404 }
    
        const payment = await client.user.findUnique({
          where: {
            clerkid: user.id,
          },
          select: {
            subscription: {
              select: { plan: true },
            },
          },
        })
        if (payment) {
          return { status: 200, data: payment }
        }
      } catch (error) {
        console.log(error);
        return { status: 400 }
      }
}

// function to see if the firstView button of thee user is enabled or not
export const getFirstView = async () => {
    try {
      const user = await currentUser()
      if (!user) return { status: 404 }
      const userData = await client.user.findUnique({
        where: {
          clerkid: user.id,
        },
        select: {
          firstView: true,
        },
      })
      if (userData) {
        return { status: 200, data: userData.firstView }
      }
      return { status: 400, data: false }
    } catch (error) {
      console.log(error);
      return { status: 400 }
    }
  }

  // function to change the first view as the button changes
  export const enableFirstView = async (state: boolean) => {
    try {
      const user = await currentUser()
  
      if (!user) return { status: 404 }
  
      const view = await client.user.update({
        where: {
          clerkid: user.id,
        },
        data: {
          firstView: state,
        },
      })
  
      if (view) {
        return { status: 200, data: 'Setting updated' }
      }
    } catch (error) {
      console.log(error);
      return { status: 400 }
    }
  }
// function used to comment as well as do a reply
  export const createCommentAndReply = async (
    userId: string,
    comment: string,
    videoId: string,
    commentId?: string | undefined
  ) => {
    try {
        // if you are sending reply to a comment
      if (commentId) {
        const reply = await client.comment.update({
          where: {
            id: commentId,
          },
          data: {
            reply: {
              create: {
                comment,
                userId,
                videoId,
              },
            },
          },
        })
        if (reply) {
          return { status: 200, data: 'Reply posted' }
        }
      }
//   if you are making a new comment
      const newComment = await client.video.update({
        where: {
          id: videoId,
        },
        data: {
          Comment: {
            create: {
              comment,
              userId,
            },
          },
        },
      })
      if (newComment) return { status: 200, data: 'New comment added' }
    } catch (error) {
      console.log(error);
      return { status: 400 }
    }
  }

  export const getUserProfile = async () => {
    try {
      const user = await currentUser()
      if (!user) return { status: 404 }
      const profileIdAndImage = await client.user.findUnique({
        where: {
          clerkid: user.id,
        },
        select: {
          image: true,
          id: true,
        },
      })
  
      if (profileIdAndImage) return { status: 200, data: profileIdAndImage }
     
    } catch (error) {
      console.log(error);
      return { status: 400 }
    }
  }
  export const getVideoComments = async (Id: string) => {
    try {
      // Query the database for comments related to the given videoId or commentId
      const comments = await client.comment.findMany({
        where: {
          OR: [{ videoId: Id }, { commentId: Id }], // Match either videoId or commentId
          commentId: null, // Ensure only top-level comments are retrieved
        },
        include: {
          reply: {
            include: {
              User: true, // Include user information for each reply
            },
          },
          User: true, // Include user information for each comment
        },
      })
  
      
      return { status: 200, data: comments }
    } catch (error) {
      console.log(error);
      return { status: 400 }
    }
  }
// Inviting other members to the workspace
  export const inviteMembers = async (
    workspaceId: string,
    recieverId: string,
    email: string
  ) => {
    try {
      const user = await currentUser()
      if (!user) return { status: 404 }
      // Find the sender's information
      const senderInfo = await client.user.findUnique({
        where: {
          clerkid: user.id,
        },
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      })
      // Check if the sender exists
      if (senderInfo?.id) {
        // Check if the recipient exists
        const workspace = await client.workSpace.findUnique({
          where: {
            id: workspaceId,
          },
          select: {
            name: true,
          },
        })
        // Check if the workspace exists
        if (workspace) {
          // Create an invitation for the recipient
          const invitation = await client.invite.create({
            data: {
              senderId: senderInfo.id,
              recieverId,
              workSpaceId: workspaceId,
              content: `You are invited to join ${workspace.name} Workspace, click accept to confirm`,
            },
            select: {
              id: true,
            },
          })
  // Update the recipient's notification
          await client.user.update({
            where: {
              clerkid: user.id,
            },
            data: {
              notification: {
                create: {
                  content: `${user.firstName} ${user.lastName} invited ${senderInfo.firstname} into ${workspace.name}`,
                },
              },
            },
          })
        
          if (invitation) {
            // Send an email to the recipient
            const { transporter, mailOptions } = await sendEmail(
              email,
              'You got an invitation',
              'You are invited to join ${workspace.name} Workspace, click accept to confirm',
              `<a href="${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}" style="background-color: #000; padding: 5px 10px; border-radius: 10px;">Accept Invite</a>`
            )
            // Send the email
  
            transporter.sendMail(mailOptions, (error) => {
              if (error) {
                console.log(error);
                console.log('🔴', error.message)
              } else {
                console.log('✅ Email send')
              }
            })
            return { status: 200, data: 'Invite sent' }
          }
          return { status: 400, data: 'invitation failed' }
        }
        return { status: 404, data: 'workspace not found' }
      }
      return { status: 404, data: 'recipient not found' }
    } catch (error) {
      console.log(error)
      return { status: 400, data: 'something went wrong' }
    }
  }

  // function to accept the invite
  export const acceptInvite = async (inviteId: string) => {
    try {
      // Get the current user
      const user = await currentUser()
      if (!user)
        return {
          status: 404,
        }
        // Find the invitation using the inviteId and the user's clerkid to ensure the user is the recipient of the invite 
      const invitation = await client.invite.findUnique({
        where: {
          id: inviteId,
        },
        select: {
          workSpaceId: true,
          reciever: {
            select: {
              clerkid: true,
            },
          },
        },
      })
  // Check if the user is the recipient of the invite
      if (user.id !== invitation?.reciever?.clerkid) return { status: 401 }
      // Update the invite to show that it has been accepted
      const acceptInvite = client.invite.update({
        where: {
          id: inviteId,
        },
        data: {
          accepted: true,
        },
      })
      // Update the user's workspace to include the new member
  
      const updateMember = client.user.update({
        where: {
          clerkid: user.id,
        },
        data: {
          members: {
            create: {
              workSpaceId: invitation.workSpaceId,
            },
          },
        },
      })
  
      // Perform a transaction to update the invite and the user's workspace
      // used transaction to ensure that both the invite and the user's workspace are updated
      // prevents the race condition
      const membersTransaction = await client.$transaction([
        acceptInvite,
        updateMember,
      ])
  // Check if the transaction was successful
      if (membersTransaction) {
        return { status: 200 }
      }
      return { status: 400 }
    } catch (error) {
      console.log(error)
      return { status: 400 }
    }
  }


  export const completeSubscription = async (session_id: string) => {
    try {
      const user = await currentUser()
      if (!user) return { status: 404 }
  
      const session = await stripe.checkout.sessions.retrieve(session_id)
      if (session) {
        const customer = await client.user.update({
          where: {
            clerkid: user.id,
          },
          data: {
            subscription: {
              update: {
                data: {
                  customerId: session.customer as string,
                  plan: 'PRO',
                },
              },
            },
          },
        })
        if (customer) {
          return { status: 200 }
        }
      }
      return { status: 404 }
    } catch (error) {
      console.log(error);
      return { status: 400 }
    }
  }