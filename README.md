# learn-typescript
[learn-typescript](https://ts.xcatliu.com/basics/type-of-function)
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
- src/class_interface.ts
- src/array_type.ts
- src/func_type.ts
- src/type_assety.ts
### 声明文件
[搜索第三方声明文件](https://microsoft.github.io/TypeSearch/)
声明文件的几个使用场景
- 全局变量， 通过script标签引入的第三方库，注入全局变量，类似于项目中的config，UTCMiddWare等
    1. 如果是 **yarn add @types/lodash** 这种方式则不需要其他操作
    2. 全局变量声明文件主要有以下几个方法：
        - declare var 声明全局变量
            - declare var 和 declare let相似，也可以修改全局变量
            ```
            // src/index.ts
            jQuery('#foo');
            // 使用 declare let 定义的 jQuery 类型，允许修改这个全局变量
            jQuery = function(selector) {
                return document.querySelector(selector);
            };
            ```
            - 使用declare const 声明的全局变量就不能再修改了
            - declare只能声明类型，不能有具体的实现
        - declare function 声明全局方法 **支持重载**
        - declare class 声明全局类
        - declare enum 声明全局枚举类型
        - declare namespace 声明含有子属性的全局对象
        - interface 和 type 声明全局类型
            - 最好将interface和type放在namespace中，防止命名冲突，不过在使用的时候应该使用namespace前缀
- npm包，通过import * from url 引入，符合ES6模块规范
    - npm包的声明文件来自两部分，第一部分查看该包内的package.json的types字段，或者有一个index.d.ts文件
    - 对应的@types，文章前面有讲如何查找
    - 以上都没有的话有两个方案，一个是自己在node_modules中维护，即 **node_modules/@types/**自己维护
    - 还可以新建一个types文件夹，专门维护自己的东西，具体步骤如下
- umd包，既可以通过 <script> 标签引入，又可以通过 import 导入
- 直接扩展全局变量：通过 <script> 标签引入后，改变一个全局变量的结构
- 在 npm 包或 UMD 库中扩展全局变量：引用 npm 包或 UMD 库后，改变一个全局变量的结构
- 模块插件：通过 <script> 或 import 导入后，改变另一个模块的结构
