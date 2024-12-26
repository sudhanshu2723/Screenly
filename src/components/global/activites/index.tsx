import CommentForm from "@/components/forms/comment-form"
import { TabsContent } from "@/components/ui/tabs"
import CommentCard from "../comment-card"


type Props={
   author:string 
   videoId:string 
}

export default function Activities({author,videoId}:Props){
    return (
        <TabsContent value="Activity" className="rounded-xl flex flex-col gap-y-5">
            {/* form where users can comment to a video. we have not given commentId so users cannot reply to a comment using this form*/}
            <CommentForm author={author} videoId={videoId} />
            <CommentCard/>

        </TabsContent>
    )
}