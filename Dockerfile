#stage:1
FROM  node:latest as node
WORKDIR /app

COPY . /app 
COPY . /Services
COPY . /Vo
COPY . .
RUN npm install --unsafe-perm
RUN npm run build --prod
#stage:2
FROM nginx:alpine
COPY --from=node /app/dist /usr/share/nginx/html