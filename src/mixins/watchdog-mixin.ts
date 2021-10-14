import type { PuppetSkelton }   from '../puppet/skelton.js'

import {
  log,
}                   from '../config.js'
import {
  PuppetWatchdog,
}                   from '../puppet-watchdog.js'

const watchdogMixin = <MixinBase extends typeof PuppetSkelton>(mixinBase: MixinBase) => {

  abstract class WatchdogMixin extends mixinBase {

    watchdog: PuppetWatchdog

    constructor (...args: any[]) {
      super(...args)
      log.verbose('WatchdogMixin', 'constructor("%s")', JSON.stringify(args))

      this.watchdog = new PuppetWatchdog(this)
    }

    override async start (): Promise<void> {
      log.verbose('WatchdogMixin', 'start()')
      await super.start()
      this.watchdog.start()
    }

    override async stop (): Promise<void> {
      log.verbose('WatchdogMixin', 'stop()')
      this.watchdog.stop()
      await super.stop()
    }

  }

  return WatchdogMixin
}

type WatchdogMixin = ReturnType<typeof watchdogMixin>

export type {
  WatchdogMixin,
}
export { watchdogMixin }
