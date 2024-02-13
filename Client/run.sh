# 先處理 Nextjs
npm run build

# 建立 Docker 映像
docker build -t carash-client . # 建立 Image

# 檢查是否存在名為 carash-client 的 container，如果存在則刪除
docker rm -f carash-client || true

# 運行新的 container
docker run -d -p 8230:8230 --name carash-client carash-client # 指定 port, 名稱 

