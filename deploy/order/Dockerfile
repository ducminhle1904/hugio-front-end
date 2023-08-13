FROM nginx

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist/apps/remotes/order /build

ENTRYPOINT ["nginx", "-g", "daemon off;"]
