export interface RoomInvitationPayload {
  id           : string,
  inviterId    : string,
  topic        : string
  avatar       : string,
  invitation   : string,
  memberCount  : number,
  memberIdList : string[],   // Friends' Contact Id List of the Room
  timestamp    : number,     // Unix Timestamp, in seconds or milliseconds
  receiver     : string,     // the room invitation should send to which contact.
}
