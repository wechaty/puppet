import {
  Puppet,
  FileBox,
  ContactPayload,
  FriendshipPayload,
  ImageType,
  MiniProgramPayload,
  UrlLinkPayload,
  MessagePayload,
  MessageQueryFilter,
  RoomInvitationPayload,
  RoomPayload,
  RoomMemberPayload,
  RoomQueryFilter,
  ContactQueryFilter,
}                           from '../../../src/mod.js'

/**
 * expose to public for internal methods:
 */
import { MessagePayloadFilterFunction } from '../../../src/schemas/message.js'
import { RoomPayloadFilterFunction }    from '../../../src/schemas/room.js'
import { ContactPayloadFilterFunction } from '../../../src/schemas/contact.js'
import { FriendshipAddOptions } from '../../../src/schemas/friendship.js'
import { MomentPayload } from '../../../src/schemas/moment.js'

class PuppetTest extends Puppet {

  override name () {
    return 'puppet-test'
  }

  override version () {
    return '1.0.0'
  }

  override async start () : Promise<void> { return super.start() }
  override async stop ()  : Promise<void> { return super.stop() }

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
   * Moment
   *
   */
  override async momentSignature (signature?: string): Promise<boolean | string> { return { signature } as any }
  override async momentCoverage (image: FileBox): Promise<boolean> { return { image } as any }
  override async postTextMoment (content: string, visibleList?: string[]): Promise<string> { return { content, visibleList } as any }
  override async postLinkMoment (urlLinkPayload: UrlLinkPayload, content?: string): Promise<string> { return { urlLinkPayload, content } as any }
  override async postImageMoment (images: FileBox[], content?: string): Promise<string> { return { images, content } as any }

  override async momentPayload (id: string): Promise<MomentPayload> { return { id } as any }

  override async momentList (): Promise<string[]> { return {} as any }
  override async revokeMoment (id: string): Promise<boolean> { return { id } as any }
  override async likeMoment (id: string): Promise<boolean> { return { id } as any }
  override async revokeLikeMoment (id: string): Promise<boolean> { return { id } as any }
  override async commentMoment (id: string, comment: string, commentId?: string): Promise<string> { return { id, comment, commentId } as any }
  override async revokeCommentMoment (commentId: string): Promise<boolean> { return { commentId } as any }

  /**
   *
   * Contact
   *
   */
  override async contactAlias (contactId: string)                        : Promise<string>
  override async contactAlias (contactId: string, alias: string | null)  : Promise<void>
  override async contactAlias (contactId: string, alias?: string | null) : Promise<string | void> { return { alias, contactId } as any }

  override async contactAvatar (contactId: string)                 : Promise<FileBox>
  override async contactAvatar (contactId: string, file: FileBox)  : Promise<void>
  override async contactAvatar (contactId: string, file?: FileBox) : Promise<void | FileBox> { return { contactId, file } as any }

  override async contactPhone (contactId: string, phoneList: string[]): Promise<void> { return { contactId, phoneList } as any }

  override async contactList ()                    : Promise<string[]> { return {} as any }

  override async contactCorporationRemark (contactId: string, corporationRemark: string | null) : Promise<void> { return { contactId, corporationRemark } as any }

  override async contactDescription (contactId: string, description: string | null): Promise<void> { return { contactId, description } as any }

  override async contactRawPayload (id: string)            : Promise<any> { return { id } as any }
  override async contactRawPayloadParser (rawPayload: any) : Promise<ContactPayload> { return { rawPayload } as any }

  /**
   *
   * Friendship
   *
   */
  override async friendshipRawPayload (id: string)            : Promise<any> { return { id } as any }
  override async friendshipRawPayloadParser (rawPayload: any) : Promise<FriendshipPayload> { return rawPayload }

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
  override async messageFile        (messageId: string)                       : Promise<FileBox> { return { messageId } as any }
  override async messageImage       (messageId: string, imageType: ImageType) : Promise<FileBox> { return { imageType, messageId } as any }
  override async messageMiniProgram (messageId: string)                       : Promise<MiniProgramPayload> { return { messageId } as any }
  override async messageUrl         (messageId: string)                       : Promise<UrlLinkPayload> { return { messageId } as any }

  override async messageForward         (conversationId: string, messageId: string)                      : Promise<void | string> { return { conversationId, messageId } as any }
  override async messageSendContact     (conversationId: string, contactId: string)                      : Promise<void | string> { return { contactId, conversationId } as any }
  override async messageSendFile        (conversationId: string, file: FileBox)                          : Promise<void | string> { return { conversationId, file } as any }
  override async messageSendText        (conversationId: string, text: string)                           : Promise<void | string> { return { conversationId, text } as any }
  override async messageSendUrl         (conversationId: string, urlLinkPayload: UrlLinkPayload)         : Promise<void | string> { return { conversationId, urlLinkPayload } as any }
  override async messageSendMiniProgram (conversationId: string, miniProgramPayload: MiniProgramPayload) : Promise<void | string> { return { conversationId, miniProgramPayload } as any }

  override async messageRawPayload (id: string)            : Promise<any> { return { id } as any }
  override async messageRawPayloadParser (rawPayload: any) : Promise<MessagePayload> { return { rawPayload } as any }

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
  override async roomInvitationRawPayloadParser (rawPayload: any)    : Promise<RoomInvitationPayload> { return rawPayload }

  /**
   *
   * Room
   *
   */
  override async roomAnnounce (roomId: string)                : Promise<string>
  override async roomAnnounce (roomId: string, text: string)  : Promise<void>
  override async roomAnnounce (roomId: string, text?: string) : Promise<void | string> { return { roomId, text } as any }

  override async roomAdd (roomId: string, contactId: string, inviteOnly?: boolean) : Promise<void> { return { contactId, inviteOnly, roomId } as any }
  override async roomAvatar (roomId: string)                                       : Promise<FileBox> { return { roomId } as any }
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
  override async roomRawPayloadParser (rawPayload: any) : Promise<RoomPayload> { return { rawPayload } as any }

  override async roomMemberRawPayload (roomId: string, contactId: string) : Promise<any> { return { contactId, roomId } as any }
  override async roomMemberRawPayloadParser (rawPayload: any)             : Promise<RoomMemberPayload> { return rawPayload }

  /**
   * expose to public for internal methods:
   */
  public override messageQueryFilterFactory (
    query: MessageQueryFilter,
  ): MessagePayloadFilterFunction {
    return super.messageQueryFilterFactory(query)
  }

  public override roomQueryFilterFactory (
    query: RoomQueryFilter,
  ): RoomPayloadFilterFunction {
    return super.roomQueryFilterFactory(query)
  }

  public override contactQueryFilterFactory (
    query: ContactQueryFilter,
  ): ContactPayloadFilterFunction {
    return super.contactQueryFilterFactory(query)
  }

  /**
   * FIXME: Huan(202008)
   *  this method has overwrite the super.reset() without any functionality
   *  need to change to super.reset()
   *  however, we need to solve
   *    `error TS1034: 'super' must be followed by an argument list or member access.`
   *  first.
   *
   * Update:
   *  - Huan(202108): uncommented the below code
   *      and change `reset` from private to protected in parent class
   */
  protected override reset (reason: string): void {
    return super.reset(reason)
  }

}

export {
  PuppetTest,
}
export default PuppetTest
