/**
 *   Wechaty - https://github.com/wechaty/wechaty
 *
 *   @copyright 2016-2018 Huan LI <zixia@zixia.net>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import type { Constructor }     from 'clone-class'
import { Watchdog }             from 'watchdog'
import { StateSwitch }          from 'state-switch'
import { ThrottleQueue }        from 'rx-queue'
// import { callerResolve }  from 'hot-import'

// import normalize               from 'normalize-package-data'
// import readPkgUp               from 'read-pkg-up'

import {
  log,
  MemoryCard,
  NAME,
  VERSION,
}                       from './config.js'

import type {
  EventLoginPayload,
}                                 from './schemas/event.js'
import type {
  PuppetOptions,
}                                 from './schemas/puppet.js'
import { PayloadType }            from './schemas/payload.js'

import {
  PuppetEventEmitter,
}                                 from './events.js'

import { cacheMixin }           from './mixins/cache-mixin.js'
import { contactMixin }         from './mixins/contact-mixin.js'
import { friendshipMixin }      from './mixins/friendship-mixin.js'
import { messageMixin }         from './mixins/message-mixin.js'
import { roomInvitationMixin }  from './mixins/room-invitation-mixin.js'
import { roomMixin }            from './mixins/room-mixin.js'
import { tagMixin }             from './mixins/tag-mixin.js'

const DEFAULT_WATCHDOG_TIMEOUT_SECONDS  = 60
let   PUPPET_COUNTER                    = 0

/**
 *
 * Puppet Base Class
 *
 * See: https://github.com/wechaty/wechaty/wiki/Puppet
 *
 */

const MixinBase = messageMixin(
  roomInvitationMixin(
    tagMixin(
      friendshipMixin(
        roomMixin(
          contactMixin(
            cacheMixin(
              PuppetEventEmitter,
            ),
          ),
        ),
      ),
    ),
  ),
)

abstract class Puppet extends MixinBase {

  /**
   * Must overwrite by child class to identify their version
   */
  static readonly VERSION = VERSION

  readonly state: StateSwitch

  protected readonly counter : number
  protected memory           : MemoryCard

  /**
   * Login-ed User ID
   *
   * FIXME: remove the override
   */
  protected override id?: string

  protected readonly watchdog : Watchdog

  /**
   * childPkg stores the `package.json` that the NPM module who extends the `Puppet`
   */
  // Huan(202108): Remove this property, because it the `hot-import` module is not a ESM compatible one
  // private readonly childPkg: normalize.Package

  /**
   * Throttle Reset Events
   */
  private resetThrottleQueue: ThrottleQueue<string>

  /**
   *
   *
   * Constructor
   *
   *
   */
  constructor (
    protected options: PuppetOptions = {},
  ) {
    super()

    this.counter = PUPPET_COUNTER++
    log.verbose('Puppet', 'constructor(%s) #%d', JSON.stringify(options), this.counter)

    this.state  = new StateSwitch(this.constructor.name, { log })

    this.memory = new MemoryCard() // dummy memory
    this.memory.load()  // load here is for testing only
      .then(() => undefined)
      .catch(e => log.warn('Puppet', 'constructor() memory.load() rejection: %s', e))

    /**
     * 1. Setup Watchdog
     *  puppet implementation class only need to do one thing:
     *  feed the watchdog by `this.emit('heartbeat', ...)`
     */
    const timeoutSeconds = this.options.timeoutSeconds || DEFAULT_WATCHDOG_TIMEOUT_SECONDS
    log.verbose('Puppet', 'constructor() watchdog timeout set to %d seconds', timeoutSeconds)
    this.watchdog = new Watchdog(1000 * timeoutSeconds, 'Puppet')

    /**
     * 2. Setup `reset` Event via a 1 second Throttle Queue:
     */
    this.resetThrottleQueue = new ThrottleQueue<string>(1000)
    this.resetThrottleQueue.subscribe(reason => {
      log.silly('Puppet', 'constructor() resetThrottleQueue.subscribe() reason: "%s"', reason)
      this.reset(reason)
    })

    {
      /* eslint  no-lone-blocks: off */
      // Huan(202108): remove this code block because it's unclear what it does

      /**
       * 4. Load the package.json for Puppet Plugin version range matching
       *
       * For: dist/src/puppet/puppet.ts
       *  We need to up 3 times: ../../../package.json
       */
      // try {
      //   const childClassPath = callerResolve('.', __filename)
      //   log.verbose('Puppet', 'constructor() childClassPath=%s', childClassPath)

      //   this.childPkg = readPkgUp.readPackageUpSync({ cwd: childClassPath })!.packageJson
      // } catch (e) {
      //   log.error('Puppet', 'constructor() %s', e)
      //   throw e
      // }

      // if (!this.childPkg) {
      //   throw new Error('Cannot found package.json for Puppet Plugin Module')
      // }

      // normalize(this.childPkg)
    }

    this.feedDog        = this.feedDog.bind(this)
    this.dogReset       = this.dogReset.bind(this)
    this.throttleReset  = this.throttleReset.bind(this)
  }

