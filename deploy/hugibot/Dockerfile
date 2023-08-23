FROM nginx

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist/apps/remotes/chat /build

ENTRYPOINT ["nginx", "-g", "daemon off;"]
