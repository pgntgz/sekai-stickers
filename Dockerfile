# Master... 第一阶段是构建环境 (Build Stage)
FROM node:18-alpine as builder

# 设置工作目录
WORKDIR /app

# 先只复制依赖描述文件，利用 Docker 缓存加速下载
COPY package.json package-lock.json ./

# 安装依赖
# 如果 Master 在国内网络环境不好，可以取消下面这行的注释
# RUN npm config set registry https://registry.npmmirror.com

RUN npm install

# 把剩下的源代码都复制进去
COPY . .

# 开始打包... (Build)
RUN npm run build

# ---

# Master... 第二阶段是运行环境 (Production Stage)
FROM nginx:alpine

# 【修正】这里去掉了错误的 --rm 参数
# 把第一阶段打包好的文件复制到 Nginx 的服务目录（放置在 pjsk 子目录下以适配 package.json 中的 homepage）
COPY --from=builder /app/build /usr/share/nginx/html/pjsk

# 暴露 80 端口让外面访问
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
