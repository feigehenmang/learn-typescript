// any用来表示允许赋值为任意类型，拥有任意的属性值和方法，如果变量在声明的时候未指定其类型，就会被认为是any类型
let anyWhere: any;
anyWhere = {
    name: "feigehenmang",
    age: 19
};
const AGE = 18;
anyWhere = AGE;
console.log(anyWhere.say());
