FROM alpine:3.9

RUN apk add --no-cache tini yarn

WORKDIR /data
COPY docker-entrypoint.sh .

EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--", "/data/docker-entrypoint.sh"]
CMD ["yarn", "start"]

