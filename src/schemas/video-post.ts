/**
 * weixin VideoPost(Channels) introduction, see: https://wechatwiki.com/wechat-resources/wechat-channels-short-video-feature-complete-guide/
 */
export interface VideoPostPayload {
  authorId?    : string,
  coverUrl? : string,
  title        : string,
  videoUrl     : string,
}
