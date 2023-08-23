# NodeJS Image Version
FROM node:20

# 設置工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json 並安裝
COPY package*.json ./
RUN npm install -g nodemon
RUN npm install

# Copy Code
COPY . .

# 前端運行的端口
EXPOSE 8230

# 啟動前端應用
CMD npm run start:widm
# carash