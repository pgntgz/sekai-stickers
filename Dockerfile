# ============================================
#  sekai-stickers Dockerfile
#  用途: 在本地或 CI 中构建静态产物
#  部署方式: 构建完成后将 build/ 目录上传到 VPS
# ============================================

# 构建阶段 (Build Stage)
FROM node:18-alpine as builder

WORKDIR /app

# 先复制依赖描述文件，利用 Docker 缓存加速
COPY package.json package-lock.json ./

# 如果在国内网络不好，可以取消下面这行的注释
# RUN npm config set registry https://registry.npmmirror.com

RUN npm install

# 复制源代码
COPY . .

# 打包构建
RUN npm run build

# ============================================
#  生产阶段 (Production Stage)
#  直接使用 nginx:alpine 托管静态文件
# ============================================
FROM nginx:alpine

# 移除默认的 nginx 配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 将构建产物复制到 nginx 静态文件目录
# 注意: 因为 package.json homepage="/pjsk"，所以 build 产物需要放在根目录
# 而 nginx.conf 中用 alias 将 /pjsk 映射到 /usr/share/nginx/html
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