  override toString () {
    return [
      'Puppet#',
      this.counter,
      '<',
      this.constructor.name,
      '>',
      '(',
      this.memory.name || '',
      ')',
    ].join('')
  }

  /**
   * Unref
   */
  unref (): void {
    log.verbose('Puppet', 'unref()')
    this.watchdog.unref()
  }

  /**
   * @private
   *
   * For used by Wechaty internal ONLY.
   */
  setMemory (memory: MemoryCard): void {
    log.verbose('Puppet', 'setMemory()')

    if (this.memory.name) {
      throw new Error('puppet has already had a named memory: ' + this.memory.name)
    }

    this.memory = memory
  }

  /**
   *
   *
   * Start / Stop
   *
   *
   */
  async start () : Promise<void> {
    this.on('heartbeat', this.feedDog)
    this.watchdog.on('reset', this.dogReset)
    this.on('reset', this.throttleReset)

    this.cache.start()
  }

  async stop (): Promise<void> {
    this.removeListener('heartbeat', this.feedDog)
    this.watchdog.removeListener('reset', this.dogReset)
    this.removeListener('reset', this.throttleReset)

    this.watchdog.sleep()

    this.cache.stop()
  }

  private feedDog (payload: any) {
    this.watchdog.feed(payload)
  }

  private dogReset (lastFood: any) {
    log.warn('Puppet', 'dogReset() reason: %s', JSON.stringify(lastFood))
    this.emit('reset', lastFood)
  }

  private throttleReset (payload: any) {
    log.silly('Puppet', 'throttleReset() payload: "%s"', JSON.stringify(payload))
    // if (this.resetThrottleQueue) {
    this.resetThrottleQueue.next(payload.data)
    // } else {
    //   log.warn('Puppet', 'Drop reset since no resetThrottleQueue.')
    // }
  }

  /**
   * Huan(201808):
   *  reset() Should not be called directly.
   *  `protected` is for testing, not for the child class.
   *  should use `emit('reset', 'reason')` instead.
   *
   * Huan(202008): Update from protected to private
   */
  protected reset (reason: string): void {
    log.verbose('Puppet', 'reset(%s)', reason)

    /**
     * Huan(202003):
     *  do not care state.off()
     *  reset will cause the puppet to start (?)
     */
    // if (this.state.off()) {
    //   log.verbose('Puppet', 'reset(%s) state is off(), make the watchdog to sleep', reason)
    //   this.watchdog.sleep()
    //   return
    // }

    Promise.resolve()
      .then(() => this.stop())
      .then(() => this.start())
      .catch(e => {
        log.warn('Puppet', 'reset() exception: %s', e)
        this.emit('error', e)
      })
  }

  /**
   *
   *
   * Login / Logout
   *
   *
   */

  /**
   * Need to be called internally when the puppet is logined.
   * this method will emit a `login` event
   */
  protected async login (userId: string): Promise<void> {
    log.verbose('Puppet', 'login(%s)', userId)

    if (this.id) {
      throw new Error('must logout first before login again!')
    }

    this.id = userId
    // console.log('this.id=', this.id)

    const payload: EventLoginPayload = {
      contactId: userId,
    }

    this.emit('login', payload)
  }

