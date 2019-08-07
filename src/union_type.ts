let myUnionType: string | number = 7;
myUnionType = "union type";
// 被推断为string
console.log(myUnionType.length);
// 被推断为number
myUnionType = 7;
// console.log(myUnionType.length);
// function getLength(param: string | number): number {
//     return param.length;
// }
// 联合类型在无法确定变量类型时，只能访问公有的属性和方法
function getString(param: string | number): string {
    // number 和 string 都有toString方法
    return param.toString();
}
