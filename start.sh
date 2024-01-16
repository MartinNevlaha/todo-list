# starts docker-compose.yml
docker-compose up -d

# starts app container logs
current_dir=$(basename $(pwd))
docker logs -f todo-list_backend_1