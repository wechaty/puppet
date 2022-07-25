import { log } from '../config.js'

import type { PuppetSkeleton } from '../puppet/puppet-skeleton.js'
import type { CorpTagPayload, CorpTagGroupPayload } from '../schemas/corpTag.js'

const corpTagMixin = <MixinBase extends typeof PuppetSkeleton>(mixinBase: MixinBase) => {

  abstract class CorpTagMixin extends mixinBase {

    constructor (...args: any[]) {
      super(...args)
      log.verbose('PuppetCorpTagMixin', 'constructor()')
    }

    /**
     *
     * CorpTag - tags in groups
     *  corpTagContactTagAdd - add a tag for a Contact. Tag must exist.
     *  corpTagContactTagRemove - remove a tag from a Contact
     *  corpTagGroupAdd - add a tag group from IM
     *  corpTagGroupDelete - delete a tag group from IM
     *  corpTagTagAdd - add a tag in a group from IM
     *  corpTagTagDelete - delete a tag in a group from IM
     *  corpTagGroupList - get a list of tag groups
     *  corpTagTagList - get a list of tags in a group
     *  corpTagContactTagList(id) - get tags from a specific Contact
     *
     */
    abstract corpTagContactTagAdd(corpTagGroupId: string, corpTagId: string, contactId: string): Promise<void>
    abstract corpTagContactTagRemove(corpTagGroupId: string, corpTagId: string, contactId: string): Promise<void>
    abstract corpTagGroupAdd(corpTagGroupName: string): Promise<CorpTagGroupPayload | void>
    abstract corpTagGroupDelete(corpTagGroupId: string): Promise<void>
    abstract corpTagTagAdd(corpTagGroupId: string, corpTagName: string): Promise<CorpTagPayload | void>
    abstract corpTagTagDelete(corpTagGroupId: string, corpTagId: string): Promise<void>
    abstract corpTagGroupList(): Promise<CorpTagGroupPayload[]>
    abstract corpTagTagList(corpTagGroupId: string): Promise<CorpTagPayload[]>
    abstract corpTagContactTagList(contactId: string): Promise<CorpTagPayload[]>

  }

  return CorpTagMixin
}

type ProtectedPropertyCorpTagMixin = never

export type {
  ProtectedPropertyCorpTagMixin,
}
export { corpTagMixin }
