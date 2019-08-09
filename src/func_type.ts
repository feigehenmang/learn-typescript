// 两种定义函数的方式：

// 函数声明
function add(x: number, y: number): number {
    return x + y;
}

// 函数表达式
// 用 => 定义函数的形状，左边是入参，右边是返回值类型
let myAdd: (x: number, y: number) => number;
myAdd = (x: number, y: number): number => x + y;

// 用接口定义函数的形状
interface IsearchFunc {
    (source: string, substring: string): boolean;
}
let search: IsearchFunc;
search = (source: string, substring: string) => source.indexOf(substring) >= 0;

// 可选参数, 只是说调用的时候可以选择传或者不传，如果不传的话还是要做非空判断
// 可选参数必须接在必需参数后面。换句话说，可选参数后面不允许再出现必须参数了：
function buildName(firstName: string, lastName?: string): string {
    return lastName ? firstName + lastName : firstName;
}
// 默认参数
function basicParam(params: string, param1 = "Li"): string {
    return params + param1;
}
// console.log(basicParam("tom"));
// console.log(buildName("Tom"));
// 剩余参数
function push(params: any[], ...rest: any[]): any[] {
    // console.log(rest);
    rest.map((item: any) => params.push(item));
    return params;
}
console.log(push([], 1, "1"));
// 重载
function reverse(param: number): number;
function reverse(param: string): string;
function reverse(param: number | string): number | string {
    if (typeof param === "number") {
        return Number(param.toString().split("").reverse().join(""));
    } else {
        return param.split("").reverse().join("");
    }
}

console.log(reverse("nihao"));
const num1 = 19;
console.log(reverse(num1));
/**
 * - 输入多余的或少于要求的参数，是不被允许的;
 */

