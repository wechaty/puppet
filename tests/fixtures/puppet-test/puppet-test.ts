import * as PUPPET from '../../../src/mods/mod.js'
import type {
  FileBoxInterface,
}                           from 'file-box'

/**
 * expose to public for internal methods:
 */
import type { MessagePayloadFilterFunction } from '../../../src/schemas/message.js'
import type { RoomPayloadFilterFunction }    from '../../../src/schemas/room.js'
import type { ContactPayloadFilterFunction } from '../../../src/schemas/contact.js'
import type { FriendshipAddOptions } from '../../../src/schemas/friendship.js'

class PuppetTest extends PUPPET.Puppet {

  override name () {
    return 'puppet-test'
  }

  override version () {
    return '1.0.0'
  }

  override async onStart () : Promise<void> { }
  override async onStop ()  : Promise<void> { }

  override async ding (data?: string)   : Promise<void> { return data as any as void }
  override async logout () : Promise<void> { return {} as any }

  /**
   *
   * ContactSelf
   *
   *
   */
  override async contactSelfQRCode ()                     : Promise<string> { return '' }
  override async contactSelfName (name: string)           : Promise<void> { void name }
  override async contactSelfSignature (signature: string) : Promise<void> { void signature }

  /**
   *
   * Tag
   *
   */
  override async tagContactAdd (tagId: string, contactId: string) : Promise<void> { void { contactId, tagId } }
  override async tagContactRemove (tagId: string, contactId: string) : Promise<void> { void { contactId, tagId } }
  override async tagContactDelete (tagId: string) : Promise<void> { void { tagId } }
  override async tagContactList (contactId?: string) : Promise<string[]> { return [contactId || ''] }

  /**
   *
   * Contact
   *
   */
  override async contactAlias (contactId: string)                        : Promise<string>
  override async contactAlias (contactId: string, alias: string | null)  : Promise<void>
  override async contactAlias (contactId: string, alias?: string | null) : Promise<string | void> { return { alias, contactId } as any }

  override async contactAvatar (contactId: string)                          : Promise<FileBoxInterface>
  override async contactAvatar (contactId: string, file: FileBoxInterface)  : Promise<void>
  override async contactAvatar (contactId: string, file?: FileBoxInterface) : Promise<void | FileBoxInterface> { return { contactId, file } as any }

  override async contactPhone (contactId: string, phoneList: string[]): Promise<void> { return { contactId, phoneList } as any }

  override async contactList ()                    : Promise<string[]> { return {} as any }

  override async contactCorporationRemark (contactId: string, corporationRemark: string | null) : Promise<void> { return { contactId, corporationRemark } as any }

  override async contactDescription (contactId: string, description: string | null): Promise<void> { return { contactId, description } as any }

  override async contactRawPayload (id: string)            : Promise<any> { return { id } as any }
  override async contactRawPayloadParser (rawPayload: any) : Promise<PUPPET.payloads.Contact> { return { rawPayload } as any }

  /**
   *
   * Friendship
   *
   */
  override async friendshipRawPayload (id: string)            : Promise<any> { return { id } as any }
  override async friendshipRawPayloadParser (rawPayload: any) : Promise<PUPPET.payloads.Friendship> { return rawPayload }

  override async friendshipSearchPhone (phone: string) : Promise<null | string> { return phone }
  override async friendshipSearchWeixin (weixin: string) : Promise<null | string> { return weixin }
  override async friendshipAdd (contactId: string, option?: FriendshipAddOptions) : Promise<void> { return { contactId, option } as any }
  override async friendshipAccept (friendshipId: string)           : Promise<void> { return { friendshipId } as any }

  /**
   *
   * Message
   *
   */
  override async messageContact     (messageId: string)                       : Promise<string> { return { messageId } as any }
  override async messageFile        (messageId: string)                       : Promise<FileBoxInterface> { return { messageId } as any }
  override async messageImage       (messageId: string, imageType: PUPPET.types.Image) : Promise<FileBoxInterface> { return { imageType, messageId } as any }
  override async messageMiniProgram (messageId: string)                       : Promise<PUPPET.payloads.MiniProgram> { return { messageId } as any }
  override async messageUrl         (messageId: string)                       : Promise<PUPPET.payloads.UrlLink> { return { messageId } as any }
  override async messageLocation    (messageId: string)                       : Promise<PUPPET.payloads.Location> { return { messageId } as any }

  override async messageForward         (conversationId: string, messageId: string)                      : Promise<void | string> { return { conversationId, messageId } as any }
  override async messageSendContact     (conversationId: string, contactId: string)                      : Promise<void | string> { return { contactId, conversationId } as any }
  override async messageSendFile        (conversationId: string, file: FileBoxInterface)                 : Promise<void | string> { return { conversationId, file } as any }
  override async messageSendText        (conversationId: string, text: string)                           : Promise<void | string> { return { conversationId, text } as any }
  override async messageSendUrl         (conversationId: string, urlLinkPayload: PUPPET.payloads.UrlLink)         : Promise<void | string> { return { conversationId, urlLinkPayload } as any }
  override async messageSendMiniProgram (conversationId: string, miniProgramPayload: PUPPET.payloads.MiniProgram) : Promise<void | string> { return { conversationId, miniProgramPayload } as any }
  override async messageSendLocation    (conversationId: string, locationPayload: PUPPET.payloads.Location)       : Promise<void | string> { return { conversationId, locationPayload } as any }
  override async messageSendPost        (conversationId: string, postPayload: PUPPET.payloads.Post)               : Promise<void | string> { return { conversationId, postPayload } as any }

