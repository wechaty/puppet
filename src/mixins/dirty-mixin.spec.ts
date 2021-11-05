#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
}           from 'tstest'

import type {
  DirtyMixin,
  ProtectedPropertyDirtyMixin,
}                               from './dirty-mixin.js'

test('ProtectedPropertyCacheMixin', async t => {
  type NotExistInMixin = Exclude<ProtectedPropertyDirtyMixin, keyof InstanceType<DirtyMixin>>
  type NotExistTest = NotExistInMixin extends never ? true : false

  const noOneLeft: NotExistTest = true
  t.ok(noOneLeft, 'should match Mixin properties for every protected property')
})
