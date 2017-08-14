import * as Vue from 'vue'
import { Component, Inject, Model, Prop, Provide, Watch } from '../src/vue-property-decorator'
import test from 'ava'

test('@Inject decorator test', t => {
  const s = Symbol()
  @Component({
    provide() {
      return {
        [s]: 'one',
        bar: 'two'
      }
    }
  })
  class Parent extends Vue {
  }

  const parent = new Parent()

  @Component
  class Child extends Vue {
    @Inject(s) foo: string
    @Inject bar: string
  }

  const child = new Child({ parent })
  t.is(child.foo, 'one')
  t.is(child.bar, 'two')

  @Component
  class GrandChild extends Vue {
    @Inject(s) foo: string
    @Inject bar: string
  }

  const grandChild = new GrandChild({ parent: child })
  t.is(grandChild.foo, 'one')
  t.is(grandChild.bar, 'two')
})

test('@Model decorator test', t => {
  {
    @Component
    class Test extends Vue {
      @Model
      checked: boolean
    }

    const { $options } = new Test()
    t.deepEqual($options.model, { prop: 'checked', event: 'checked' })
  }

  {
    @Component
    class Test extends Vue {
      @Model('change')
      checked: boolean
    }

    const { $options } = new Test()
    t.deepEqual($options.model, { prop: 'checked', event: 'change' })
  }
})

test('@Prop decorator test', t => {
  @Component
  class Test extends Vue {

    @Prop propA: number
    @Prop('propB') propB: string
    @Prop([Boolean, String]) propC: boolean | string
    @Prop({ type: null }) propD: any
    @Prop propE: boolean
  }

  const { $options } = new Test()
  const { props } = $options
  if (!(props instanceof Array)) {
    t.deepEqual(props!['propA'], { type: Number })
    t.deepEqual(props!['propB'], { type: String, default: 'propB' })
    t.deepEqual(props!['propC'], { type: [Boolean, String] })
    t.deepEqual(props!['propD'], { type: null })
    t.deepEqual(props!['propE'], { type: Boolean })
  }

  const test = new Test({ propsData: { propA: 10 } })
  t.is(test.propA, 10)
  t.is(test.propB, 'propB')
})

test('@Provide decorator test', t => {
  {
    @Component
    class Parent extends Vue {
      @Provide one = 'one'
      @Provide('two') twelve = 'two'
    }

    const parent = new Parent()

    @Component
    class Child extends Vue {
      @Inject one: string
      @Inject two: string
    }

    const child = new Child({ parent })

    t.is(child.one, 'one')
    t.is(child.two, 'two')
  }

  {
    @Component({
      provide: {
        zero: 'zero'
      }
    })
    class Parent extends Vue {
      @Provide one = 'one'
      @Provide('two') twelve = 'two'
    }

    const parent = new Parent()

    @Component
    class Child extends Vue {
      @Inject zero: string
      @Inject one: string
      @Inject two: string
    }

    const child = new Child({ parent })

    t.is(child.zero, 'zero')
    t.is(child.one, 'one')
    t.is(child.two, 'two')
  }

  {
    @Component({
      provide() {
        return {
          zero: 'zero'
        }
      }
    })
    class Parent extends Vue {
      @Provide one = 'one'
      @Provide('two') twelve = 'two'
    }

    const parent = new Parent()

    @Component
    class Child extends Vue {
      @Inject zero: string
      @Inject one: string
      @Inject two: string
    }

    const child = new Child({ parent })

    t.is(child.zero, 'zero')
    t.is(child.one, 'one')
    t.is(child.two, 'two')
  }
})

test('@Watch decorator test', t => {
  let num = 0

  @Component
  class Test extends Vue {
    moreExpression = false

    @Watch('expression')
    @Watch('moreExpression', { immediate: true })
    method() {
      num = 1
    }
  }

  const { $options } = new Test()
  t.is(($options.watch!['expression'] as any).handler, 'method')
  t.is(($options.watch!['moreExpression'] as any).immediate, true)

  const test = new Test()

  test.moreExpression = true

  t.is(num, 1)
})
