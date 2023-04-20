# 新闻发布管理系统

本项目是一个简单的新闻发布管理系统，分为管理端和用户端。管理端登入后可管理发布新闻文章内容，用户端无需登录便可查看已发布的新闻内容。

### 实现功能

- [x] 登录模块：实现用户登录；
- [x] 首页：展示文章相关数据；
- [x] 用户管理：管理登录用户；
- [x] 权限管理：管理登录用户的权限，可以使用系统的哪些功能；
- [x] 新闻管理：可撰写新闻、把新闻加到草稿箱、编辑新闻分类；
- [x] 审核管理：用于审核用户的新闻；
- [x] 发布管理：可发布审核通过的新闻，下线已发布的新闻；
- [x] 游客模块：游客无需登录系统便可查看、点赞新闻，将地址改为news便可查看此页面。

### 技术栈（基于 `create-react-app` 后的配置）

- react v18.2.0 `hooks` + `redux` + `react-router5`
- `axios` 封装
- `echarts`图标展示
- `json-server`本地数据库接口

### 项目结构

```js
.
│             
├─db.json               // json-server的模拟数据
├─public                // html 入口
└─src                   // 前端项目源码
   ├─assets             // 静态文件
   ├─components         // 公用组件
   ├─redux              // redux 目录
   ├─routes             // 路由
   ├─utils              // 工具包
   ├─views              // 视图层
   └─...

```

In the project directory, you can run:

### 使用方法

```bash
https://github.com/wangsihui12/newssystem

## 全局安装json-server
npm install -g json-server

## 安装依赖
npm install

## 在cmd项目路径中启动模拟的服务器
json-server --watch db.json --port 3000

## 启动
npm start

## 打包
npm build
```

### 项目截图

存放于src/assets文件中

### 后台账号密码

- 账号：admin
- 密码：123456

