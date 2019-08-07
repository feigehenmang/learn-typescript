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
## 开始步骤
```
// 下载依赖
yarn install
```
- tsconfig.json为typescript的主要配置文件