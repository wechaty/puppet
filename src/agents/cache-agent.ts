import type {
  Options as QuickLruOptions,
}                               from '@alloc/quick-lru'
import QuickLru                 from '@alloc/quick-lru'

import {
  envVars,
  log,
}                         from '../config.js'
import type {
  ContactPayload,
}                         from '../schemas/contact.js'
import type {
  FriendshipPayload,
}                         from '../schemas/friendship.js'
import type {
  MessagePayload,
}                         from '../schemas/message.js'
import type {
  RoomMemberPayload,
  RoomPayload,
}                         from '../schemas/room.js'
import type {
  RoomInvitationPayload,
}                         from '../schemas/room-invitation.js'
import type {
  PuppetOptions,
}                         from '../schemas/puppet.js'

type PayloadCacheOptions = Required<PuppetOptions>['cache']

class CacheAgent {

  readonly contact        : QuickLru<string, ContactPayload>
  readonly friendship     : QuickLru<string, FriendshipPayload>
  readonly message        : QuickLru<string, MessagePayload>
  readonly room           : QuickLru<string, RoomPayload>
  readonly roomInvitation : QuickLru<string, RoomInvitationPayload>
  readonly roomMember     : QuickLru<string, RoomMemberPayload>

  constructor (
    protected options?: PayloadCacheOptions,
  ) {
    log.verbose('CacheAgent', 'constructor(%s)',
      options
        ? JSON.stringify(options)
        : '',
    )

    /**
     * Setup LRU Caches
     */
    const lruOptions = (maxSize = 100): QuickLruOptions<any, any> => ({
      maxAge: 15 * 60 * 1000 * 1000, // 15 minutes
      maxSize: maxSize,
    })

    this.contact = new QuickLru<string, ContactPayload>(lruOptions(
      envVars.WECHATY_PUPPET_LRU_CACHE_SIZE_CONTACT(options?.contact)),
    )
    this.friendship = new QuickLru<string, FriendshipPayload>(lruOptions(
      envVars.WECHATY_PUPPET_LRU_CACHE_SIZE_FRIENDSHIP(options?.friendship)),
    )
    this.message = new QuickLru<string, MessagePayload>(lruOptions(
      envVars.WECHATY_PUPPET_LRU_CACHE_SIZE_MESSAGE(options?.message)),
    )
    this.roomInvitation = new QuickLru<string, RoomInvitationPayload>(lruOptions(
      envVars.WECHATY_PUPPET_LRU_CACHE_SIZE_ROOM_INVITATION(options?.roomInvitation)),
    )
    this.roomMember = new QuickLru<string, RoomMemberPayload>(lruOptions(
      envVars.WECHATY_PUPPET_LRU_CACHE_SIZE_ROOM_MEMBER(options?.roomMember)),
    )
    this.room = new QuickLru<string, RoomPayload>(lruOptions(
      envVars.WECHATY_PUPPET_LRU_CACHE_SIZE_ROOM(options?.room)),
    )

  }

  start (): void {
    log.verbose('CacheAgent', 'start()')
    this.clear()
  }

  stop (): void {
    log.verbose('CacheAgent', 'stop()')
    this.clear()
  }

  /**
   * FIXME: Huan(202008) clear cache when stop
   *  keep the cache as a temp workaround since wechaty-puppet-service has reconnect issue
   *  with un-cleared cache in wechaty-puppet will make the reconnect recoverable
   *
   * Related issue: https://github.com/wechaty/wechaty-puppet-service/issues/31
   *
   * Update:
   *  Huan(2021-08-28): clear the cache when stop
   */
  clear (): void {
    log.verbose('CacheAgent', 'clear()')

    this.contact.clear()
    this.friendship.clear()
    this.message.clear()
    this.room.clear()
    this.roomInvitation.clear()
    this.roomMember.clear()
  }

  /**
   * Concat roomId & contactId to one string
   */
  roomMemberId (
    roomId   : string,
    memberId : string,
  ): string {
    return roomId + '-' + memberId
  }

}

export type { PayloadCacheOptions }
export { CacheAgent }
