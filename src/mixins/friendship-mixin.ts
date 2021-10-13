import {
  log,
}                       from '../config.js'
import type {
  FriendshipAddOptions,
  FriendshipPayload,
  FriendshipSearchQueryFilter,
}                                 from '../schemas/friendship.js'

import type { cacheMixin } from './cache-mixin.js'

type CacheMixin = ReturnType<typeof cacheMixin>

const friendshipMixin = <TBase extends CacheMixin>(Base: TBase) => {

  abstract class FriendshipMixin extends Base {

    constructor (...args: any[]) {
      super(...args)
    }

    /**
     *
     * Friendship
     *
     */
    abstract friendshipAccept (friendshipId: string)           : Promise<void>
    abstract friendshipAdd (contactId: string, option?: FriendshipAddOptions) : Promise<void>

    abstract friendshipSearchPhone (phone: string)   : Promise<null | string>
    abstract friendshipSearchWeixin (weixin: string) : Promise<null | string>

    protected abstract friendshipRawPayload (friendshipId: string)  : Promise<any>
    protected abstract friendshipRawPayloadParser (rawPayload: any) : Promise<FriendshipPayload>

    async friendshipSearch (
      searchQueryFilter: FriendshipSearchQueryFilter,
    ): Promise<string | null> {
      log.verbose('Puppet', 'friendshipSearch("%s")', JSON.stringify(searchQueryFilter))

      if (Object.keys(searchQueryFilter).length !== 1) {
        throw new Error('searchQueryFilter should only include one key for query!')
      }

      if (searchQueryFilter.phone) {
        return this.friendshipSearchPhone(searchQueryFilter.phone)
      } else if (searchQueryFilter.weixin) {
        return this.friendshipSearchWeixin(searchQueryFilter.weixin)
      }

      throw new Error(`unknown key from searchQueryFilter: ${Object.keys(searchQueryFilter).join('')}`)
    }

    protected friendshipPayloadCache (friendshipId: string): undefined | FriendshipPayload {
      log.silly('Puppet', 'friendshipPayloadCache(id=%s) @ %s', friendshipId, this)

      if (!friendshipId) {
        throw new Error('no id')
      }
      const cachedPayload = this.cache.friendship.get(friendshipId)

      if (cachedPayload) {
        // log.silly('Puppet', 'friendshipPayloadCache(%s) cache HIT', friendshipId)
      } else {
        log.silly('Puppet', 'friendshipPayloadCache(%s) cache MISS', friendshipId)
      }

      return cachedPayload
    }

    /**
      * Get & Set
      */
    async friendshipPayload (friendshipId: string)                                : Promise<FriendshipPayload>
    async friendshipPayload (friendshipId: string, newPayload: FriendshipPayload) : Promise<void>

    async friendshipPayload (
      friendshipId : string,
      newPayload?  : FriendshipPayload,
    ): Promise<void | FriendshipPayload> {
      log.verbose('Puppet', 'friendshipPayload(%s)',
        friendshipId,
        newPayload
          ? ',' + JSON.stringify(newPayload)
          : '',
      )

      if (typeof newPayload === 'object') {
        await this.cache.friendship.set(friendshipId, newPayload)
        return
      }

      /**
        * 1. Try to get from cache first
        */
      const cachedPayload = this.friendshipPayloadCache(friendshipId)
      if (cachedPayload) {
        return cachedPayload
      }

      /**
        * 2. Cache not found
        */
      const rawPayload = await this.friendshipRawPayload(friendshipId)
      const payload    = await this.friendshipRawPayloadParser(rawPayload)

      this.cache.friendship.set(friendshipId, payload)

      return payload
    }

  }

  return FriendshipMixin
}

export { friendshipMixin }
