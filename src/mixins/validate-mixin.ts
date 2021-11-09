import {
  Constructor,
  interfaceOfClass,
  looseInstanceOfClass,
} from 'clone-class'

import type {
  PuppetProtectedProperty,
} from '../puppet/interface.js'

import type { PuppetSkeleton } from '../puppet/puppet-skeleton.js'

const validateMixin = <MixinBase extends typeof PuppetSkeleton>(
  mixinBase: MixinBase,
) => {
  type Puppet = typeof mixinBase
  type PuppetInterface = Omit<Puppet, PuppetProtectedProperty>

  abstract class ValidateMixin extends mixinBase {

    /**
     * Check if obj satisfy Puppet interface
     */
    static validInterface (target: any): target is PuppetInterface {
      return interfaceOfClass(mixinBase as any as Constructor<Puppet>)<PuppetInterface>()(target)
    }

    /**
     * loose check instance of Puppet
     */
    static validInstance (target: any): target is Puppet {
      return looseInstanceOfClass(mixinBase as any as Constructor<Puppet>)(target)
    }

    /**
     * Huan(202110): I believe `valid()` will be a better performance than `validInterface()`
     *  because it will check `instanceof` first, which I believe it will be the most case
     *  and it will be faster than `interfaceOfPuppet()`
     */
    static valid (target: any): target is PuppetInterface {
      if (this.validInstance(target) || this.validInterface(target)) {
        return true
      }
      return false
    }

  }

  return ValidateMixin
}

type ValidateMixin = ReturnType<typeof validateMixin>;

/**
 * Huan(202110): it seems that that static properties should not be mixed in
 */
type ProtectedPropertyValidateMixin = never;
// | 'validInterface'
// | 'validInstance'

export type { ProtectedPropertyValidateMixin, ValidateMixin }
export { validateMixin }
