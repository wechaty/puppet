enum TagType {
  Personal = 0,
  Corporation = 1,
}

interface TagPayload {
  id: string,
  name: string,
  groupId?: string,
  type: TagType
}

interface TagGroupPayload {
  id: string,
  name: string,
}

export interface TagIdentifier {
  tagGroupId?: string,
  tagId: string,
}

export {
  type TagPayload,
  type TagGroupPayload,
  TagType,
}
