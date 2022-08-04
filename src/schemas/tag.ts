enum TagEventType {
  TagCreate = 10,
  TagDelete = 11,
  TagRename = 12,
  TagGroupCreate = 20,
  TagGroupDelete = 21,
  TagGroupRename = 22,
}

enum TagType {
  Personal = 0,
  Corporation = 1,
}

export interface TagIdentifier {
  groupId?: string,
  id: string,
}

interface TagPayload extends TagIdentifier {
  name: string,
  type: TagType
}

interface TagGroupPayload {
  id: string,
  name: string,
}

export {
  type TagPayload,
  type TagGroupPayload,
  TagType,
  TagEventType,
}
