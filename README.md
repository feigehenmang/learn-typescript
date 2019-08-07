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
```
yarn add tslint-config-alloy --dev
```
- 修改tslint

## 开始步骤
```
// 下载依赖
yarn install
```
- tsconfig.json为typescript的主要配置文件