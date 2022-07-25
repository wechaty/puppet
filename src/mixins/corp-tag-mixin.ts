import { log } from '../config.js'

import type { PuppetSkeleton } from '../puppet/puppet-skeleton.js'
import type { CorpTagGroup, CorpTag } from '../schemas/corpTag.js'

const corpTagMixin = <MixinBase extends typeof PuppetSkeleton>(mixinBase: MixinBase) => {

  abstract class CorpTagMixin extends mixinBase {

    constructor (...args: any[]) {
      super(...args)
      log.verbose('PuppetCorpTagMixin', 'constructor()')
    }

    /**
     *
     * CorpTag - tags in groups
     *  corpTagContactAdd - add a tag for a Contact. Tag must exist.
     *  corpTagContactRemove - remove a tag from a Contact
     *  corpTagGroupAdd - add a tag group from IM
     *  corpTagGroupDelete - delete a tag group from IM
     *  corpTagAdd - add a tag in a group from IM
     *  corpTagDelete - delete a tag in a group from IM
     *  corpTagGroupList - get a list of tag groups
     *  corpTagList - get a list of tags in a group
     *  corpTagContactList(id) - get tags from a specific Contact
     *
     */
    abstract corpTagContactAdd(corpTagGroupId: string, corpTagId: string, contactId: string): Promise<void>
    abstract corpTagContactRemove(corpTagGroupId: string, corpTagId: string, contactId: string): Promise<void>
    abstract corpTagGroupAdd(corpTagGroupName: string): Promise<string | void>
    abstract corpTagGroupDelete(corpTagGroupId: string): Promise<void>
    abstract corpTagAdd(corpTagGroupId: string, corpTagName: string): Promise<string | void>
    abstract corpTagDelete(corpTagGroudId: string, corpTagId: string): Promise<void>
    abstract corpTagGroupList(): Promise<CorpTagGroup[]>
    abstract corpTagList(corpTagGroupId: string): Promise<CorpTag[]>
    abstract corpTagContactList(contactId: string): Promise<CorpTag[]>

  }

  return CorpTagMixin
}

type ProtectedPropertyCorpTagMixin = never

export type {
  ProtectedPropertyCorpTagMixin,
}
export { corpTagMixin }
