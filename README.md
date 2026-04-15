# Personal Resume Website（本地部署新手版）

这是一套前后端分离的个人简历网站：
- 后端：Spring Boot（Java 17）
- 前台：React + Vite（展示页）
- 后台：原生 HTML/CSS/JS（管理页）
- 数据库：MySQL 8

本文是给计算机小白准备的本地部署手册，按顺序照着做即可。

---

## 0. 先确认你要安装的软件

请先安装下面 4 个软件（没有就先装）：

1. JDK 17
2. Maven 3.9+
3. MySQL 8.x
4. Node.js 18+（推荐 LTS）

安装完成后，打开 PowerShell，执行：

```powershell
java -version
mvn -v
node -v
npm -v
```

只要命令能输出版本号，就说明环境没问题。

---

## 1. 进入项目目录

假设你的项目在：`C:\Study\Project\PersonalResume`

打开 PowerShell，执行：

```powershell
cd C:\Study\Project\PersonalResume
```

后面所有命令都默认在这个项目里执行。

---

## 2. 初始化 MySQL 数据库

### 2.1 创建数据库结构

执行下面命令（会让你输入 MySQL root 密码）：

```powershell
mysql -u root -p < .\database\schema.sql
```

### 2.2 导入示例数据（建议导入）

```powershell
mysql -u root -p < .\database\seed.sql
```

### 2.3（可选）更新头像/简历托管链接

```powershell
mysql -u root -p < .\database\update_profile_asset_urls.sql
```

> 如果你输入 `mysql` 提示“不是内部或外部命令”，说明 MySQL 没加到 PATH。可以用 MySQL Command Line Client 或把 MySQL 的 `bin` 目录加到系统环境变量后重开终端。

---

## 3. 配置后端连接数据库

项目后端默认端口是 `8080`。

为了避免你本机数据库密码和默认配置不一致，建议在当前 PowerShell 窗口设置环境变量（复制即可）：

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/personal_resume?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="你的MySQL密码"
$env:APP_JWT_SECRET="this-is-a-local-dev-secret-at-least-32-chars"
```

可选：如果你想改默认后台账号，也可以加下面两行：

```powershell
$env:APP_ADMIN_DEFAULT_USERNAME="admin"
$env:APP_ADMIN_DEFAULT_PASSWORD="admin123"
```

---

## 4. 启动后端（Spring Boot）

在同一个 PowerShell 窗口执行：

```powershell
cd .\backend
mvn -s maven-settings.xml spring-boot:run
```

看到类似 `Started ... in ... seconds` 就说明后端启动成功。

后端地址：
- `http://localhost:8080`

> 这一步窗口不要关，关了后端就停了。

---

## 5. 构建前台页面

新开一个 PowerShell 窗口（保持后端窗口继续运行），执行：

```powershell
cd C:\Study\Project\PersonalResume\frontend\site
npm install
npm run build
```

执行成功后，会把前台构建到 `frontend/public`。

---

## 6. 启动静态服务器

仍在第二个 PowerShell 窗口执行：

```powershell
cd C:\Study\Project\PersonalResume\frontend
npx http-server . -p 5500
```

第一次执行 `npx` 可能会提示安装，输入 `y` 回车即可。

静态站点启动后，访问：
- 前台首页：`http://localhost:5500/public/index.html`
- 后台登录：`http://localhost:5500/admin/login.html`

---

## 7. 登录后台

默认管理员账号（后端首次启动会自动创建）：

- 用户名：`admin`
- 密码：`admin123`

登录成功后可在后台增删改内容，前台刷新即可看到变化。

---

## 8. 一键自检（确认你真的跑起来了）

按下面顺序检查：

1. 打开 `http://localhost:5500/public/index.html`，能看到首页。
2. 打开 `http://localhost:5500/admin/login.html`，能看到登录页。
3. 输入 `admin / admin123`，能进后台。
4. 在后台改一条资料，前台刷新后有变化。

如果以上都通过，本地部署就完成了。

---

## 9. 常见报错与解决

### 问题 1：后端启动失败，提示数据库连接错误

原因：数据库账号密码不对，或 MySQL 没启动。

处理：
1. 先确认 MySQL 服务已启动。
2. 重新设置第 3 步里的 `$env:DB_USERNAME` 和 `$env:DB_PASSWORD`。
3. 重启后端命令。

### 问题 2：前台/后台能打开，但数据加载失败

原因：后端没启动或端口不是 8080。

处理：
1. 确认后端窗口还在运行。
2. 确认访问 `http://localhost:8080/api/public/profile` 有返回 JSON。

### 问题 3：5500 端口被占用

处理：

```powershell
npx http-server . -p 63342
```

然后访问：
- `http://localhost:63342/public/index.html`
- `http://localhost:63342/admin/login.html`

---

## 10. 停止服务

- 停止后端：在后端窗口按 `Ctrl + C`
- 停止静态服务器：在前端窗口按 `Ctrl + C`

---

## 11. 目录说明（方便你找文件）

- `backend/`：后端代码（Spring Boot）
- `frontend/site/`：前台源码（React）
- `frontend/public/`：前台构建后的静态文件
- `frontend/admin/`：后台管理页面
- `database/`：数据库脚本
- `docs/`：接口文档和部署说明

---

## 12. 补充说明

- 本项目默认后端端口：`8080`
- 默认静态站点端口：`5500`
- 后端允许的本地跨域来源已包含 `5500` 和 `63342`

如果你完全按这个 README 执行，正常情况下可以一次跑通。
