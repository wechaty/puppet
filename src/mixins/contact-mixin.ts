import {
  FileBox,
  log,
}                       from '../config.js'

import type {
  ContactPayload,
  ContactPayloadFilterFunction,
  ContactQueryFilter,
}                                 from '../schemas/contact.js'

import type { CacheMixin }        from './cache-mixin.js'

const contactMixin = <TBase extends CacheMixin>(Base: TBase) => {

  abstract class ContactMixin extends Base {

    constructor (...args: any[]) {
      super(...args)
    }

    /**
     *
     * ContactSelf
     *
     */
    abstract contactSelfName (name: string)           : Promise<void>
    abstract contactSelfQRCode ()                     : Promise<string /* QR Code Value */>
    abstract contactSelfSignature (signature: string) : Promise<void>

    /**
     *
     * Contact
     *
     */
    abstract contactAlias (contactId: string)                       : Promise<string>
    abstract contactAlias (contactId: string, alias: string | null) : Promise<void>

    abstract contactAvatar (contactId: string)                : Promise<FileBox>
    abstract contactAvatar (contactId: string, file: FileBox) : Promise<void>

    abstract contactPhone (contactId: string, phoneList: string[]) : Promise<void>

    abstract contactCorporationRemark (contactId: string, corporationRemark: string | null): Promise<void>

    abstract contactDescription (contactId: string, description: string | null): Promise<void>

    abstract contactList ()                   : Promise<string[]>

    protected abstract contactRawPayload (contactId: string)     : Promise<any>
    protected abstract contactRawPayloadParser (rawPayload: any) : Promise<ContactPayload>

    // async contactRoomList (
    //   contactId: string,
    // ): Promise<string[] /* roomId */> {
    //   log.verbose('Puppet', 'contactRoomList(%s)', contactId)

    //   const roomIdList = await this.roomList()
    //   const roomPayloadList = await Promise.all(
    //     roomIdList.map(
    //       roomId => this.roomPayload(roomId),
    //     ),
    //   )
    //   const resultRoomIdList = roomPayloadList
    //     .filter(roomPayload => roomPayload.memberIdList.includes(contactId))
    //     .map(payload => payload.id)

    //   return resultRoomIdList
    // }

    async contactSearch (
      query?        : string | ContactQueryFilter,
      searchIdList? : string[],
    ): Promise<string[]> {
      log.verbose('Puppet', 'contactSearch(query=%s, %s)',
        JSON.stringify(query),
        searchIdList
          ? `idList.length = ${searchIdList.length}`
          : '',
      )

      if (!searchIdList) {
        searchIdList = await this.contactList()
      }

      log.silly('Puppet', 'contactSearch() searchIdList.length = %d', searchIdList.length)

      if (!query) {
        return searchIdList
      }

      if (typeof query === 'string') {
        const nameIdList  = await this.contactSearch({ name: query },  searchIdList)
        const aliasIdList = await this.contactSearch({ alias: query }, searchIdList)

        return Array.from(
          new Set([
            ...nameIdList,
            ...aliasIdList,
          ]),
        )
      }

      const filterFunction: ContactPayloadFilterFunction = this.contactQueryFilterFactory(query)

      const BATCH_SIZE = 16
      let   batchIndex = 0

      const resultIdList: string[] = []

      const matchId = async (id: string) => {
        try {
          /**
           * Does LRU cache matter at here?
           */
          // const rawPayload = await this.contactRawPayload(id)
          // const payload    = await this.contactRawPayloadParser(rawPayload)
          const payload = await this.contactPayload(id)

          if (filterFunction(payload)) {
            return id
          }

        } catch (e) {
          log.silly('Puppet', 'contactSearch() contactPayload exception: %s', (e as Error).message)
          await this.dirtyPayloadContact(id)
        }
        return undefined
      }

      while (BATCH_SIZE * batchIndex < searchIdList.length) {
        const batchSearchIdList  = searchIdList.slice(
          BATCH_SIZE * batchIndex,
          BATCH_SIZE * (batchIndex + 1),
        )

        const matchBatchIdFutureList = batchSearchIdList.map(matchId)
        const matchBatchIdList       = await Promise.all(matchBatchIdFutureList)

        const batchSearchIdResultList: string[] = matchBatchIdList.filter(id => !!id) as string[]

        resultIdList.push(...batchSearchIdResultList)

        batchIndex++
      }

      log.silly('Puppet', 'contactSearch() searchContactPayloadList.length = %d', resultIdList.length)

      return resultIdList
    }

    /**
     * Huan(202110): add the private back, or
     *  TODO: redesign dirtyPayloadContact
     */
    async dirtyPayloadContact (contactId: string): Promise<void> {
      log.verbose('Puppet', 'dirtyPayloadContact(%s)', contactId)
      this.cache.contact.delete(contactId)
    }

    protected contactQueryFilterFactory (
      query: ContactQueryFilter,
    ): ContactPayloadFilterFunction {
      log.verbose('Puppet', 'contactQueryFilterFactory(%s)',
        JSON.stringify(query),
      )

      /**
       * Clean the query for keys with empty value
       */
      Object.keys(query).forEach(key => {
        if (query[key as keyof ContactQueryFilter] === undefined) {
          delete query[key as keyof ContactQueryFilter]
        }
      })

      if (Object.keys(query).length < 1) {
        throw new Error('query must provide at least one key. current query is empty.')
      } else if (Object.keys(query).length > 1) {
        throw new Error('query only support one key. multi key support is not available now.')
      }
      // Huan(202105): we use `!` at here because the above `if` checks
      const filterKey = Object.keys(query)[0]!.toLowerCase() as keyof ContactQueryFilter

      const isValid = [
        'alias',
        'id',
        'name',
        'weixin',
      ].includes(filterKey)

      if (!isValid) {
        throw new Error('key not supported: ' + filterKey)
      }

      // TypeScript bug: have to set `undefined | string | RegExp` at here, or the later code type check will get error
      const filterValue: undefined | string | RegExp = query[filterKey]
      if (!filterValue) {
        throw new Error('filterValue not found for filterKey: ' + filterKey)
      }

      let filterFunction

      if (typeof filterValue === 'string') {
        filterFunction = (payload: ContactPayload) => filterValue === payload[filterKey]
      } else if (filterValue instanceof RegExp) {
        filterFunction = (payload: ContactPayload) => !!payload[filterKey] && filterValue.test(payload[filterKey]!)
      } else {
        throw new Error('unsupported filterValue type: ' + typeof filterValue)
      }

      return filterFunction
    }

    /**
     * Check a Contact Id if it's still valid.
     *  For example: talk to the server, and see if it should be deleted in the local cache.
     */
    async contactValidate (contactId: string) : Promise<boolean> {
      log.silly('Puppet', 'contactValidate(%s) base class just return `true`', contactId)
      return true
    }

    protected contactPayloadCache (contactId: string): undefined | ContactPayload {
      // log.silly('Puppet', 'contactPayloadCache(id=%s) @ %s', contactId, this)
      if (!contactId) {
        throw new Error('no id')
      }
      const cachedPayload = this.cache.contact.get(contactId)

      if (cachedPayload) {
        // log.silly('Puppet', 'contactPayload(%s) cache HIT', contactId)
      } else {
        log.silly('Puppet', 'contactPayload(%s) cache MISS', contactId)
      }

      return cachedPayload
    }

    async contactPayload (
      contactId: string,
    ): Promise<ContactPayload> {
      // log.silly('Puppet', 'contactPayload(id=%s) @ %s', contactId, this)

      if (!contactId) {
        throw new Error('no id')
      }

      /**
       * 1. Try to get from cache first
       */
      const cachedPayload = this.contactPayloadCache(contactId)
      if (cachedPayload) {
        return cachedPayload
      }

      /**
       * 2. Cache not found
       */
      const rawPayload = await this.contactRawPayload(contactId)
      const payload    = await this.contactRawPayloadParser(rawPayload)

      this.cache.contact.set(contactId, payload)
      log.silly('Puppet', 'contactPayload(%s) cache SET', contactId)

      return payload
    }

  }

  return ContactMixin
}

type ContactMixin = ReturnType<typeof contactMixin>

export type {
  ContactMixin,
}
export { contactMixin }
