import { log }  from '../config.js'

import type {
  PuppetOptions,
  EventDirtyPayload,
}                               from '../schemas/mod.js'
import { PayloadType }          from '../schemas/mod.js'

import { CacheAgent }           from '../agents/mod.js'

import type { PuppetSkelton }   from '../puppet/mod.js'

const cacheMixin = <MixinBase extends typeof PuppetSkelton>(mixinBase: MixinBase) => {

  abstract class CacheMixin extends mixinBase {

    cache: CacheAgent

    cacheMixinCleanCallbackList: Function[]

    constructor (...args: any[]) {
      super(...args)
      log.verbose('PuppetCacheMixin', 'constructor(%s)',
        args[0]?.cache
          ? '{ cache: ' + JSON.stringify(args[0].cache) + ' }'
          : '',
      )

      const options: PuppetOptions = args[0] || {}

      this.cacheMixinCleanCallbackList = []
      this.cache = new CacheAgent(options.cache)
    }

    override async start (): Promise<void> {
      log.verbose('PuppetCacheMixin', 'start()')
      await super.start()
      this.cache.start()

      const onDirty = (payload: EventDirtyPayload) => this.onDirty(payload)
      this.on('dirty', onDirty)
      log.verbose('PuppetCacheMixin', 'start() event "dirty" listener added')

      const cleanFn = () => {
        this.off('dirty', onDirty)
        log.verbose('PuppetCacheMixin', 'start() event "dirty" listener removed')
      }
      this.cacheMixinCleanCallbackList.push(cleanFn)
    }

    override async stop (): Promise<void> {
      log.verbose('PuppetCacheMixin', 'stop()')
      this.cache.stop()

      while (this.cacheMixinCleanCallbackList.length) {
        const fn = this.cacheMixinCleanCallbackList.shift()
        if (fn) {
          fn()
        }
      }

      await super.stop()
    }

    /**
     * dirty payload methods
     *  @see https://github.com/wechaty/grpc/pull/79
     */
    async dirtyPayload (
      type: PayloadType,
      id: string,
    ): Promise<void> {
      log.verbose('Puppet', 'dirtyPayload(%s<%s>, %s)', PayloadType[type], type, id)
      this.emit('dirty', {
        payloadId   : id,
        payloadType : type,
      })
    }

    async onDirty ({ payloadType, payloadId }: EventDirtyPayload) {
      switch (payloadType) {
        case PayloadType.Message:
          this.cache.message.delete(payloadId)
          break
        case PayloadType.Contact:
          this.cache.contact.delete(payloadId)
          break
        case PayloadType.Room:
          this.cache.room.delete(payloadId)
          break
        case PayloadType.RoomMember: {
          const contactIdList = await this.roomMemberList(payloadId)

          for (const contactId of contactIdList) {
            const cacheKey = this.cache.roomMemberId(payloadId, contactId)
            this.cache.roomMember.delete(cacheKey)
          }

          break
        }
        case PayloadType.Friendship:
          this.cache.friendship.delete(payloadId)
          break

        default:
          throw new Error('unknown payload type: ' + payloadType)
      }

    }

  }

  return CacheMixin
}

type CacheMixin = ReturnType<typeof cacheMixin>

type ProtectedPropertyCacheMixin =
  | 'cache'
  | 'onDirty'

export type {
  CacheMixin,
  ProtectedPropertyCacheMixin,
}
export { cacheMixin }
