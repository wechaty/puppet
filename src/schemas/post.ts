import type {
  SayablePayload,
  sayableTypes,
}                             from './sayable.js'

/**
 * Huan(202201): numbers must be keep unchanged across versions
 */
enum PostType {
  Unspecified = 0,
  Moment  = 1,  // <- WeChat Moments (朋友圈)
  Channel = 2,  // <- WeChat Channel (视频号)
}

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
 * orderBy: Sort order - https://cloud.google.com/apis/design/design_patterns#list_pagination
 *  the order-by name should be exactly match the keys of the QueryFilter interface
 *
 * The rootId & parentId: when they are `undefined`, there have two cases:
 *
 *  1. `'rootId' in options === false`
 *    in this case, we do not filter `rootId` at all
 *
 *  2. `'rootId' in options === true`
 *    in this case, we filter `rootId` as `undefined`, which means that the post must be the root node
 *
 */
interface PostQueryFilter {
  contactId? : string
  orderBy?   : string
  parentId?  : string // two type of `undefined`: see above comments
  rootId?    : string // two type of `undefined`: see above comments
  type?      : PostType
}

export {
  isPostPayloadClient,
  isPostPayloadServer,
  PostType,
  type PostQueryFilter,
  type SayablePayloadPost,
  type PostPayload,
  type PostPayloadClient,
  type PostPayloadServer,
}
