enum TagEventType {
  TagCreate = 0,
  TagDelete = 1,
  TagRename = 2,
}

enum TagGroupEventType {
  TagGroupCreate = 10,
  TagGroupDelete = 11,
  TagGroupRename = 12,
}

enum TagType {
  Unspecific = 0,
  Personal = 1,
  Corporation = 2,
}

interface TagPayload {
  id: string,
  groupId?: string,
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
