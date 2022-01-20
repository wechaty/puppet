import type {
  SayablePayload,
  sayableTypes,
}                             from './sayable.js'

/**
 * Huan(202201): Recursive type references
 *  @link https://github.com/microsoft/TypeScript/pull/33050#issuecomment-1002455128
 *
 * The same as `createAction(sayableTypes.Post, payloadPost)()`
 *  but reference the `PostPayload` in interface directly
 *  to prevent the ts(2502) error
 */
 interface SayablePayloadPost {
  type: typeof sayableTypes.Post
  // eslint-disable-next-line no-use-before-define
  payload: PostPayload
}

/**
 * Issue #2245 - https://github.com/wechaty/wechaty/issues/2245
 *
 * There have three types of a Post:
 *
 *  1. Original (原创)
 *  2. Reply    (评论, comment)
 *  3. RePost   (转发, retweet)
 *
 *  | Type     | Root ID  | Parent ID  |
 *  | ---------| -------- | ---------- |
 *  | Original | n/a      | n/a        |
 *  | Reply    | `rootId` | `parentId` |
 *  | Repost   | n/a      | `parentId` |
 *
 */
interface PostPayloadBase {
  parentId? : string  // `undefined` means it's original
  rootId?   : string  // `undefined` means it's not a reply (original or repost)
}

interface PostPayloadClient extends PostPayloadBase {
  id?: undefined
  /**
   * Recursive type references
   * @link https://github.com/microsoft/TypeScript/pull/33050#issuecomment-1002455128
   */
  sayableList: SayablePayload[]
}

interface PostPayloadServer extends PostPayloadBase {
  id: string
  sayableList: string[]  // The message id(s) for this post.

  contactId: string
  timestamp: number

  descendantNum : number
  tapNum        : number

  // The tap(i.e., liker) information need to be fetched from another API
}

type PostPayload =
  | PostPayloadClient
  | PostPayloadServer

const isPostPayloadClient = (payload: PostPayload): payload is PostPayloadClient =>
  payload instanceof Object
    && !payload.id
    && Array.isArray(payload.sayableList)
    && payload.sayableList.length > 0
    && payload.sayableList[0] instanceof Object
    && typeof payload.sayableList[0].type !== 'undefined'

const isPostPayloadServer = (payload: PostPayload): payload is PostPayloadServer =>
  payload instanceof Object
    && !!payload.id
    && Array.isArray(payload.sayableList)
    && payload.sayableList.length > 0
    && typeof payload.sayableList[0] === 'string'

/**
 * Huan(202201): This enum type value MUST be keep unchanged across versions
 *  because the puppet service client/server might has different versions of the puppet
 */
enum PostTapType {
  Unspecified = 0,
  Like        = 1,
}

type PostTapListPayload = {
  [key in PostTapType]?: {
    contactId: string[]
    timestamp: number[]
  }
}

export {
  isPostPayloadClient,
  isPostPayloadServer,
  PostTapType,
  type SayablePayloadPost,
  type PostPayload,
  type PostPayloadClient,
  type PostPayloadServer,
  type PostTapListPayload,
}
