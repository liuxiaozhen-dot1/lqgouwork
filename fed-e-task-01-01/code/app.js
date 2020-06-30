
//1. 使用Promise方式改进
// function promise(str) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(str)
//     }, 10)
//   })
// }

// async function showStr() {
//   let a = await promise('hello')
//   let b = await promise('lagou')
//   let c = await promise('IU')
//   console.log(a + b + c)
// }
// showStr()



// // 1.练习1.函数组合fp.flowRight()实现
const fp = require('lodash/fp')
function isLastInStock(cars) {
  return fp.flowRight(fp.prop('in_stock', fp.last(cars)))
}
let a = isLastInStock(cars)

// //2.练习2.使用fp.flowRight() fp.prop() fp.first() 获取第一个car的name
function firstCar(cars) {
  return fp.flowRight(fp.prop('name', fp.first(cars[0])))
}
let b = firstCar(cars)
// // //3.练习3. 使用帮助函数_avarge重构 avargeDollarValue 使用函数组合的方法实现
function avargeDollarValue(cars) {
  return fp.flowRight(_avarge, fp.map(cars => cars.dollar_value))
}
let c = avargeDollarValue(cars)
//练习4   sanitizeNames(["Hello World"]=>['hello_world'])
let _underscore = fp.replace(/\W+/g, '_')
function sanitizeNames(cars) {
  return fp.flowRight(fp.map(_underscore), fp.map(cars => cars.name))
}
let d = sanitizeNames(cars)

//三 练习1 使用fp.add(x,y) 和 fp.map(f,x)创建一个能让functor 里的值增加的函数ex1
class Maybe {
  static of(x) {
    return new Maybe(x)
  }
  isNothing() {
    return this._value === null || this._value === undefined
  }
  constructor(x) {
    this._value = x
  }
  map(fn) {
    return this.isNotihing() ? this : Maybe.of(fn(this._value))
  }
}
class Container {
  static of(value) {
    return new Container(value)
  }
  constructor(value) {
    this._value = value
  }
  map(fn) {
    return Container.of(fn(this._value))
  }
}
let maybe = Maybe.of([5, 6, 1])
let ex1 = () => {
  return maybe.map(value => fp.map(fp.add(1), value))
}
//练习2 获取列表的第一个元素
let xs = Container.of(['do', 'ray', 'fa', 'so'])
let ex2 = () => {
  return xs.map(value => fp.first(value))
}
//练习3 实现一个函数ex3 使用safeProp和 fp.first 找到user的名字和首字母
let sateProp = fp.curry(function (x, o) {
  return Maybe.of(o[x])
})
let user = { id: 2, name: 'Albert' }
let ex3 = () => {
  return fp.flowRight(fp.first(user.name), safeProp('name'))
}
//使用Maybe重写ex4 不要有if语句
// let ex4 = function (n) {
//   if (n) {
//     return parseInt(n)
//   }
// }
let ex4 = () => {
  return fp.flowRight(fp.map(parseInt), Maybe.of)
}