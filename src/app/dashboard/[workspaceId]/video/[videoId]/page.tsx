
import { getUserProfile } from '@/actions/user'
import { getPreviewVideo } from '@/actions/workspace'
import VideoPreview from '@/components/global/videos/preview'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import React from 'react'

type Props = {
  params: {
    videoId: string
  }
}
// this component is used to load the videos
const VideoPage = async ({ params: { videoId } }: Props) => {
  const query = new QueryClient()
  await query.prefetchQuery({
    queryKey: ['preview-video'],
    queryFn: () => getPreviewVideo(videoId),
  })
 // prefetch query for user profile for comment
 await query.prefetchQuery({
  queryKey:['user-profile'],
  queryFn:getUserProfile
 })

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <VideoPreview videoId={videoId} />
    </HydrationBoundary>
  )
}

export default VideoPage
