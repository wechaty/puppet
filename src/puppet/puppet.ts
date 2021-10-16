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
import {
  log,
}                       from '../config.js'

import type {
  PuppetOptions,
}                       from '../schemas/mod.js'

import {
  cacheMixin,
  contactMixin,
  friendshipMixin,
  loginMixin,
  memoryMixin,
  messageMixin,
  miscMixin,
  roomInvitationMixin,
  roomMemberMixin,
  roomMixin,
  stateMixin,
  tagMixin,
}                        from '../mixins/mod.js'

import { PuppetSkelton }    from './skelton.js'

/**
 * Huan(202110): use compose() to compose mixins
 */
// const MixinBase = compose(
//   messageMixin,
//   roomInvitationMixin,
//   ...,
//   PuppetSkelton,
// )

const MixinBase = miscMixin(
  messageMixin(
    roomInvitationMixin(
      tagMixin(
        friendshipMixin(
          roomMixin(
            roomMemberMixin(
              contactMixin(
                loginMixin(
                  memoryMixin(
                    cacheMixin(
                      stateMixin(
                        PuppetSkelton,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
)

/**
 *
 * Puppet Base Class
 *
 * See: https://github.com/wechaty/wechaty/wiki/Puppet
 *
 */
abstract class Puppet extends MixinBase {

  constructor (
    public options: PuppetOptions = {},
  ) {
    super(options)
    log.verbose('Puppet', 'constructor(%s) #%d', JSON.stringify(options), this.counter)
  }

  /**
   * The child puppet provider should put all start code inside `tryStart()`
   *  becasue the `start()` will call `tryStart()` with the state management.
   */
  abstract tryStart (): Promise<void>
  /**
   * The child puppet provider should put all start code inside `tryStop()`
   *  becasue the `stop()` will call `tryStop()` with the state management.
   */
  abstract tryStop  (): Promise<void>

  override async start () : Promise<void> {
    log.verbose('Puppet', 'start()')

    if (this.state.on()) {
      log.warn('Puppet', 'start() already on, skip')
      await this.state.ready()
      return
    }

    this.state.on('pending')

    try {
      /**
       * Call all the mixins start()
       */
      await super.start()
      /**
       * Call the child provider start()
       */
      await this.tryStart()

      /**
       * The puppet has been successfully started
       */
      this.state.on(true)

    } catch (e) {
      /**
       * The puppet has not been started
       */
      this.state.off(true)
      log.error('Puppet', 'start() rejection: %s', (e as Error).message)
      throw e
    }
  }

  override async stop (): Promise<void> {
    log.verbose('Puppet', 'stop()')

    if (this.state.off()) {
      log.warn('Puppet', 'stop() already off, skip')
      await this.state.ready()
      return
    }

    this.state.off('pending')

    try {
      /**
       * Call the child provider stop()
       */
      await this.tryStop()
      /**
       * Call all the mixins stop()
       */
      await super.stop()

      /**
       * The puppet has been successfully stopped
       */
      this.state.off(true)

    } catch (e) {
      /**
       * The puppet has not been stopped
       */
      log.error('Puppet', 'start() rejection: %s', (e as Error).message)
      throw e
    } finally {
      /**
       * Put the puppet into a stopped state
       *  no matter the `tryStop()` success or fail
       */
      this.state.off(true)
    }
  }

}

export {
  Puppet,
}
export default Puppet
