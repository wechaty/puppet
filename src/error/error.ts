/**
 * [RFC] We need a better error system #159
 *  https://github.com/wechaty/puppet/issues/159
 */
import { log } from '../config.js'

import type { EcmaError }   from './ecma.js'
import { isEcmaError }      from './ecma.js'
import type { GrpcStatus }  from './grpc.js'
import {
  isGrpcStatus,
  Code,
}                           from './grpc.js'

const isPuppetError = (payload: any): payload is PuppetError => payload instanceof Object
  && isEcmaError(payload)
  && isGrpcStatus(payload)

class PuppetError extends Error implements GrpcStatus, EcmaError {

  code     : number
  details? : any[]

  /**
   * From a gRPC standard error
   *  Protobuf
   */
  public static fromJSON (payload: string | GrpcStatus | EcmaError) {
    log.verbose('PuppetError', 'from("%s")', JSON.stringify(payload))

    if (typeof payload === 'string') {
      payload = JSON.parse(payload)
    }

    if (!isEcmaError(payload) && !isGrpcStatus(payload)) {
      throw new Error('payload is neither EcmaError nor GrpcStatus')
    }

    const e = new this(payload)
    return e
  }

  protected constructor (
    payload: GrpcStatus | EcmaError,
  ) {
    super()
    log.verbose('PuppetError', 'constructor("%s")', JSON.stringify(payload))

    this.message = payload.message

    if (isPuppetError(payload)) {
      this.code    = payload.code
      this.details = payload.details
      this.name    = payload.name
      this.stack   = payload.stack
    } else if (isGrpcStatus(payload)) {
      this.code    = payload.code
      this.details = payload.details
      this.name    = Code[this.code] || String(this.code)
    } else if (isEcmaError(payload)) {
      this.code  = Code.UNKNOWN
      this.name  = payload.name
      this.stack = payload.stack
    } else {
      throw new Error('payload is neither EcmaError nor GrpcStatus')
    }
  }

  public toJSON (): GrpcStatus | EcmaError {
    return {
      code    : this.code,
      details : this.details,
      message : this.message,
      name    : this.name,
      stack   : this.stack,
    }
  }

}

export {
  PuppetError,
  isPuppetError,
  isGrpcStatus,
  isEcmaError,
}
