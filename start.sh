# starts docker-compose.yml
docker-compose up -d

# starts app container logs
current_dir=$(basename $(pwd))
docker logs -f $(docker ps --format "{{.Names}}" | grep ${current_dir}_backend_1)