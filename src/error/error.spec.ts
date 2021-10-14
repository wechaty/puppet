#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'

import { PuppetError } from './error.js'
import { Code } from './grpc.js'

test('PuppetError class smoke testing', async t => {
  const MESSAGE = 'test'
  const error = PuppetError.fromJSON(new Error(MESSAGE))

  t.equal(error.code, Code.UNKNOWN, 'should be default code UNKNOWN')
  t.equal(error.message, MESSAGE, 'should set message')
})
