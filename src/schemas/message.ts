export enum MessageType {
  Unknown = 0,
  Attachment,
  Audio,
  Contact,
  Emoticon,
  Image,
  Text,
  Video,
  Link,
}

/** @hidden */
export interface MessagePayloadBase {
  id            : string,
  contactId?    : string,        // Contact ShareCard
  filename?     : string,
  text?         : string,
  timestamp     : number,        // Unix Timestamp(in seconds)
  type          : MessageType,
  linkPayload?  : LinkPayload,
}

/** @hidden */
export interface MessagePayloadRoom {
  fromId?        : string,
  // mentionIdList? : string[],   // Mentioned Contacts' Ids
  roomId         : string,
  toId?          : string,     // if to is not set, then room must be set
}

/** @hidden */
export interface MessagePayloadTo {
  fromId  : string,
  roomId? : string,
  toId    : string,   // if to is not set, then room must be set
}

export enum AppType {
  Link = 5,
  File = 6,
  ChatHistory = 19,
  MiniProgram = 33,
}

export interface LinkPayload {
  des?: string,
  thumburl?: string
  title: string,
  url: string,
}

export type MessagePayload = MessagePayloadBase
                            & (
                                MessagePayloadRoom
                              | MessagePayloadTo
                            )
