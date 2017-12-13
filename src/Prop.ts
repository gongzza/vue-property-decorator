import Vue, { PropOptions } from 'vue'
import { createDecorator } from 'vue-class-component'
import 'reflect-metadata'

export type Constructor = {
  new(...args: any[]): any
}

/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
function makeProp(options: (PropOptions | Constructor[] | Constructor) = {}): PropertyDecorator {
  return function (target: Vue, key: string) {
    if (!Array.isArray(options) && typeof (options as PropOptions).type === 'undefined') {
      (options as PropOptions).type = Reflect.getMetadata('design:type', target, key)
    }
    createDecorator((componentOptions, k) => {
      (componentOptions.props || (componentOptions.props = {}) as any)[k] = options
    })(target, key)
  }
}

function Prop(proto: Vue, key: string): void
function Prop(options: any): PropertyDecorator
function Prop(a: Vue | any, b?: string): PropertyDecorator | void {
  if (typeof b === 'string') {
    const key: string = b
    const proto: Vue = a
    return makeProp()(proto, key)
  } else {
    return makeProp( typeof a === 'object' ? a : {default: a})
  }
}

export default Prop
