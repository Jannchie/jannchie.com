---
title: Golang 控制请求速率
createdAt: 2023-05-18T21:14:29+09:00
modifiedAt: 2023-05-18T21:43:45+09:00
tags: [Golang, 后端]
---

在现代的分布式系统中，控制请求速率是一项至关重要的任务。为了避免服务器过载、提高服务质量和防止恶意攻击，我们需要限制每秒钟处理的请求数量。golang.org/x/time/rate 是 Go 语言中一个功能强大的库，提供了对请求速率的灵活控制和管理。本文将介绍 golang.org/x/time/rate 的基本概念，并通过几个简单的使用用例展示其在实践中的应用。

<!--more-->

## 什么？

golang.org/x/time/rate 是 Go 语言标准库的一部分，它提供了一个灵活的接口和工具，用于限制和控制代码中的事件发生频率。它可以用于限制函数调用、HTTP 请求、数据库查询或任何需要限制速率的操作。

## 基本概念

在开始使用 golang.org/x/time/rate 之前，我们需要了解几个基本概念。

- Limiter（速率限制器）：Limiter 表示一个速率限制器，用于控制事件的发生速率。它可以限制每秒钟发生的事件数量，也可以限制每分钟、每小时或每天的事件数量。
- Rate（速率）：Rate 表示每秒钟允许的事件数量。它由单位时间内的事件数量和时间单位组成。例如，一个速率为 10 events/second 的 Rate 表示每秒钟允许处理 10 个事件。
- Burst（突发）：Burst 表示在突发情况下允许处理的事件数量。当超过 Rate 限制时，Limiter 会存储剩余的事件，以便在突发时处理。Burst 可以防止因瞬时请求量过大而导致的事件丢失。

## 使用用例

下面是几个简单的使用用例，展示了 golang.org/x/time/rate 的实际应用。

### 控制函数调用速率

假设我们有一个需要限制每秒钟调用次数的函数，可以使用 golang.org/x/time/rate 来实现速率限制。

```go
package main

import (
	"fmt"
	"golang.org/x/time/rate"
	"time"
)

func main() {
	limiter := rate.NewLimiter(rate.Every(time.Second), 2)

	for i := 0; i < 5; i++ {
		if limiter.Allow() {
			fmt.Println("Function called")
		} else {
			fmt.Println("Rate limit exceeded")
		}
		time.Sleep(200 * time.Millisecond)
	}
}
```

在上述示例中，我们创建了一个速率限制器，每秒钟允许调用 2 次函数。在循环中，我们通过调用 `limiter.Allow()` 来检查是否达到速率限制。如果允许调用，则打印 "Function called"，否则打印 "Rate limit exceeded"。

```txt
Function called
Function called
Rate limit exceeded
Function called
Rate limit exceeded
```

### 控制 HTTP 请求速率

对于需要控制 HTTP 请求速率的情况，可以将 golang.org/x/time/rate 与标准库中的 net/http 包结合使用。

```go
package main

import (
	"fmt"
	"golang.org/x/time/rate"
	"net/http"
	"time"
)

func main() {
	limiter := rate.NewLimiter(rate.Every(time.Second), 2)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if limiter.Allow() {
			fmt.Fprint(w, "Hello, World!")
		} else {
			http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
		}
	})

	http.ListenAndServe(":8080", nil)
}
```

在上述示例中，我们创建了一个速率限制器，每秒钟允许处理 2 个 HTTP 请求。在 HTTP 处理函数中，我们通过调用 `limiter.Allow()` 来检查是否达到速率限制。如果允许处理请求，则返回 "Hello, World!"，否则返回 HTTP 状态码 429（Too Many Requests）。

这只是 golang.org/x/time/rate 库的一小部分功能，你还可以根据具体需求进行更复杂的速率控制和应用场景。
