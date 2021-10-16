import {
  log,
}           from '../config.js'

import type { PuppetOptions }   from '../schemas/puppet.js'
import { CacheAgent }           from '../agents/mod.js'

import type { PuppetSkelton } from '../puppet/skelton.js'
import { PayloadType } from '../mod.js'

const cacheMixin = <MixinBase extends typeof PuppetSkelton>(mixinBase: MixinBase) => {

  abstract class CacheMixin extends mixinBase {

    cache: CacheAgent

    constructor (...args: any[]) {
      super(...args)
      log.verbose('PuppetCacheMixin', 'constructor("%s")', JSON.stringify(args))

      const options: PuppetOptions = args[0] || {}

      this.cache = new CacheAgent(options.cache)
    }

    override async start (): Promise<void> {
      log.verbose('PuppetCacheMixin', 'start()')
      await super.start()
      this.cache.start()
    }

    override async stop (): Promise<void> {
      log.verbose('PuppetCacheMixin', 'stop()')
      this.cache.stop()
      await super.stop()
    }

    /**
     * dirty payload methods
     *  @see https://github.com/wechaty/grpc/pull/79
     */
    async dirtyPayload (type: PayloadType, id: string): Promise<void> {
      log.verbose('Puppet', 'dirtyPayload(%s<%s>, %s)', PayloadType[type], type, id)

      switch (type) {
        case PayloadType.Message:
          this.cache.message.delete(id)
          break
        case PayloadType.Contact:
          this.cache.contact.delete(id)
          break
        case PayloadType.Room:
          this.cache.room.delete(id)
          break
        case PayloadType.RoomMember:
          const contactIdList = await this.roomMemberList(id)

          for (let contactId of contactIdList) {
            const cacheKey = this.cache.roomMemberId(id, contactId)
            this.cache.roomMember.delete(cacheKey)
          }

          break
        case PayloadType.Friendship:
          this.cache.friendship.delete(id)
          break

        default:
          throw new Error('unknown payload type: ' + type)
      }

      /**
       * Propagate the dirty event to the puppet
       */
      this.emit('dirty', {
        payloadId   : id,
        payloadType : type,
      })
    }

  }

  return CacheMixin
}

type CacheMixin = ReturnType<typeof cacheMixin>

type ProtectedPropertyCacheMixin = never
  | 'cache'

export type {
  CacheMixin,
  ProtectedPropertyCacheMixin,
}
export { cacheMixin }
