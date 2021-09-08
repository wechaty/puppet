/**
 * weixin VideoPost(Channels) introduction, see: https://wechatwiki.com/wechat-resources/wechat-channels-short-video-feature-complete-guide/
 */
export interface VideoPostPayload {
  authorId?: string,
  coverageUrl?: string,
  title: string,
  videoUrl: string,
}
