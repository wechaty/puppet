import type { Constructor } from 'clone-class'

import {
  log,
}           from '../config.js'

import type { PuppetOptions }   from '../schemas/puppet.js'
import { PayloadCache }         from '../payload-cache.js'

const cacheMixin = <TBase extends Constructor>(Base: TBase) => {

  class CacheMixin extends Base {

    cache: PayloadCache

    constructor (...args: any[]) {
      super(...args)
      log.verbose('CacheMixin', 'constructor("%s")', JSON.stringify(args))

      const options: PuppetOptions = args[0] || {}

      this.cache = new PayloadCache(options.cache)
    }

  }

  return CacheMixin
}

type CacheMixin = ReturnType<typeof cacheMixin>

export type {
  CacheMixin,
}
export { cacheMixin }
