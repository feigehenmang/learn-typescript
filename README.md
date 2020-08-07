# 要做哪些
    (链接)[https://juejin.im/post/6856410900577026061]
## Git Commit Message
    1. cnpm i commitizen --save-dev
    2. [CZ说明](https://juejin.im/post/6844903831893966856)
```
npx commitizen init cz-conventional-changelog --save --save-exact
// 等价于
1. cnpm i cz-conventional-changelog --save-dev
2. 
"devDependencies": {
    "commitizen": "^4.1.2",
    "cz-conventional-changelog": "^3.2.0" // add 
  },
  // add
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
```
    3. npx git-cz 即可
    4. custom commit 
    ```
    
    ```
## 简述符合Angular规范的提交说明的结构组成
## Commit 信息 如何和Github Issues 关联
## 如何生成版本日志
## TypeScript如何自动生成版本日志
## TypeScript目前是采用TSLint还是ESLint进行代码校验,为什么
## 列举你知道的所有构建工具并说说这些工具的优缺点, 这些工具在不同场景下应该如何选型
## Babel 对于TypeScript的支持有哪些限制
## 列举你知道的ESLint的功能
## 如何确保构建和上传的代码无ESLint的错误信息
## TypeScript目前是采用TSLint还是ESLint进行代码校验
## ESLint 和 Prettier的区别是什么, 两者在一起工作时会产生问题吗
## Linters 有哪两种类型的校验规则
## 如何有效的识别 ESLint 和 Prettier 可能产生冲突的格式规则？如何解决此类规则冲突问题？
## git hook 在项目中哪些作用？
## git hook 中客户端和服务端钩子各自用于什么作用？
## git hook 中常用的钩子有哪些？
## pre-commit 和 commit-msg 钩子的区别是什么？各自可用于做什么？
## husky 以及 ghook 等工具制作 git hook 的原理是什么？
## 如何设计一个通用的 git hook ？
## git hook 可以采用 Node 脚本进行设计吗？如何做到？
## lint-staged 的功能是什么？
## VS Code 配置中的用户和工作区有什么区别？
## VS Code 的插件可以只对当前项目生效吗？
## 谈谈你所理解的 npm scripts，它有哪些功能？
## 你所知道的测试有哪些测试类型？
## 你所知道的测试框架有哪些？
## 什么是 e2e 测试？有哪些 e2e 的测试框架？
## 假设现在有一个插入排序算法，如何对该算法进行单元测试？
## 假设你自己实现的 React 或 Vue 的组件库要设计演示文档，你会如何设计？设计的文档需要实现哪些功能？
## 在设计工具库包的时候你是如何设计 API 文档的？
## 在通常的脚手架项目中进行热更新（hot module replacement）时如何做到 ESLint 实时打印校验错误信息？
## Vuepress 有哪些功能特点？
## 你所知道的 CI / CD 工具有哪些？在项目中有接触过类似的流程吗？
## CI 和 CD 的区别是什么？
## Github Actions 的特点是什么？