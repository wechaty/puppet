import { log } from 'brolog'
import { FileBox } from 'file-box'
import { MemoryCard } from 'memory-card'
import { StateSwitch } from 'state-switch'

import { VERSION } from './version'

const logLevel = process.env['WECHATY_LOG']
if (logLevel) {
  log.level(logLevel.toLowerCase() as any)
  log.silly('Puppet', 'Config: WECHATY_LOG set level to %s', logLevel)
}

const CONTACT_CACHE_SIZE = process.env['CONTACT_CACHE_SIZE'] || '3000'
const FRIENDSHIP_CACHE_SIZE = process.env['FRIENDSHIP_CACHE_SIZE'] || '20'
const MESSAGE_CACHE_SIZE = process.env['MESSAGE_CACHE_SIZE'] || '50'
const ROOM_CACHE_SIZE = process.env['ROOM_CACHE_SIZE'] || '50'
const ROOM_INVITATION_CACHE_SIZE = process.env['ROOM_INVITATION_CACHE_SIZE'] || '20'
const ROOM_MEMBER_CACHE_SIZE = process.env['ROOM_MEMBER_CACHE_SIZE'] || '2000'

export {
  log,
  FileBox,
  MemoryCard,
  StateSwitch,
  VERSION,
  CONTACT_CACHE_SIZE,
  FRIENDSHIP_CACHE_SIZE,
  MESSAGE_CACHE_SIZE,
  ROOM_CACHE_SIZE,
  ROOM_INVITATION_CACHE_SIZE,
  ROOM_MEMBER_CACHE_SIZE,
}
