import {
  log,
}                       from '../config.js'

import type {
  RoomInvitationPayload,
}                                 from '../schemas/room-invitation.js'

import type { cacheMixin } from './cache-mixin.js'

type CacheMixin = ReturnType<typeof cacheMixin>

const roomInvitationMixin = <TBase extends CacheMixin>(Base: TBase) => {

  abstract class RoomInvitationMixin extends Base {

    constructor (...args: any[]) {
      super(...args)
    }

    /**
     *
     * Room Invitation
     *
     */
    protected roomInvitationPayloadCache (
      roomInvitationId: string,
    ): undefined | RoomInvitationPayload {
      // log.silly('Puppet', 'roomInvitationPayloadCache(id=%s) @ %s', friendshipId, this)
      if (!roomInvitationId) {
        throw new Error('no id')
      }
      const cachedPayload = this.cache.roomInvitation.get(roomInvitationId)

      if (cachedPayload) {
        // log.silly('Puppet', 'roomInvitationPayloadCache(%s) cache HIT', roomInvitationId)
      } else {
        log.silly('Puppet', 'roomInvitationPayloadCache(%s) cache MISS', roomInvitationId)
      }

      return cachedPayload
    }

    abstract roomInvitationAccept (roomInvitationId: string): Promise<void>

    protected abstract roomInvitationRawPayload (roomInvitationId: string) : Promise<any>
    protected abstract roomInvitationRawPayloadParser (rawPayload: any)    : Promise<RoomInvitationPayload>

    /**
     * Get & Set
     */
    async roomInvitationPayload (roomInvitationId: string)                                    : Promise<RoomInvitationPayload>
    async roomInvitationPayload (roomInvitationId: string, newPayload: RoomInvitationPayload) : Promise<void>

    async roomInvitationPayload (roomInvitationId: string, newPayload?: RoomInvitationPayload): Promise<void | RoomInvitationPayload> {
      log.verbose('Puppet', 'roomInvitationPayload(%s)', roomInvitationId)

      if (typeof newPayload === 'object') {
        this.cache.roomInvitation.set(roomInvitationId, newPayload)
        return
      }

      /**
       * 1. Try to get from cache first
       */
      const cachedPayload = this.roomInvitationPayloadCache(roomInvitationId)
      if (cachedPayload) {
        return cachedPayload
      }

      /**
       * 2. Cache not found
       */

      const rawPayload = await this.roomInvitationRawPayload(roomInvitationId)
      const payload = await this.roomInvitationRawPayloadParser(rawPayload)

      return payload
    }

  }

  return RoomInvitationMixin
}

export { roomInvitationMixin }
