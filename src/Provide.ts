import Vue, { PropOptions } from 'vue'
import { createDecorator } from 'vue-class-component'
import 'reflect-metadata'

type Key = string | symbol

function makeProvide(key?: Key): PropertyDecorator {
  return createDecorator((componentOptions, k) => {
    let provide: any = componentOptions.provide
    if (typeof provide !== 'function' || !provide.managed) {
      const original = componentOptions.provide
      provide = componentOptions.provide = function (this: any) {
        let rv = Object.create((typeof original === 'function' ? original.call(this) : original) || null)
        for (let i in provide.managed) rv[provide.managed[i]] = this[i]
        return rv
      }
      provide.managed = {}
    }
    provide.managed[k] = key || k
  })
}

function Provide(proto: Vue, key: string): void
function Provide(key?: string | symbol): PropertyDecorator
function Provide(a?: Vue | Key, b?: string): PropertyDecorator | void {
  if (typeof b === 'string') {
    const key: string = b
    const proto: Vue = a as Vue
    return makeProvide()(proto, key)
  } else {
    return makeProvide(a as Key)
  }
}

export default Provide
