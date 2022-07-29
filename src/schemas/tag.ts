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
}
