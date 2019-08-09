// 类型断言
// <类型>值 || 值 as 类型，tsx中使用as语法
function getLength(params: number | string): number {
    if ((params as string).length) {
        return (params as string).length;
    }else {
        return params.toString().length;
    }
}
let num = 123;
console.log(getLength(num));

