export interface MiniProgramPayload {
    appid?          : string,    // optional, appid, get from wechat (mp.weixin.qq.com)
    description?    : string,    // optional, mini program title
    pagepath?       : string,    // optional, mini program page path
    thumbnailurl?   : string,    // optional, default picture, convert to thumbnail
    title?          : string,    // optional, mini program title
    username?       : string,    // original ID, get from wechat (mp.weixin.qq.com)
    thumbkey?       : string,    // original, thumbnailurl and thumbkey will make the headphoto of mini-program better
}
