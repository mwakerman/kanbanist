FROM alpine:3.9

WORKDIR /data
COPY . .
RUN apk add --no-cache tini yarn \
    && yarn

EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["yarn", "start"]

