import { log } from '../config.js'
import type { PuppetSkeleton }   from '../puppet/puppet-skeleton.js'
import { DirtyType } from '../schemas/mod.js'
import type { TagPayload, TagGroupPayload } from '../schemas/tag.js'
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

    abstract tagContactTagAdd(tagIds: string[], contactIds: string[]): Promise<void>
    abstract tagContactTagRemove(tagIds: string[], contactIds: string[]): Promise<void>
    abstract tagContactTagList(contactId: string): Promise<string[]>

    abstract tagGroupAdd(groupName: string): Promise<string | void>
    abstract tagGroupDelete(groupId: string): Promise<void>
    abstract tagGroupList(): Promise<string[]>
    abstract tagGroupTagList(groupId?: string): Promise<string[]>
    abstract tagGroupPayloadPuppet(groupId: string): Promise<TagGroupPayload>

    abstract tagTagAdd(tagName: string, groupId?: string): Promise<string | void>
    abstract tagTagDelete(tagId: string): Promise<void>
    abstract tagTagList(): Promise<string[]>
    abstract tagTagContactList(tag: string): Promise<string[]>
    abstract tagPayloadPuppet(tag: string): Promise<TagPayload>

    tagPayloadCache (id: string): undefined | TagPayload {
      const cachedPayload = this.cache.tag.get(id)
      if (!cachedPayload) {
        log.silly('PuppetTagMixin', 'tagPayloadCache(%s) cache MISS', id)
      }

      return cachedPayload
    }

    async tagPayload (id: string): Promise<TagPayload> {
      const cachedPayload = this.tagPayloadCache(id)
      if (cachedPayload) {
        return cachedPayload
      }

      const payload = await this.tagPayloadPuppet(id)
      this.cache.tag.set(id, payload)
      log.silly('PuppetTagMixin', 'tagPayload(%s) cache SET', id)
      return payload
    }

    tagGroupPayloadCache (id: string): undefined | TagGroupPayload {

      const cachedPayload = this.cache.tagGroup.get(id)
      if (!cachedPayload) {
        log.silly('PuppetTagMixin', 'tagGroupPayloadCache(%s) cache MISS', id)
      }

      return cachedPayload
    }

    async tagGroupPayload (id: string): Promise<TagGroupPayload> {
      const cachedPayload = this.tagGroupPayloadCache(id)
      if (cachedPayload) {
        return cachedPayload
      }

      const payload = await this.tagGroupPayloadPuppet(id)
      this.cache.tagGroup.set(id, payload)
      log.silly('PuppetTagMixin', 'tagGroupPayload(%s) cache SET', id)
      return payload
    }

    async tagPayloadDirty (
      id: string,
    ): Promise<void> {
      log.verbose('PuppetTagMixin', 'tagPayloadDirty(%s)', id)
      await this.__dirtyPayloadAwait(
        DirtyType.Tag,
        id,
      )
    }

    async tagGroupPayloadDirty (
      id: string,
    ): Promise<void> {
      log.verbose('PuppetTagMixin', 'tagGroupPayloadDirty(%s)', id)
      await this.__dirtyPayloadAwait(
        DirtyType.TagGroup,
        id,
      )
    }

  }

  return TagMixin
}

type ProtectedPropertyTagMixin = never

export type {
  ProtectedPropertyTagMixin,
}
export { tagMixin }
