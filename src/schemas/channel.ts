export interface ChannelPayload {
  avatar: string,
  coverUrl: string,
  desc: string,
  extras: string,
  feedType: number,
  nickname: string,
  thumbUrl: string,
  url: string,
  objectId?: string,
  objectNonceId?: string,
}

export enum ChannelType {
  Unknown = 0,
  Photo = 2,
  Video = 4,
  Live = 9,
}
