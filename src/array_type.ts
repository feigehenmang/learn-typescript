// 「类型 + 方括号」表示法 数组的项中不允许出现其他的类型：
let numArr: number[] = [1, 2, 3, 4];
let unionArr: (number | string)[] = [1, 2, 3, 4];
unionArr.push("h");
unionArr.push(6);
// 数组泛型
let fibonacci: Array<number> = [1, 1, 2, 3, 5];

