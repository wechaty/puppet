import type { cacheMixin } from './cache-mixin.js'

type CacheMixin = ReturnType<typeof cacheMixin>

const tagMixin = <TBase extends CacheMixin>(Base: TBase) => {

  abstract class TagMixin extends Base {

    constructor (...args: any[]) {
      super(...args)
    }

    /**
     *
     * Tag
     *  tagContactAdd - add a tag for a Contact. Create it first if it not exist.
     *  tagContactRemove - remove a tag from the Contact
     *  tagContactDelete - delete a tag from Wechat
     *  tagContactList(id) - get tags from a specific Contact
     *  tagContactList() - get tags from all Contacts
     *
     */
    abstract tagContactAdd (tagId: string, contactId: string)    : Promise<void>
    abstract tagContactDelete (tagId: string)                    : Promise<void>
    abstract tagContactList (contactId: string)                  : Promise<string[]>
    abstract tagContactList ()                                   : Promise<string[]>
    abstract tagContactRemove (tagId: string, contactId: string) : Promise<void>

  }

  return TagMixin
}

export { tagMixin }
