from golang:alpine as builder
RUN apk --no-cache add git
RUN go get -v -u github.com/golang/dep/cmd/dep
RUN go get -v github.com/improbable-eng/grpc-web/go/grpcwebproxy ; exit 0
RUN cd src/github.com/improbable-eng/grpc-web && dep ensure
RUN go get -v -u github.com/improbable-eng/grpc-web/go/grpcwebproxy

from alpine
RUN apk --no-cache add ca-certificates
WORKDIR /
COPY --from=builder /go/bin/grpcwebproxy .
ENTRYPOINT ["/grpcwebproxy"]
