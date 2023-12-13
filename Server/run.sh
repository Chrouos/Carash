# 建立 Docker 映像
docker build -t carash-server . # 建立 Image

# 檢查是否存在名為 carash-server 的 container，如果存在則刪除
docker rm -f carash-server || true

# 運行新的 container
docker run -d -p 8280:8280 --name carash-server carash-server