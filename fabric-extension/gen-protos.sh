rm -rf fabric-grpc-client/_protos/*
mkdir -p fabric-grpc-client/_protos

node_modules/.bin/grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:./fabric-grpc-client/_protos \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
    --ts_out=service=true:./fabric-grpc-client/_protos \
    --proto_path=./fabric/protos/ \
    ./fabric/protos/**/*.proto

#node_modules/.bin/grpc_tools_node_protoc --plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin --grpc_out=./fabric-grpc-client/_protos --proto_path=./fabric/protos/ ./fabric/protos/**/*.proto
