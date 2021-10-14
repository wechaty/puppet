import {
  Watchdog,
  WatchdogFood,
}                       from 'watchdog'

import type { PuppetSkelton } from './puppet/skelton.js'
import {
  log,
}           from './config.js'

const DEFAULT_WATCHDOG_TIMEOUT_SECONDS  = 60

class PuppetWatchdog {

  protected readonly watchdog : Watchdog

  private cleanCallbackList: Function[]

  /**
   * Throttle Reset Events
   *
   * @private
   */
  // protected readonly resetThrottleQueue: ThrottleQueue<string>

  constructor (
    protected readonly puppet: PuppetSkelton,
  ) {
    log.verbose('Watchdog', 'constructor(%s)', puppet)

    this.cleanCallbackList = []

    /**
     * 1. Setup Watchdog
     *  puppet implementation class only need to do one thing:
     *  feed the watchdog by `this.emit('heartbeat', ...)`
     */
    const timeoutSeconds = puppet.options.timeoutSeconds || DEFAULT_WATCHDOG_TIMEOUT_SECONDS
    log.verbose('PuppetWatchdog', 'constructor() watchdog timeout set to %d seconds', timeoutSeconds)
    this.watchdog = new Watchdog(1000 * timeoutSeconds, 'Puppet')

    // /**
    //   * 2. Setup `reset` Event via a 1 second Throttle Queue:
    //   */
    // this.resetThrottleQueue = new ThrottleQueue<string>(1000)
    // this.resetThrottleQueue.subscribe(reason => {
    //   log.silly('PuppetWatchdog', 'constructor() resetThrottleQueue.subscribe() reason: "%s"', reason)
    //   puppet.reset(reason)
    // })
  }

  /**
   * @private
   *
   * For used by Wechaty internal ONLY.
   */
  start (): void {
    /**
     * puppet event `heartbeat` to feed() watchdog
     */
    const feed = (food: WatchdogFood) => { this.watchdog.feed(food) }
    this.puppet.on('heartbeat', feed)
    this.cleanCallbackList.push(() => this.puppet.off('heartbeat', feed))

    /**
     * watchdog event `reset` to reset() puppet
     */
    const reset = (lastFood: WatchdogFood) => {
      log.warn('PuppetWatchdog', 'start() reset() reason: %s', JSON.stringify(lastFood))
      this.puppet
        .reset(`PuppetWatchdog reset: lastFood: "${JSON.stringify(lastFood)}"`)
        .catch(e => log.error('PuppetWatchdog', 'start() reset() rejection: %s', e.message))
    }
    this.watchdog.on('reset', reset)
    this.cleanCallbackList.push(() => this.puppet.off('reset', reset))

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

export { PuppetWatchdog }
