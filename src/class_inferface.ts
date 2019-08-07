interface Ipeople {
    name: string;
    // 可选属性
    age?: number;
    // 任意属性，一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集
    // [propname: string]: string;
    say: () => string;
    // 只读属性
    readonly id: number;
}
let p1: Ipeople = {
    id: 1,
    name: "feigehenmang",
    age: 19,
    say() {
        return `我叫${this.name},今年${this.age}岁了`;
    }
};
console.log(p1.say());

