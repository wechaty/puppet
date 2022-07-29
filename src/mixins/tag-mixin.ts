import { log } from '../config.js'

import type { PuppetSkeleton }   from '../puppet/puppet-skeleton.js'
import type { TagPayload, TagGroupPayload, TagIdentifier } from '../schemas/tag.js'

const tagMixin = <MixinBase extends typeof PuppetSkeleton>(mixinBase: MixinBase) => {

  abstract class TagMixin extends mixinBase {

    constructor (...args: any[]) {
      super(...args)
      log.verbose('PuppetTagMixin', 'constructor()')
    }

    /**
     *
     * Tag - in groups
     *  tagContactTagAdd - add a tag for a Contact. Tag must exist.
     *  tagContactTagRemove - remove a tag from a Contact
     *  tagGroupAdd - add a tag group from IM
     *  tagGroupDelete - delete a tag group from IM
     *  tagTagAdd - add a tag in a group from IM
     *  tagTagDelete - delete a tag in a group from IM
     *  tagGroupList - get a list of tag groups
     *  tagGroupTagList - get a list of tags in a group
     *  tagTagList - get a list of all tags
     *  tagContactTagList - get tags from a specific Contact
     *  tagTagContactList - get contact list of a specific tag
     *
     */

    abstract tagContactTagAdd(tags: TagIdentifier[], contactIds: string[]): Promise<void>
    abstract tagContactTagRemove(tag: TagIdentifier[], contactIds: string[]): Promise<void>
    abstract tagGroupAdd(tagGroupName: string): Promise<TagGroupPayload | void>
    abstract tagGroupDelete(tagGroupId: string): Promise<void>
    abstract tagTagAdd(tagGroupId: string | undefined, tagName: string): Promise<TagPayload | void>
    abstract tagTagDelete(tag: TagIdentifier): Promise<void>
    abstract tagGroupList(): Promise<TagGroupPayload[]>
    abstract tagGroupTagList(tagGroupId: string | undefined): Promise<TagPayload[]>
    abstract tagTagList(): Promise<TagPayload[]>
    abstract tagContactTagList(contactId: string): Promise<TagPayload[]>
    abstract tagTagContactList(tag: TagIdentifier): Promise<string[]>

  }

  return TagMixin
}

type ProtectedPropertyTagMixin = never

export type {
  ProtectedPropertyTagMixin,
}
export { tagMixin }
