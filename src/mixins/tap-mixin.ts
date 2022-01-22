import {
  log,
}                       from '../config.js'

import type {
  TapPayload,
  TapSearchOptions,
  TapType,
}                                 from '../schemas/tap.js'

import type { PuppetSkeleton }    from '../puppet/puppet-skeleton.js'

import type { CacheMixin }        from './cache-mixin.js'
import type {
  PaginationRequest,
  PaginationResponse,
}                           from '../schemas/pagination.js'

const tapMixin = <MinxinBase extends typeof PuppetSkeleton & CacheMixin>(baseMixin: MinxinBase) => {

  abstract class TapMixin extends baseMixin {

    constructor (...args: any[]) {
      super(...args)
      log.verbose('TapMixin', 'constructor()')
    }

    /**
     * Query whether the bot has tapped the post (any types).
     */
    abstract tap (postId: string): Promise<boolean>
    /**
     * Query whether the bot has tapped the post with `type`
     */
    abstract tap (postId: string, type?: TapType): Promise<boolean>
    /**
     * Update the `postId` tapped with `type` by the bot
     */
    abstract tap (postId: string, type: TapType, tap: boolean): Promise<void>

    abstract tap (
      postId : string,
      type?  : TapType,
      tap?   : boolean,
    ): Promise<void | boolean>

    /**
     * Search for taps for a post
     *
     * @param options
     * @param pagination
     */
    abstract tapSearch (
      postId      : string,
      options?    : TapSearchOptions,
      pagination? : PaginationRequest,
    ): Promise<PaginationResponse<TapPayload>>

  }

  return TapMixin
}

type TapMixin = ReturnType<typeof tapMixin>

type ProtectedPropertyTapMixin = never

export type {
  TapMixin,
  ProtectedPropertyTapMixin,
}
export { tapMixin }
