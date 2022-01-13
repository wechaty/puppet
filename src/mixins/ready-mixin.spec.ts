#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
} from 'tstest'

import type {
  ReadyMixin,
  ProtectedPropertyReadyMixin,
} from './ready-mixin.js'

test('ProtectedPropertyReadyMixin', async t => {
  type NotExistInMixin = Exclude<ProtectedPropertyReadyMixin, keyof InstanceType<ReadyMixin>>
  type NotExistTest = NotExistInMixin extends never ? true : false

  const noOneLeft: NotExistTest = true
  t.ok(noOneLeft, 'should match Mixin properties for every protected property')
})
