import {
  FileBoxType,
  FileBox,
}                         from 'file-box'
import {
  MemoryCard,
}                         from 'memory-card'
import {
  StateSwitch,
}                         from 'state-switch'
import {
  looseInstanceOfClass,
  instanceToClass,
}                         from 'clone-class'

import {
  VERSION,
  log,
}                         from './config.js'
import {
  Puppet,
}                         from './puppet.js'
import {
  ContactGender,
  ContactType,
  ContactPayload,
  ContactQueryFilter,
}                             from './schemas/contact.js'
import {
  ScanStatus,
}                             from './schemas/event.js'
import {
  FriendshipAddOptions,
  FriendshipPayload,
  FriendshipPayloadConfirm,
  FriendshipPayloadReceive,
  FriendshipPayloadVerify,
  FriendshipSearchQueryFilter,
  FriendshipType,
  FriendshipSceneType,
}                             from './schemas/friendship.js'
import {
  ImageType,
}                             from './schemas/image.js'
import {
  MessagePayload,
  MessagePayloadBase,
  MessagePayloadRoom,
  MessagePayloadTo,
  MessageQueryFilter,
  MessageType,
}                             from './schemas/message.js'
import {
  throwUnsupportedError,
}                             from './throw-unsupported-error.js'
import { PayloadType }         from './schemas/payload.js'
import {
  CHAT_EVENT_DICT,
  PUPPET_EVENT_DICT,

  YOU,
}                       from './schemas/puppet.js'

/********************
 *
 * Import Typings
 *
 ********************/
import type {
  EventDirtyPayload,
  EventDongPayload,
  EventErrorPayload,
  EventFriendshipPayload,
  EventHeartbeatPayload,
  EventLoginPayload,
  EventLogoutPayload,
  EventMessagePayload,
  EventReadyPayload,
  EventResetPayload,
  EventRoomInvitePayload,
  EventRoomJoinPayload,
  EventRoomLeavePayload,
  EventRoomTopicPayload,
  EventScanPayload,
}                             from './schemas/event.js'
import type {
  RoomPayload,
  RoomQueryFilter,
  RoomMemberPayload,
  RoomMemberQueryFilter,
}                             from './schemas/room.js'
import type {
  RoomInvitationPayload,
}                             from './schemas/room-invitation.js'
import type {
  UrlLinkPayload,
}                             from './schemas/url-link.js'
import type {
  MiniProgramPayload,
}                             from './schemas/mini-program.js'
import type {
  CommentPayload,
}                             from './schemas/comment.js'
import type {
  ListOption,
}                             from './schemas/list.js'

import type {
  PuppetOptions,
  PuppetEventName,
  // PuppetQRCodeScanEvent,
  // PuppetRoomInviteEvent,
  // PuppetRoomJoinEvent,
  // PuppetRoomLeaveEvent,
  // PuppetRoomTopicEvent,
  // Receiver,

  /**
   * Huan(202003): XXX_DICT
   *  The following two data structure is for the downstream
   *  to get a array of event string list.
   */
}                         from './schemas/puppet.js'

import type {
  PuppetImplementation,
}                         from './puppet.js'

export type {
  ContactPayload,
  ContactQueryFilter,
  EventDirtyPayload,
  EventDongPayload,
  EventErrorPayload,
  EventFriendshipPayload,
  EventHeartbeatPayload,
  EventLoginPayload,
  EventLogoutPayload,
  EventMessagePayload,
  EventReadyPayload,
  EventResetPayload,
  EventRoomInvitePayload,
  EventRoomJoinPayload,
  EventRoomLeavePayload,
  EventRoomTopicPayload,
  EventScanPayload,
  FriendshipAddOptions,
  FriendshipPayload,
  FriendshipPayloadConfirm,
  FriendshipPayloadReceive,
  FriendshipPayloadVerify,
  FriendshipSearchQueryFilter,
  MessagePayload,
  MessagePayloadBase,
  MessagePayloadRoom,
  MessagePayloadTo,
  MessageQueryFilter,
  MiniProgramPayload,
  PuppetEventName,
  PuppetImplementation,
  PuppetOptions,
  RoomInvitationPayload,
  RoomMemberPayload,
  RoomMemberQueryFilter,
  RoomPayload,
  RoomQueryFilter,
  UrlLinkPayload,
  CommentPayload,
  ListOption,
}

export {
  CHAT_EVENT_DICT,
  ContactGender,
  ContactType,
  FileBox,
  FileBoxType,
  FriendshipSceneType,
  FriendshipType,
  ImageType,
  instanceToClass,
  log,
  looseInstanceOfClass,
  MemoryCard,
  MessageType,
  PayloadType,
  PUPPET_EVENT_DICT,
  Puppet,
  ScanStatus,
  StateSwitch,
  throwUnsupportedError,
  VERSION,
  YOU,
}
