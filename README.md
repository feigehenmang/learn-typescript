# learn-typescript
learn-typescript
## 初始化项目步骤
```
git clone https://github.com/feigehenmang/learn-typescript.git
cd learn-typescript
npm init
yarn add typescript
yarn add tslint --dev
```
**初始化tslint.json**
```
{
    "rules": {
        // 必须使用 === 或 !==，禁止使用 == 或 !=，与 null 比较时除外
        "triple-equals": [
            true,
            "allow-null-check"
        ]
    },
    "linterOptions": {
        "exclude": [
            "**/node_modules/**"
        ]
    }
}
```
- 查看分支 **tslint-init** 可以查看初始化的tslint配置
- [使用alloyTeam的tslint配置](https://github.com/AlloyTeam/tslint-config-alloy)
- [网址链接](https://alloyteam.github.io/tslint-config-alloy/)
```
yarn add tslint-config-alloy --dev
```
- 修改tslint
```
{
    "extends": "tslint-config-alloy",
    "rules": {
        // 这里填入你的项目需要的个性化配置，比如：
        //
        // 一个缩进必须用两个空格替代
        // "indent": [
        //     true,
        //     "spaces",
        //     2
        // ]
    },
    "linterOptions": {
        "exclude": [
            "**/node_modules/**"
        ]
    }
}
```
- 常见的错误
    - 字符串单引号，新增rules： "quotemark":[true, "double"]
    - Expected linebreak to be 'LF' (linebreak-style)tslint(1) 新增rules：  "linebreak-style":false
- 查看分支**alloy-tslint**，查看初始化allouy-tslint配置
## 开始步骤
```
// 下载依赖
yarn install
```
- tsconfig.json为typescript的主要配置文件，[具体配置](https://www.html.cn/doc/typescript/doc/handbook/Compiler%20Options.html)
---
### 原始数据类型
在JavaScript中，类型分为两种，**原始数据类型**和**对象类型**，原始数据类型包括：布尔值，数字，字符串，null，undefined以及ES6中的新类型[Symbol](http://es6.ruanyifeng.com/#docs/symbol)
- 具体的看src/basic_type.ts, src/any_type.ts...
- 类型推论：声明变量时会推导出类型，不需要具体的指定类型，如下：
```
let myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
// 事实上等价于
let myFavoriteNumber: string = 'seven';
myFavoriteNumber = 7;
```
- 联合类型 Union Types 查看src/union_type.ts
### 对象的类型：接口