  override async messageRawPayload (id: string)            : Promise<any> { return { id } as any }
  override async messageRawPayloadParser (rawPayload: any) : Promise<PUPPET.payloads.Message> { return { rawPayload } as any }

  override async messageRecall (messageId: string)         : Promise<boolean> { return { messageId } as any }

  /**
   *
   * Conversation
   *
   */
  override async conversationReadMark (conversationId: string, hasRead?: boolean): Promise<void | boolean> { void { conversationId, hasRead } }

  /**
   *
   * Room Invitation
   *
   */
  override async roomInvitationAccept (_: string): Promise<void> { }

  override async roomInvitationRawPayload (roomInvitationId: string) : Promise<any> { return { roomInvitationId } as any }
  override async roomInvitationRawPayloadParser (rawPayload: any)    : Promise<PUPPET.payloads.RoomInvitation> { return rawPayload }

  /**
   *
   * Room
   *
   */
  override async roomAnnounce (roomId: string)                : Promise<string>
  override async roomAnnounce (roomId: string, text: string)  : Promise<void>
  override async roomAnnounce (roomId: string, text?: string) : Promise<void | string> { return { roomId, text } as any }

  override async roomAdd (roomId: string, contactId: string, inviteOnly?: boolean) : Promise<void> { return { contactId, inviteOnly, roomId } as any }
  override async roomAvatar (roomId: string)                                       : Promise<FileBoxInterface> { return { roomId } as any }
  override async roomCreate (contactIdList: string[], topic?: string)              : Promise<string> { return { contactIdList, topic } as any }
  override async roomDel (roomId: string, contactId: string)                       : Promise<void> { return { contactId, roomId } as any }
  override async roomQuit (roomId: string)                                         : Promise<void> { return { roomId } as any }
  override async roomQRCode (roomId: string)                                       : Promise<string> { return { roomId } as any }

  override async roomTopic (roomId: string)                 : Promise<string>
  override async roomTopic (roomId: string, topic: string)  : Promise<void>
  override async roomTopic (roomId: string, topic?: string) : Promise<string | void> { return { roomId, topic } as any }

  override async roomList ()                     : Promise<string[]> { return {} as any }
  override async roomMemberList (roomId: string) : Promise<string[]> { return { roomId } as any }

  override async roomRawPayload (id: string)            : Promise<any> { return { id } as any }
  override async roomRawPayloadParser (rawPayload: any) : Promise<PUPPET.payloads.Room> { return { rawPayload } as any }

  override async roomMemberRawPayload (roomId: string, contactId: string) : Promise<any> { return { contactId, roomId } as any }
  override async roomMemberRawPayloadParser (rawPayload: any)             : Promise<PUPPET.payloads.RoomMember> { return rawPayload }

  /**
   * expose to public for internal methods:
   */
  override messageQueryFilterFactory (
    query: PUPPET.filters.Message,
  ): MessagePayloadFilterFunction {
    return super.messageQueryFilterFactory(query)
  }

  override roomQueryFilterFactory (
    query: PUPPET.filters.Room,
  ): RoomPayloadFilterFunction {
    return super.roomQueryFilterFactory(query)
  }

  override contactQueryFilterFactory (
    query: PUPPET.filters.Contact,
  ): ContactPayloadFilterFunction {
    return super.contactQueryFilterFactory(query)
  }

  /**
   * Posts
   */
  override async postRawPayload (postId: string): Promise<any> {
    return { postId } as any
  }

  override async postRawPayloadParser (rawPayload: any) : Promise<PUPPET.payloads.Post> {
    return { rawPayload } as any
  }

  override postSearch (
    query       : PUPPET.filters.Post,
    pagination? : PUPPET.filters.PaginationRequest,
  ): Promise<PUPPET.filters.PaginationResponse<string[]>> {
    return { pagination, query } as any
  }

  override postSend (type: PUPPET.types.Post, payload: PUPPET.payloads.Post): Promise<void | string> {
    return { payload, type } as any
  }

  /**
   * Tap
   */
  override tap (
    postId : string,
    type?  : PUPPET.types.Tap,
    tap?   : boolean,
  ): Promise<void | boolean> {
    return { postid: postId, tap, type } as any
  }

  /**
   * Search for taps for a post
   *
   * @param query
   * @param pagination
   */
  override tapSearch (
    postId      : string,
    query?      : PUPPET.filters.Tap,
    pagination? : PUPPET.filters.PaginationRequest,
  ): Promise<PUPPET.filters.PaginationResponse<PUPPET.payloads.Tap>> {
    return { pagination, postId, query } as any
  }

}

export {
  PuppetTest,
}
export default PuppetTest
