import {
  log,
} from '../config.js'

import type { PuppetSkeleton } from '../puppet/puppet-skeleton.js'

const readyMixin = <MixinBase extends typeof PuppetSkeleton>(mixinBase: MixinBase) => {

  abstract class ReadyMixin extends mixinBase {

    isReady: boolean = false

    constructor (...args: any[]) {
      super(...args)
      log.verbose('ReadyMixin', 'constructor()')
    }

    override async start (): Promise<void> {
      log.verbose('ReadyMixin', 'start()')
      await super.start()
      this.on('ready', () => {
        this.isReady = true
      })
    }

    override async stop (): Promise<void> {
      log.verbose('ReadyMixin', 'stop()')
      await super.stop()
    }

  }

  return ReadyMixin
}

type ReadyMixin = ReturnType<typeof readyMixin>

type ProtectedPropertyReadyMixin =
  | 'isReady'

export type {
  ReadyMixin,
  ProtectedPropertyReadyMixin,
}
export { readyMixin }
