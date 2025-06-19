# Stage 1: Build the React application using Bun
FROM oven/bun:1.2.5@sha256:0805b993b27de973af29184dafcde64622e0aeeb9169ddc0580892708f0ced72 AS build
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN bun install

COPY --chown=node:node . .

RUN bun run build:ci

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine@sha256:d2c11a1e63f200585d8225996fd666436277a54e8c0ba728fa9afff28f075bd7 AS production

RUN chown -R nginx:nginx /var/cache/nginx && \
            chown -R nginx:nginx /var/log/nginx && \
            chown -R nginx:nginx /etc/nginx/conf.d

RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid

COPY --from=build /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

USER nginx

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
