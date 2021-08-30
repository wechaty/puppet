import { FileBox } from '../config'
import { UrlLinkPayload } from './url-link'

export interface MomentPayload {
  authorId: string,
  content?: string,
  urlLink?: UrlLinkPayload,
  images?: FileBox[],
  id: string,
  createTime: number,
  updateTime: number,
}

export interface MomentListOption {
  authorId?: string,
  momentId?: string,
  page?: number,
}
