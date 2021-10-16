import {
  Watchdog,
  WatchdogFood,
}                       from 'watchdog'

import type { PuppetSkelton } from '../puppet/skelton.js'
import type { StateMixin } from '../mixins/state-mixin.js'

import {
  log,
}           from '../config.js'

const DEFAULT_WATCHDOG_TIMEOUT_SECONDS  = 60

class WatchdogAgent {

  protected readonly watchdog : Watchdog

  private cleanCallbackList: Function[]

  constructor (
    protected readonly puppet: PuppetSkelton & InstanceType<StateMixin>,
  ) {
    log.verbose('WatchdogAgent', 'constructor(%s)', puppet)

    this.cleanCallbackList = []

    /**
     * 1. Setup Watchdog
     *  puppet implementation class only need to do one thing:
     *  feed the watchdog by `this.emit('heartbeat', ...)`
     */
    const timeoutSeconds = puppet.options.timeoutSeconds || DEFAULT_WATCHDOG_TIMEOUT_SECONDS
    log.verbose('WatchdogAgent', 'constructor() watchdog timeout set to %d seconds', timeoutSeconds)
    this.watchdog = new Watchdog(1000 * timeoutSeconds, 'Puppet')

    // /**
    //   * 2. Setup `reset` Event via a 1 second Throttle Queue:
    //   */
    // this.resetThrottleQueue = new ThrottleQueue<string>(1000)
    // this.resetThrottleQueue.subscribe(reason => {
    //   log.silly('WatchdogAgent', 'constructor() resetThrottleQueue.subscribe() reason: "%s"', reason)
    //   puppet.reset(reason)
    // })
  }

  start (): void {
    /**
     * puppet event `heartbeat` to feed() watchdog
     */
    const feed = (food: WatchdogFood) => { this.watchdog.feed(food) }
    this.puppet.on('heartbeat', feed)
    log.verbose('WatchdogAgent', 'start() puppet event "heartbeat" listener added')

    this.cleanCallbackList.push(() => {
      this.puppet.off('heartbeat', feed)
      log.verbose('WatchdogAgent', 'start() puppet event "heartbeat" listener removed')
    })

    /**
     * watchdog event `reset` to reset() puppet
     */
    const reset = (lastFood: WatchdogFood) => {
      log.warn('WatchdogAgent', 'start() reset() reason: %s', JSON.stringify(lastFood))
      this.puppet
        .reset(`WatchdogAgent reset: lastFood: "${JSON.stringify(lastFood)}"`)
        .catch(e => log.error('WatchdogAgent', 'start() reset() rejection: %s', e.message))
    }
    this.watchdog.on('reset', reset)
    log.verbose('WatchdogAgent', 'start() watchdog event "reset" listener added')

    this.cleanCallbackList.push(() => {
      this.puppet.off('reset', reset)
      log.verbose('WatchdogAgent', 'start() watchdog event "reset" listener removed')
    })

    // this.puppet.on('reset', this.throttleReset)
  }

  stop (): void {
    while (this.cleanCallbackList.length) {
      const callback = this.cleanCallbackList.shift()
      if (callback) {
        callback()
      }
    }
    this.watchdog.sleep()
  }

}

export { WatchdogAgent }
