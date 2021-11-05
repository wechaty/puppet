#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import {
  test,
}           from 'tstest'
import { PuppetSkelton } from '../puppet/puppet-skelton.js'

import type {
  MemoryMixin,
  ProtectedPropertyMemoryMixin,
}                                   from './memory-mixin.js'
import {
  memoryMixin,
}                                   from './memory-mixin.js'

test('ProtectedPropertyMemoryMixin', async t => {
  type NotExistInMixin = Exclude<ProtectedPropertyMemoryMixin, keyof InstanceType<MemoryMixin>>
  type NotExistTest = NotExistInMixin extends never ? true : false

  const noOneLeft: NotExistTest = true
  t.ok(noOneLeft, 'should match Mixin properties for every protected property')
})

test('MemoryMixin', async t => {
  const Test = class extends memoryMixin(PuppetSkelton) {}

  const test = new Test()
  t.ok(test.memory, 'should has memory')
  t.notOk(test.memory.name, 'should has no memory name')

  const memoryGet = () => test.memory.get('test')

  await t.rejects(memoryGet, 'should reject get() before memory.load()')
  await test.start()
  await t.resolves(memoryGet, 'should resolve get() after memory.load()')
})
