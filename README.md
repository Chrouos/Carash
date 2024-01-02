# demo-lawsnote

### 啟動方法
前端與後端的專案預先準備步驟
```
cd {指定專案}
npm install
```

若已完成安裝則可以
```
cd {指定專案}
npm start
```

### 工具版本

+ `node -v`: v20.3.1
+ `npm -v`: 9.6.7
+ `create-react-app --version`: 5.0.1
+ 其餘詳情請看 `package.json`

### 資料庫 Chroma

在目錄底下，務必安裝 Docker & Docker Compose.
```
git clone https://github.com/chroma-core/chroma.git  
cd chroma  
docker-compose up -d --build
```

> 下載指南
> [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
> [Download Docker Compose](https://docs.docker.com.zh.xy2401.com/compose/install/)

在 Server 的資料夾底下
```
npm install --save chromadb 
```

### Docker 建立
For Carash-server.
```shell
docker build -t carash-server . # 建立 Image
docker run --gpus all -d -p 8280:8280 --name carash-server carash-server # 指定 port, 名稱 
docker exec -it carash-server /bin/bash # 啟動

# 查看 logs.
docker logs carash-server
```


For Carash-client.
```shell
docker build -t carash-client . # 建立 Image
docker run -d -p 8230:8230 --name carash-client carash-client # 指定 port, 名稱 
docker exec -it carash-client /bin/bash # 啟動

# 查看 logs.
docker logs carash-client
```

### Docker Compose
```
./run.sh
```

