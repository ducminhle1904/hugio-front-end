FROM nginx

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist/apps /build

ENTRYPOINT ["nginx", "-g", "daemon off;"]
