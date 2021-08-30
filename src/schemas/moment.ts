import { FileBox } from '../config'
import { UrlLinkPayload } from './url-link'

export interface MomentPayload {
  authorId: string,
  content?: string,
  urlLink?: UrlLinkPayload,
  images?: FileBox[],
  momentId: string,
  createTime: number,
  updateTime: number,
}
