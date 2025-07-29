---
title: React 性能优化实践
createdAt: 2025-03-19T23:48:40+09:00
updatedAt: 2025-03-30T17:45:14+09:00
tags:
  - React
  - 前端
  - 性能优化
---

在 React 中，只要一个组件的 props、state、context 或者父组件变化，那么就重新渲染组件。这样很简洁，但也很难。

在 React，默认情况下，每次试图渲染组件都会执行（下图蓝色部分），只有部分被 useEffect、useMemo 等钩子包裹的代码能够根据依赖变化选择性地执行（黄色部分）。而 Vue 等一些其他框架，大部分业务逻辑会放在 setup 里只执行一次（绿色部分），而有些代码块在依赖变化时会重新执行（黄色部分）。

![React 和 Vue 的渲染对比](/imgs/react-performance-optimize/render-react-vs-vue.png)

这是两种不同的设计哲学，无法讨论优劣。不过我个人认为 React 更容易写出性能不好的代码。原因在于我们的业务逻辑往往会写在渲染函数里，而它很有可能会意外地执行多次。我们的业务逻辑很可能会包含一次性的计算密集型的任务，而我们不得不把这些一次性的代码放在潜在会运行多次的代码块中，一不小心多次执行它就可能就会严重拖慢页面速度。

许多人声称自己从未遇到过性能问题。确实，React 的渲染已经足够高效，它能够把多次 dom 操作打包成一个 commit，另外，即使组件需要重新渲染，React 会先比较虚拟 DOM 是否有变化，如果没变则会复用之前的 DOM，从而减少比较重的实际 DOM 操作（[Render and Commit – React](https://react.dev/learn/render-and-commit#step-3-react-commits-changes-to-the-dom)）。

因此我们大可以遵循克努特优化原则，如果没有性能问题，不要优化是一个更明智的选择，这让代码更简单，更容易理解。但有时性能问题确实会发生。例如，测试的时候使用的数据量过少；又或者是开发用设备性能强劲，远超用户的真实配置等等。如果已经进行了大量开发工作，然后突然发现网页性能很差，那么寻找这些性能瓶颈就成了一个有挑战性的任务。这里想简单讨论一些 React 性能优化相关的实践。

## 如何衡量性能问题？

我们首先需要知道哪里慢，最好还能知道现在有多慢，才能有效改进并评估性能。这里要推荐的第一个工具是浏览器自带的 DevTools 中的 Performance。

我相信有许多人并没有怎么用过它，它其实功能非常强大。

例如下面这个程序（[React Playground](https://reactplayground.vercel.app/#N4IgLgziBcBmCGAbCBTANCAbrK1QEsA7AExQA8A6AK1xHwFsAHAewCcwACAQUcY9lbN6HAOQUA9D0bUIZEQB1CDFuw4AlFPADGnAUNGtNOhUqZtOwDlsPwwKNc2acAvv0HCRNnQFpiQ8VqI+CiEYCaKWsyEEJyRofBEKKwcALwcfloArvQhYBQA5ihgAKKIKDmhAEIAngCSxAAUno5hAJQRUTEcgk6pVjZ2Dk4NcWAJhEnthD15hiRJDYoc6kZ51pp2peW5i4TLyxraeQDKYKz4OgCyzKRoS-uEmYiId3v7hzoU67YoWxVgDSkU2WU1aIAwUhkZBgdDMqg+YDQHEsmVQGlgSNRKFOP0xqGKsFgKB0HFcemE8hAXjAlIA3IoOtFOFI+g1WqkAHzI+5xLoAbTISNQYAAGgBdPpYnF2RYgSmtelvQxgTKsPa7fYcAA8HPumq1x0QzAA7gBhIQsCahDjiXVvfVERiZThgaqMFApSmPegAIySlI4UVNAAt4IRCilgA0UOyUlzhSLoxQxqxCnlMEhMjHXLa9drc28FYpnIrFLBMoQdPgohwsQAxfA+qLaLTB-ANQjs4D3ZWqvawRvNrRadudxXOBmEcuVsDVvaGk3msxWgFdnmdTiGCBPThpeuDwgttsNADMAA4i0qin3tRzgFud84tbbx5OyxWqzWB03D8PR2u3nwWAOA7bU0gARnZXs1Q4QhFWWaD+wPFtRw4bwOEgjgAGp+GQv9QPQgAmS8J0IRRyBUThSAQHduF4RUQGcZwgA)）：

```tsx
import React, { useEffect, useRef, useState } from 'react'

function App() {
  const [x, setX] = useState('')
  return (
    <>
      <SlowComponent />
      <input type="number" onChange={e => setX(e.target.value)} />
    </>
  )
}

function useFibonacchi(n) {
  return fibonacci(n)
}

function SlowComponent() {
  const result = useFibonacchi(38)
  return <>{result}</>
}

function fibonacci(n) {
  if (n <= 1) {
    return n
  }
  return fibonacci(n - 1) + fibonacci(n - 2)
}

export default App
```

我们可以开启录制，然后在 UI 中输入内容。取消录制后就能看到 Profile。

对 Profile 的结果，我们首先应该关注上方。我们可以清晰的看到 interactions 一栏里，有整个点击操作所造成的页面无响应时间（INP），达到 257ms。一般 200ms 以上就需要优化了。

::alert{type="info" title="Tips" content="通过观察 Profile，定量观察网页的响应速度成为可能。"}
::

Performance 更好的地方在于，它可以通过火焰图，分析哪些函数所执行的时间比较长。 在这个简单的例子里，可以看到绝大多数时间都是用来执行 fibonacci 这个函数了。因此我们的优化应该集中于它。

![性能火焰图](/imgs/react-performance-optimize/performance-flamegraph.png)

更进一步，此时我们可以在源代码页面中看到具体是哪一行代码运行得比较慢：

![有性能问题的代码](/imgs/react-performance-optimize/performance-code.png)

::alert{type="info" title="Tips" content="通过火焰图，能够快速定位出问题的代码。"}
::

在实际的项目里，点击按钮、输入内容、甚至是滚动页面，都有可能在各处触发各种各样的函数，其中有些函数可能不希望被触发，有些可能有优化的空间。

## 如何优化呢？

很容易就能发现，Slow Component 的渲染其实是和用户输入无关的，但由于父组件更新了，即使每次渲染内容都相同，渲染函数还是执行了。

说起优化方式，其实有很多选择，最简单的是 `useMemo`

1. 使用 `memo` 来包裹 `SlowComponent`。（[React Playground](https://reactplayground.vercel.app/#N4IgLgziBcBmCGAbCBTANCAbrK1QEsA7AExQA8A6AK1xHwFsAHAewCcwACAQUcY9lbN6HAOQUA9D0bUIZEQB1CDFuw4AlFPADGnAUNGtNOhUqZtOwDlsPwwKNc2acAvv0HCRNnQFpiQ8VqI+CiEYCaKWsyEEJyRofBEKKwcALwcfloArvQhYBQA5ihgAKKIKDmhAEIAngCSxAAUno5hAJQRUTEcgk6pVjZ2Dk4NcWAJhEnthD15hiRJDYoc6kZ51pp2peW5i4TLyxraeQDKYKz4OgCyzKRoS-uEmYiId3v7hzoU67YoWxVgDSkU2WU1aIAwUhkZBgdDMqg+YDQHEsmVQGlgSNRKFOP0xqGKsFgKB0eJQl3KzA4rj0wnkIC8YDpAG5FIpYJlCDp8FEOABhISMLgNVrI+5xLqGCBPThpLHk+jMBrC1IAPn4+AARlFtFp8A0AMwABlaSIA2gBdVost6GMCZVh7AA8KuAkulzkd4hV1ucrMI7M5YG5e35TEqDUsqDAAA0qSLgPdbfanURGJlOGBqowUCk6Y96BqknSOFFeQALeCEQopYANFAilJqqPRusUMasQp5TBITL11xen1+8WcKR9ZWN0VvYccU1kJHN819LE4uyLEB0q2JorJji7fYcZ33ffALisVjwaoUGkRjhlKtgMvQDgARkNhrjFHo8EYSoA+kj8AbNU933fZHVDQUOAAaxQaoa3wfsVSPfZWlaX03n3cCBUqDhmxrZtEOQz0kLeTdCGca02Q5LkeVgTVtS0XUGkIeN7nwWBdydNJnxFJMHQ4QhrWWPi9jorVCB1PU9m8F8RQAanVcTJOYjgZIAJjI9DFHIFROFIBBpW4XhrRAZxnCAA)）
2. `useMemo` 来缓存结果。（[React Playground](https://reactplayground.vercel.app/#N4IgLgziBcBmCGAbCBTANCAbrK1QEsA7AExQA8A6AK1xHwFsAHAewCcwACAQUcY9lbN6HAOQUA9D0bUIZEQB1CDFuw4AlFPADGnAUNGtNOhUqZtOwDlsPwwKNc2acAvv0HCRNnQFpiQ8VqI+CiEYCaKWsyEEJyRofBEKKwcALwcfloArvQhYBQA5ihgAKKIKDmhAEIAngCSxAAUno5hAJQRUTEcgk6pVjZ2Dk4NcWAJhEnthD15hiRJDYoc6kZ51pp2peW5i4TLyxraeQDKYKz4OgCyzKRoS-uEmYiId3v7hzoU67YoWxVgDSkU2WU1aIAwUhkZBgdDMqg+YDQHEsmVQGlgSNRKFOP0xqGKsFgKB0eJQl3KzA4rj0Hi8YUUDMIsEyhB0+CiHAAwkJGFwGq1gPc4l1DBAnpw0ljyfRmA1+SkAHz8fAAIyi2i0+AaAGYAAytJEAbQAusDukVMqw9gAeBXAUXi5zW8QKxTORnM1lgdl7blMSoNYCoMAADWcAvuhjAlptREYmU4YGqjBQKXkIEe9BVSXTHCinIAFvBCIUUsBUwrgyGGigKGNWIU8pgkJkUK1XC63YzhZwpH1+aklYK3j2OIayEiq8a+licXYmiIzVGYxxdvsOLb7uvh+v11xWKx4NUKDTAxwyiWwAXoBwAIy63VU1oUejwRhygD6SPwrUVG79vIcAA1ig1RlvgHYKma67um867WgBlQcFWZZVpBW4bp2bxTLBiiemyHKwKq6paJqDSEK0yL3PgsCrjaaS3pRy5WhwhAANyRhaLFEWqhAalqezeHelEANTKrx-HkRwQkAEytBxhC4RMZAqJwpAIOK3C8CAzjOEAA)）

不过许多人，例如 React 曾经的维护者 Dan，建议我们在使用 `useMemo` 之前，考虑用**状态下移**或者**内容提升**等方式来规避重复渲染。在这篇博客里，已经介绍得很清楚了 [Before You memo() — overreacted](https://overreacted.io/before-you-memo/)。

不过这种手法稍微有些高端，它需要重新考虑项目的结构。在一个依赖关系已经非常复杂的，很难应用上述这些优化方式重新设计。我们往往会回退到 `memo()` 这方式。

## memo() 的困境

看上去 `memo()` 也能完美解决问题。然而现实生活仍然没有这么简单。实际上记忆化的行为比想象中的要难以捉摸。关键在于它的依赖。举个例子，下面这段代码，`Comp` 中被记忆的 t 输出一个时间戳，它的依赖是 a, b, c 三个变量，而这三个变量来自于三个不同的 hooks，由于这些 hooks 没有其他依赖，它们看上去返回值是“不会变”的。而点击 Rerender 按钮，会更新 state x 导致父组件重渲染。我们希望 Comp 不重新渲染，因此我们加上了 memo 包裹它。现在，点击 Rerender 按钮，`Comp` 渲染出的时间会变化吗（会重新渲染吗）？（[React Playground](https://reactplayground.vercel.app/#N4IgLgziBcBmCGAbCBTANCAbrK1QEsA7AExQA8A6AK1xHwFsAHAewCcwACAQUcY9lbN6HAOQUA9D0bUIZEQB1CDFuw4AlFPADGnAUNGtNOhUqZtOwDlsPwwKNc2acAvv0HCRNnQFpiQ8VqI+CiEYCaKWsyEEJyRofBEKKwcALwcfloArvQhYBQA5ihgAKKIKDmhAEIAngCSxAAUno5hAJQRUTEcgk6pVjZ2Dk4NcWAJhEnthD15hiRJDYoc6kZ51pp2peW5i4TLyxraeQDKYKz4OgCyzKRoS-uEmYiId3v7hzoU67YoWxVgDSkU2WU1aIAwUhkZBgdDMqg+YDQHEsmVQl3KzCRqJQpx+SJy9GYHFcemE8hAXjA5IA3IpFLBMoQdPgohxsVwGq1kfdDGBMqw9sBnLTCM46YQGUywCy9tjKpzuW9efy9gBGEViwj0xnM1nYgDCCuAPKKKrZaIxDQVKQAfBwGkLWkiANoAXVaGvFcS6+qEfDSBOYVss8CRACMkVpiVzbYrlt7OJw0gA5bJhhYTADuHAAIj9OR6TXyBRwADzEfCYG3AAAGABJgGBXA34M3gGG21pnDXnKXxBWqxrC4RfUwKBWIIxEPBqsn4Dk+uTR4waV7OpwpH1rXbjW8Exx4H12ZyRfH1xww0fUPLh2forEryhDberOfnWQkagwAANV2P3F2A0AAML7KiWuz7GWA42vckGlmGmRgGAUSwZBHBRPqQRaAA1ikwDbnGaGQV+34NGQHAANQcKqL5Ec4mpETBbxERocykKwqHLH2CFIVETFEaWy4HnhrYXnhHZWHhXYcOI-H7H20H3MOwqKOQKicKQCBPBuvAiiA9FAA)）

```jsx
// 试图使用 memo 记忆组件
const Comp = memo(({ a, b, c }) => {
  const t = Date.now()
  return <div>{`${t} ${a} ${b} ${c}`}</div>
})

function App() {
  // 三个 Hook 没有其他依赖，重新渲染时返回值看似相同
  const a = useA()
  const b = useB()
  const c = useC()

  const [x, setX] = useState(0)
  return (
    <div>
      <button
        onClick={() => {
          setX(x + 1)
        }}
      >
        Rerender
      </button>
      {/** 每次渲染 props 不变 */}
      <Comp a={a} b={b} c={c} />
    </div>
  )
}
```

答案是，**无法判断**。这需要取决于 a, b, c 三个变量究竟是怎么来的。

这里有一个细节是，react 中，依赖数组使用 `Object.is` 来判断依赖有没有变化。而引用对象诸如数组和对象，只有引用完全相同返回才为 `true`。

```js
Object.is('a', 'a') // true，基本类型可以通过 is 判断是否相等

const a = {}
const b = a
Object.is(a, b) // true // 引用类型如果引用同一个 object，则相同
object.is(a, {}) // false // 如果不是同一个 object 则为不相同
```

考虑 `useA`，`useB` 和 `useC` 分别是这样定义的：

```jsx
function useA() {
  return {}
}

function useB() {
  return 1
}

function useC() {
  return useMemo(() => ({}), [])
}
```

每一个 hook 每次都会重新执行，`useA` 在每次渲染时，都会返回一个空对象，重点在于，它是全新的，因此依赖 `a` **会**导致重新渲染。

而对于 `useB` 而言，它返回的是非引用数据，使用 Object.is(1, 1) 来比较，结果完全相同，因此依赖 `b` **不会**重新渲染。

最后，`useC` 虽然也返回一个空数组，但是它是被另一个 `useMemo` 记忆化的，只要依赖数组不变，变量 `c` 依旧是那个变量，**不会**重新渲染。

因此就能发现。依赖的变量，当它是一个引用对象的时候，从外观上根本无法分辨是否符合预期，是稳定的。

甚至第三方库也会有这样的陷阱。例如常用的 `@tanstack/query`。下面这段代码中，`query` 这个对象不是记忆化的，而 `query.data` 是记忆化的。如果此时在 `useMemo` 里进行了复杂的处理，可能会有性能问题。

```jsx
function Comp() {
  const query = useQuery({}) // query 是不稳定的
  const data = useMemo(() => {
    if (query.isLoading) {
      return []
    }
    return query.data
  }, [query]) // 这里，每次计算，返回的都是不同的 query。应该改成 [query.isLoading, query.data]
  return <>{data}</>
}
```

排查这样的问题很痛苦。一不小心，依赖了一个未被记忆化的函数或者对象，memo 就无法成立。

## 怎么破？

有很多工具能够分析这样的错误。比如 React 的官方 Devtools chrome 插件。

我尝试过 react devtool 的官方 chrome 插件。它有一个 Profile 工具，但我不是很推荐这个插件。它很慢，而且不是特别稳定经常会卡死或者加载不出来。我更推荐 [React Scan](https://react-scan.com/)。

React Scan 提供了一个悬浮窗，可以选择一个组件，查看其变化的原因。

我们查看这个时间戳所在的组件，观察悬浮窗可以看到，这个组件被渲染的原因是 Props 发生了变化，其中 `a` 这个 prop 变了，并且它变前变后，虽然不是同一个 object，但内容其实是一样的。这暗示我们应该在 useA 中记忆化返回值，从而防止依赖 `a` 变量的组件重新渲染。

![能被记忆化的属性](/imgs/react-performance-optimize/can-be-memo-prop.png)

::alert{type="info" title="Tips" content="使用 React Scan，能够得知一个组件重新渲染的原因。极大程度帮助我们定位问题。"}
::

---

## 另一种性能问题

React Scan 还能排查渲染到真实 DOM 时的性能问题。这对于 Chrome 的 Performance 工具来说比较难处理。因为耗时的地方在 React 内部的 Commit 操作，或是其他组件库的操作，而不是自己的代码。

比如大家都爱用的 Mantine 中，有一个名为 Tooltip 的组件。它其实渲染得比较慢。像这样，朴实地渲染 200 个元素，FPS 就降低到了 1，而去掉这个 Tooltip 则没事。

```jsx
import { Button, Tooltip } from '@mantine/core'

function App() {
  return (
    <>
      {
        Array.from({ length: 200 }, (_, i) => (
          <Tooltip key={i} label={`Tooltip ${i}`}>
            <Button>Button with tooltip</Button>
          </Tooltip>
        ))
      }
    </>
  )
}
export default App
```

这个事实比较反直觉，因为表面上 tooltip 在不 hover 的时候是不会显示，但它也会拖慢网站速度。使用 React Scan 能够察觉这样的性能问题。

![Mantine 的 Tooltip 组件相对较慢](/imgs/react-performance-optimize/mantine-tooltip-is-slow.png)

想要解决这个问题，我们需要条件渲染，在 hover 按钮的时候才渲染 tooltip 组件。

---

React Scan 还能用来解决多次渲染的问题。通常我们应该避免使用 useEffect 来设置 state，下面是一个典型错误例子（[React Playground](https://reactplayground.vercel.app/#N4IgLgziBcBmCGAbCBTANCAbrK1QEsA7AExQA8A6AK1xHwFsAHAewCcwACAQUcY9lbN6HAOQUA9D0bUIZEQB1CDFuw4AlFPADGnAUNGtNOhUqZtOwDlsPwwKNc2acAvv0HCRNnQFpiQ8VqI+CiEYCaKWsyEEJyRofBEKKwcALwcfloArvQhYBQA5ihgAKKIKDmhAEIAngCSxAAUno5hAJQRUTEcgk6pVjZ2Dk4NcWAJhEnthD15hiRJDYoc6kZ51pp2peW5i4TLyxraeQDKYKz4OgCyzKRoS-uEmYiId3v7hzoU67YoWxVgDSkU2WU1aIAwUhkZBgdDMqg+YDQHEsmVQxVgsBQOiRqJQpx+rj0Hi8YUUilgmUIOnwUQ4AGEhIwGq1kfc4l0ANrwJGoMBcAC6fVx+LsDQADK0ANxszqcDkAIx5RUqgrSwrGool0re7LlWiVYDpqo46p+4ql93uuPRmJ0DWZKQAfMB7vteZUGvAWfdnGgufypla0RisQCHc7XRxeXSGvLgRxfQqA2S3oYwJlWHtdvsOAAeYj4TCOyPLXPyzJgMC0qJ0oJaADWKWA4d5XE9AGoAIytZyO2sXeu58TlytRYtvHO5xh95iUsDQZFaZxD6eRocFov3C2EZwp3XcXh9ZmpR2s1NFDNZtcb8c50sMpgccS3-brwsvqa7wiKcgqTikBAnk4KQQGcZwgA)）

```jsx
import React, { useEffect, useState } from 'react'

function Comp() {
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  const [c, setC] = useState(0)

  useEffect(() => {
    setB(a)
  }, [a])

  useEffect(() => {
    setC(b)
  }, [b])

  return (
    <div>
      <button onClick={() => setA(a + 1)}>Click</button>
      <p>
        Count:
        {c}
      </p>
    </div>
  )
}

function App() {
  return (
    <div>
      <Comp />
    </div>
  )
}

export default App
```

在这个例子中，点击按钮会设置 a，然后通过 useEffect 设置了 b，又通过 useEffect 设置了 c，因而一次更新，这个组件就渲染了 3 次，性能立即下降三倍。这样的组件一多，就算没有什么繁重的操作，网站的性能也会变差。

使用 react scan，就能看出这样的一次操作，多次渲染的组件。

![多次渲染组件的问题](/imgs/react-performance-optimize/render-multiple-times.png)

## 别自己动手？

回到我们刚才讨论的记忆化的问题。我们可以发现，难点主要在于，对于调用者，很难知道自己依赖的对象是否被记忆化了。而一个轻量级的 object 很可能被一个重量级的计算所依赖，导致 memo 失效。似乎没有什么办法，除非，我们规定所有可能被别人使用的对象都要记忆化？

很多人担心这样反而有性能问题，因为记忆也是有成本的，记忆一个非常简单的东西可能会降低性能。虽然记忆一个简单的东西可能会略微降低性能。但这种损失几乎可以忽略不计，而一旦有一处性能瓶颈得以释放，则会大大提高整体性能。因此总体上来说，不管三七二十一直接 `memo` 也是一种可以接受的做法。

实际上 React 团队早就在做这件事了。 不过，这个课题似乎比预想中要困难。至少四年前，React 团队就公布了一个叫 React Forget 的项目，它试图自动地给每一个组件和函数定义添加记忆化。

我原以为它已经被 React 团队彻底 Forget 了，甚至 reddit 有一个这样的问题： [Did the React team forget the React Forget compiler? : r/reactjs](https://www.reddit.com/r/reactjs/comments/16nnh4z/did_the_react_team_forget_the_react_forget/)，然而在 React 19 中，它以 [React Compiler](https://react.dev/learn/react-compiler) 为名，虽然还在 beta 测试，但终于可用了。它会分析你的代码，然后自动在可以 `memo` 的地方自动记忆化，从而告别手动分析。

我进行了一些试用，它确实能够极大地加速一个未被优化过的项目。然而它也有一些问题。首先它只支持 babel，不支持 swc，意味着打包速度会有所下降。另外，虽然据说在 meta 内部， complier 已经广泛被使用了，但在少见场合下，react compiler 处理过的代码会和期望的不一致。它值得一试，不过可能有一些小小的风险。

## 总结

讲了许多杂七杂八的东西，实际上想和大家分享的其实是这些：

1. **诊断工具链：**
	- 从浏览器 **Performance** 工具入手，能够进行宏观的性能检查与评估。
	- 利用 **React Scan** 进行细粒度分析，可以定位问题组件并探究其重渲染的具体诱因。
2. **`memo` 使用策略：**
	- **结构优先：** 在诉诸 `memo` 前，优先考虑通过组件结构调整来避免不必要的渲染。
	- **依赖稳定性：** 当 `memo` 未按预期工作时，仔细检查依赖数组中的元素（特别是引用类型）是否真正保持稳定。
	- **自动化：** 关注 **React Compiler** 的进展，它可以自动处理许多记忆化优化。
