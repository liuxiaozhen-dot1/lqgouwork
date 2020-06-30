/*
1.创建Promise对象 Promise 就是一个类 在执行这个类的时候 需要传递一个执行器进去 执行器就会立即执行
2.有三种状态 成功（fulfilled） 失败（rejected） 等待 （pending）
只能从 pending->fulfilled 或者 pending->rejected 状态确定不能更改
3.resolve 和 reject 来记录状态  resolve: fulfilled  reject: rejected
4.then方法内部做的就是判断状态 如果是成功调用成功的回调函数 如果是失败就调用失败的回调函数 then方法是被定义在原型对象中的
5.then成功回调有一个参数表示成功之后的值 失败回调有一个参数表示失败的原因
6.解决异步问题 判断回调函数中状态为等待时  异步回调调用resolve 或者reject 时判断是否存在 成功或者失败回调
7.then方法是可以链式调用的  后面then方法拿到的值是上一个函数的返回值  then 方法返回Promise 
*/
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
value = undefined;  //成功的值
reson = undefined;  //失败的原因
successCallback = [];//成功的回调 使用数组存储多个回调函数 promise.then
failCallback = []; //失败的回调  使用数组存储多个回调函数 promise.then
class MyPromise {
  constructor(executor) {
    //捕获错误
    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }
  status = PENDING;
  resolve = value => {
    //如果状态不是等待阻止程序向下执行
    if (this.status !== PENDING) {
      return
    }
    //将状态更改为成功
    status = FULFILLED;
    //保存成功之后的值
    this.value = value
    //是否存在成功回调存在就去执行
    // this.successCallback && this.successCallback(this.value)
    //循环promise.then成功的回调函数
    while (this.successCallback.length) this.successCallback.shift()()
  }
  reject = reason => {
    if (this.status !== PENDING) {
      return
    }
    //将状态改为失败
    status = REJECTED;
    //保存失败之后的原因
    this.reason = reason
    //是否存在失败回调存在就去执行
    // this.failCallback = this.failCallback(this.reason)
    //循环promise.then失败的回调函数
    while (this.failCallback.length) this.failCallback.shift()()
  }
  then(successCallback, failCallback) {
    //判断有无参数的情况
    successCallback = successCallback ? successCallback : value => value;
    failCallback = failCallback ? failCallback : reason => { throw reason };
    //执行器 立即执行
    let promise2 = new Promise((resolve, reject) => {
      //判断状态
      if (this.status === FULFILLED) {
        // 下一个promise的返回值
        setTimeout(() => {
          //变成异步代码 获取 promise2
          try {
            let x = successCallback(this.value)
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0)
      } else if (this.status === REJECTED) {
        // 下一个promise的返回值
        setTimeout(() => {
          //变成异步代码 获取 promise2
          try {
            let x = failCallback(this.reason)
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0)
      } else {
        //等待
        //存储成功回调和失败回调
        this.successCallback = push(() => {
          setTimeout(() => {
            //变成异步代码 获取 promise2
            try {
              let x = successCallback(this.value)
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0)
        });
        this.failCallback = push(() => {
          setTimeout(() => {
            //变成异步代码 获取 promise2
            try {
              let x = failCallback(this.reason)
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0)
        });
      }
    });
    return promise2;
  }
  static all(array) {
    // 静态方法  接收一个数组作为参数
    //慧返回一个promise对象
    return new MyPromise((resolve, reject) => {
      //结果数组
      let result = [];
      let index = 0;
      function addData(key, value) {
        result[key] = value;
        index++;
        if (index === array.length) {
          resolve(result);
        }
      }
      // 循环数组 判断是普通值还是promise对象
      for (let i = 0; i < array.length; i++) {
        let current = array[i];// 当前值
        if (current instanceof MyPromise) {
          //promise对象
          current.then(value => addData(i, value), reason => reject(reason))
        } else {
          // 普通值
          addData(i, array[i]);
        }
      }
    })
  }
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise(resolve => resolve(value))
  }
  finally(callback) {
    return this.then((value) => {
      return MyPromise.resolve(callback().then(() => value))
    }, reason => {
      return MyPromise.resolve(callback()).then(() => { throw reason })
    })
  }
  catch(failCallback) {
    return this.then(undefined, failCallback)
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('循环调用'))
  }
  /*
     1.判断x的值是普通值还是promise对象
     2.如果是普通值直接调用resolve对象
     3.如果是promise对象查看promise对象的结果
     4.根据结果决定调用resolve还是reject
  */
  if (x instanceof MyPromise) {
    // 属于MyPromise  就是一个对象
    x.then(resolve, reject);
  } else {
    //普通值
    resolve(x);
  }
}