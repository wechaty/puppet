import type { FileBoxInterface } from 'file-box'
import {
  log,
} from '../config.js'

import type { PuppetSkeleton } from '../puppet/mod.js'
import type { PostPayload } from '../schemas/mod.js'
import type { PostMixin } from './post-mixin.js'

const momentMixin = <MixinBase extends typeof PuppetSkeleton & PostMixin>(mixinBase: MixinBase) => {

  abstract class MomentMixin extends mixinBase {

    constructor (...args: any[]) {
      super(...args)
      log.verbose('PuppetMomentMixin', 'constructor()')
    }

    // alias for postPublish (feel like it should be part of moment mixin)
    momentPost (payload: PostPayload): Promise<void | string> {
      return this.postPublish(payload)
    }

    // R & W methods
    abstract momentSignature (text?: string): Promise<void | string>
    abstract momentCoverage (cover?: FileBoxInterface): Promise<void | FileBoxInterface>

  }

  return MomentMixin
}

type MomentMixin = ReturnType<typeof momentMixin>
type ProtectedPropertyMomentMixin = never

export type {
  MomentMixin,
  ProtectedPropertyMomentMixin,
}
export { momentMixin }
