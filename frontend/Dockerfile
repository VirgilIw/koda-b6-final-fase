FROM node:24.11.0 AS build

WORKDIR /workspace
COPY package*.json  .
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.28.2-alpine

WORKDIR /usr/share/nginx/html
COPY --from=build /workspace/dist/ .

RUN rm /etc/nginx/conf.d/default.conf
COPY ./config/nginx.conf /etc/nginx/conf.d/nginx.conf

# store reducer action