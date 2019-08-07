// 布尔值
// let isDone: boolean = true;
// tslint 抛出错误的原因是： 根据true可以推断出isDone的类型
let isDone = true;
let isBol: Boolean = new Boolean(1);
let isb: boolean = Boolean(1);
// new Boolean 返回的是Boolean对象 Boolean（）返回的是boolean类型
// Boolean是构造函数，boolean是基本类型
let decLiteral = 6;
// ES6 中的二进制表示法
let binaryLiteral = 0b1010;
// ES6 中的八进制表示法
let octalLiteral = 0o744;
let notANumber = NaN;
let infinityNumber = Infinity;
let myName = "Tom";
let myAge = 25;

// 模板字符串
let sentence = `Hello, my name is ${myName}.
I'll be ${myAge + 1} years old next month.`;
// void 空值
function alertName(): void {
    // alert("My name is Tom");
    return undefined;
}
// void 只可以赋值 undefined
let isNull: void;
// isNull = 5;
isNull = undefined;

// let u = undefined;
let n = null;


