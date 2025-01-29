'use client'
import CommentForm from '@/components/forms/comment-form'
import { TabsContent } from '@/components/ui/tabs'
import React from 'react'
import CommentCard from '../comment-card'
import { useQueryData } from '@/hooks/useQueryData'
import { getVideoComments } from '@/actions/user'
import { VideoCommentProps } from '@/types/index.type'


type Props={
   author:string 
   videoId:string 
}

export default function Activities({author,videoId}:Props){
// get the complete details about the comments as well as the reply of the videos
    const { data } = useQueryData(['video-comments'], () =>
        getVideoComments(videoId)
      )
    // assign types to them
      const { data: comments } = data as VideoCommentProps
    return (
        <TabsContent value="Activity" className="rounded-xl flex flex-col gap-y-5">
            {/* form where users can comment to a video. we have not given commentId so users cannot reply to a comment using this form*/}
            <CommentForm author={author} videoId={videoId} />
            {comments?.map((comment) => (
        <CommentCard
          comment={comment.comment}
          key={comment.id}
          author={{
            image: comment.User?.image || '',
            firstname: comment.User?.firstname || 'sudhanshu',
            lastname: comment.User?.lastname || 'pandey',
          }}
          videoId={videoId}
          reply={comment.reply}
          commentId={comment.id}
          createdAt={comment.createdAt}
        />
      ))}

        </TabsContent>
    )
}