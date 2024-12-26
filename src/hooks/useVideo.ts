import { createCommentSchema } from "@/components/forms/comment-form/schema";
import { useMutationData } from "./useMutationData";
import { useQueryData } from "./useQueryData";
import useZodForm from "./useZodForm";
import { createCommentAndReply, getUserProfile } from "@/actions/user";



// hook used to handle the comments
export function useVideoComment(videoId:string,commentId?:string){
//    get the details of the user
    const {data}=useQueryData(['user-profile'],getUserProfile);
//  give types to the data
const {status,data:user}=data as {
    status:number 
    data:{id:string; image:string}
}
// add comments to the db as well as reply to comment
const {isPending,mutate}=useMutationData(['new-comment'],(data:{
    comment:string
})=>createCommentAndReply(user.id,data.comment,videoId,commentId),'video-comments',()=>reset());
// form validation
const {register,onFormSubmit,errors,reset}=useZodForm(createCommentSchema,mutate)

return {register,errors,onFormSubmit,isPending};
}