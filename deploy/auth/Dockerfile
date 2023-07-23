FROM nginx

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist/apps/remotes/auth /build

ENTRYPOINT ["nginx", "-g", "daemon off;"]
