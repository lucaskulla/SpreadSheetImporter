FROM node:lts-alpine as build-stage

LABEL IMAGE="importer"
LABEL VERSION="1.0.0"
LABEL CI_IGNORE="False"

WORKDIR /kaapana/app

COPY package.json package-lock.json ./

RUN npm ci --silent


COPY . .

RUN npm run build

###############################
######### Production ##########
###############################
FROM docker.io/nginx:1.23.3-alpine

WORKDIR /kaapana/app

EXPOSE 80

COPY --from=build-stage kaapana/app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
