简答题：1.对异步编程的理解
异步编程可以提高代码的执行效率，不用等待上面的任务执行完毕再执行
2.Eventloop的理解
监听调用栈和消息队列，一旦调用栈中所有的任务都结束了事件循环就会从消息队列中去除第一个回调函数然后到调用栈。消息队列发生变化就会吧第一个压入到调用栈。
3.消息队列  异步任务的回调放入消息队列，待办的执行表在消息队列中放入任务排队等待事件循环，依次执行消息队列里面的任务。
4.宏任务 微任务
宏任务指的是同步任务和一些异步的回调任务
微任务是指在当前任务结束后立即执行Promise回调作为微任务执行