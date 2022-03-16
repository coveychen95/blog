# 从类式编程平滑过渡到@vue/composition-api

### 前言

`Vue3` 已成为`core`版本，声明式 `UI` 大行其道。但是项目组还不能使用起来，很是难受，现在终于把`composition-api` 给引入了，有时间写了下

### 问题

为什么不直接使用vue3 ？

1. 因为是历史项目直接升级，成本太大
2. proxy 的兼容性问题，虽然绝大部分浏览器已经适配，但是这一丁点的用户老板也不会丢的
   所以 @vue/composition-api 就成为了相当不错的过渡方案，话不多说，开整。

### 安装@vue/composition-api

直接上官方：https://github.com/vuejs/composition-api/blob/main/README.zh-CN.md

### 万恶之源 setup

要使用 `composition-api` 必须在 `setup` 里面，而声明式`UI`最大的特点就是函数式编程，所以相对比之前的类式编程，没有了 `this ` ，也就没有了 `data` `methods` `computed`  ... 。深的就不说了，本篇文章使用为主。

为了使读者平滑过渡，使用与 类式编程 对比的使用方法：

### 没有了 data 如何声明一个响应式变量

我们可以通过  `ref`  和 `reactive ` 声明一个响应式变量，本质上来说他两都是一样的，因为 `proxy` 监听的是对象， 所以 `ref(false)` 其实就是 `reactive({value: false})`。切记使用 ref 的时候记得别忘了通过 `.value` 的形式去获取值（这点是真的反人类）。

```javascript
import { ref, reactive, defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {
    
    const bool = ref(false)
    // 注意不要忘了 .value
    bool.value = true

    const per = reactive({
      name: 'Bob',
      age: 18
    })
    per.age = 20
    
    return { bool, per }
  },
});
```

### 没有 methods 之后呢

所有的函数直接在 setup 里面定义，直接使用

```javascript
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {
    
    const bool = ref(false)
    
    const setBool = () => {
      bool.value = !bool.value
    }
    
    return { bool }
  },
});
```

###  props $emit $router $store 跑到哪里去了

```````javascript
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    name: String
  },
  setup(props, {emit, root}) {
    // 拿到 props 里的值
    const { name } = props
    
    // 从 根组件 拿到 $store, $router
    const { $store, $router } = root
    
    // emit 触发父组件事件
    emit('start', name)
    return {}
  },
});
```````

### computed watch 的变化

```javascript
import { watch, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const num = ref(0)
    const str = ref('')
    // 监听
    watch(num, (val, old) => {
      console.log(val, old)
    })
    // 监听多个数据源
    watch([num, str], ([val1, val2], [old1, old2]) => {
      console.log(val, old)
    })
    
    // 计算
    const newStr = computed(() => `this is str: ${str.value}`)
    return {
      num,
      str,
      newStr
    }
  },
});
```

生命周期呢

| 选项式 API        | Hook inside `setup` |
| ----------------- | ------------------- |
| `beforeCreate`    | Not needed*         |
| `created`         | Not needed*         |
| `beforeMount`     | `onBeforeMount`     |
| `mounted`         | `onMounted`         |
| `beforeUpdate`    | `onBeforeUpdate`    |
| `updated`         | `onUpdated`         |
| `beforeUnmount`   | `onBeforeUnmount`   |
| `unmounted`       | `onUnmounted`       |
| `errorCaptured`   | `onErrorCaptured`   |
| `renderTracked`   | `onRenderTracked`   |
| `renderTriggered` | `onRenderTriggered` |
| `activated`       | `onActivated`       |
| `deactivated`     | `onDeactivated`     |

好了， 以上内容已经满足基本开发需求了，其他的 hooks 的好处，很多文档也都有提到，就不细数了，这篇文章只做简单工作。over