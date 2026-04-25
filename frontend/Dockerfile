FROM node:20-alpine AS build
WORKDIR /workspace/site

COPY site/package.json site/package-lock.json ./
RUN npm ci

COPY site ./
RUN npm run build

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY admin ./admin
COPY --from=build /workspace/site/dist ./public
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
