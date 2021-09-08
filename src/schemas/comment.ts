export interface CommentPayload {
  id?       : string,
  content   : string,
  creatorId : string,
  messageId : string,
  replyId?  : string, // replied comment id
}
