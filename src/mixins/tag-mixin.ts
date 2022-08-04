import { log } from '../config.js'

import type { PuppetSkeleton }   from '../puppet/puppet-skeleton.js'
import type { TagPayload, TagGroupPayload, TagIdentifier } from '../schemas/tag.js'
import type { CacheMixin } from './cache-mixin.js'

const tagMixin = <MixinBase extends CacheMixin & typeof PuppetSkeleton>(mixinBase: MixinBase) => {

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
    abstract tagContactTagRemove(tags: TagIdentifier[], contactIds: string[]): Promise<void>
    abstract tagContactTagList(contactId: string): Promise<TagIdentifier[]>

    abstract tagGroupAdd(groupName: string): Promise<string | void>
    abstract tagGroupDelete(groupId: string): Promise<void>
    abstract tagGroupList(): Promise<string[]>
    abstract tagGroupTagList(groupId?: string): Promise<TagIdentifier[]>
    abstract tagGroupPayloadPuppet(groupId: string): Promise<TagGroupPayload>

    abstract tagTagAdd(tagName: string, groupId?: string): Promise<TagIdentifier | void>
    abstract tagTagDelete(tag: TagIdentifier): Promise<void>
    abstract tagTagList(): Promise<TagIdentifier[]>
    abstract tagTagContactList(tag: TagIdentifier): Promise<string[]>
    abstract tagPayloadPuppet(tag: TagIdentifier): Promise<TagPayload>

    tagPayloadCache (tag: TagIdentifier): undefined | TagPayload {

      const cachedPayload = this.cache.tag.get(tag)
      if (!cachedPayload) {
        log.silly('PuppetTagMixin', 'tagPayloadCache(%s) cache MISS', JSON.stringify(tag))
      }

      return cachedPayload
    }

    async tagPayload (tag: TagIdentifier): Promise<TagPayload> {
      const cachedPayload = this.tagPayloadCache(tag)
      if (cachedPayload) {
        return cachedPayload
      }

      const payload = await this.tagPayloadPuppet(tag)
      this.cache.tag.set(tag, payload)
      log.silly('PuppetTagMixin', 'tagPayload(%s) cache SET', JSON.stringify(tag))
      return payload
    }

    tagGroupPayloadCache (tagGroup: string): undefined | TagGroupPayload {

      const cachedPayload = this.cache.tagGroup.get(tagGroup)
      if (!cachedPayload) {
        log.silly('PuppetTagMixin', 'tagGroupPayloadCache(%s) cache MISS', tagGroup)
      }

      return cachedPayload
    }

    async tagGroupPayload (tagGroup: string): Promise<TagGroupPayload> {
      const cachedPayload = this.tagGroupPayloadCache(tagGroup)
      if (cachedPayload) {
        return cachedPayload
      }

      const payload = await this.tagGroupPayloadPuppet(tagGroup)
      this.cache.tagGroup.set(tagGroup, payload)
      log.silly('PuppetTagMixin', 'tagGroupPayload(%s) cache SET', tagGroup)
      return payload
    }

  }

  return TagMixin
}

type ProtectedPropertyTagMixin = never

export type {
  ProtectedPropertyTagMixin,
}
export { tagMixin }