  /**
   * Need to be called internally/externally when the puppet need to be logouted
   * this method will emit a `logout` event,
   *
   * Note: must set `this.id = undefined` in this function.
   */
  async logout (reason = 'logout()'): Promise<void> {
    log.verbose('Puppet', 'logout(%s)', this.id)

    if (!this.id) {
      throw new Error('must login first before logout!')
    }

    this.emit('logout', {
      contactId : this.id,
      data      : reason,
    })

    this.id = undefined
  }

  selfId (): string {
    log.verbose('Puppet', 'selfId()')

    if (!this.id) {
      throw new Error('not logged in, no this.id yet.')
    }

    return this.id
  }

  logonoff (): boolean {
    if (this.id) {
      return true
    } else {
      return false
    }
  }

  /**
   *
   *
   * Misc
   *
   *
   */
  /**
   * Check whether the puppet is work property.
   * @returns `false` if something went wrong
   *          'dong' if everything is OK
   */
  abstract ding (data?: string) : void

  /**
   * Get the NPM name of the Puppet
   */
  name (): string {
    return NAME
  }

  /**
   * Get version from the Puppet Implementation
   */
  version (): string {
    return VERSION
  }

  /**
   * will be used by semver.satisfied(version, range)
   */
  wechatyVersionRange (strict = false): string {
    // FIXME: for development, we use `*` if not set
    if (strict) {
      return '^0.16.0'
    }

    return '*'

    // TODO: test and uncomment the following codes after promote the `wehcaty-puppet` as a solo NPM module

    // if (this.pkg.dependencies && this.pkg.dependencies.wechaty) {
    //   throw new Error('Wechaty Puppet Implementation should add `wechaty` from `dependencies` to `peerDependencies` in package.json')
    // }

    // if (!this.pkg.peerDependencies || !this.pkg.peerDependencies.wechaty) {
    //   throw new Error('Wechaty Puppet Implementation should add `wechaty` to `peerDependencies`')
    // }

    // if (!this.pkg.engines || !this.pkg.engines.wechaty) {
    //   throw new Error('Wechaty Puppet Implementation must define `package.engines.wechaty` for a required Version Range')
    // }

    // return this.pkg.engines.wechaty
  }

  /**
   *
   * dirty payload methods
   *  See: https://github.com/Chatie/grpc/pull/79
   *
   */

  async dirtyPayload (type: PayloadType, id: string): Promise<void> {
    log.verbose('Puppet', 'dirtyPayload(%s<%s>, %s)', PayloadType[type], type, id)

    switch (type) {
      case PayloadType.Message:
        return this.dirtyPayloadMessage(id)
      case PayloadType.Contact:
        return this.dirtyPayloadContact(id)
      case PayloadType.Room:
        return this.dirtyPayloadRoom(id)
      case PayloadType.RoomMember:
        return this.dirtyPayloadRoomMember(id)
      case PayloadType.Friendship:
        return this.dirtyPayloadFriendship(id)

      default:
        throw new Error('unknown payload type: ' + type)
    }
  }

  // private async dirtyPayloadContact (contactId: string): Promise<void> {
  //   log.verbose('Puppet', 'dirtyPayloadContact(%s)', contactId)
  //   this.payloadCache.contact.delete(contactId)
  // }

  private async dirtyPayloadFriendship (friendshipId: string): Promise<void> {
    log.verbose('Puppet', 'dirtyPayloadFriendship(%s)', friendshipId)
    this.cache.friendship.delete(friendshipId)
  }

  private async dirtyPayloadMessage (messageId: string): Promise<void> {
    log.verbose('Puppet', 'dirtyPayloadMessage(%s)', messageId)
    this.cache.message.delete(messageId)
  }

}

type PuppetImplementation = Constructor<Puppet>

export type {
  PuppetImplementation,
}
export {
  Puppet,
}
export default Puppet
