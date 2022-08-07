enum TagEventType {
  TagCreate = 0,
  TagDelete = 1,
  TagRename = 2,
}

enum TagGroupEventType {
  TagGroupCreate = 0,
  TagGroupDelete = 1,
  TagGroupRename = 2,
}

enum TagType {
  Unspecific = 0,
  Personal = 1,
  Corporation = 2,
}

export interface TagIdentifier {
  groupId?: string,
  id: string,
}

interface TagPayload extends TagIdentifier {
  name: string,
  type: TagType,
}

interface TagGroupPayload {
  id: string,
  name: string,
  type: TagType,
}

export {
  type TagPayload,
  type TagGroupPayload,
  TagType,
  TagEventType,
  TagGroupEventType,
}
