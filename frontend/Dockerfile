FROM node:14-alpine as builder

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.19-alpine

COPY --from=builder /app/build /usr/share/nginx/html

COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

COPY /ssl/tls.crt /etc/nginx/ssl/tls.crt
COPY /ssl/tls.key /etc/nginx/ssl/tls.key

EXPOSE 80 443

CMD [ "nginx", "-g", "daemon off;" ]