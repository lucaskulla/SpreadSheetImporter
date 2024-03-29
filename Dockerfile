###############################
######### Attention  ##########
###############################
# Changes in this Dockerfile must be reflected in the Dockerfile in the Kaapana-persistence-Layer

###############################
######### Build Stage #########
###############################
FROM node:lts-alpine as build-stage

LABEL IMAGE="kaapana-persistence-importer"
LABEL VERSION="1.0.0"
LABEL CI_IGNORE="False"

WORKDIR /kaapana/app

RUN apk update && apk add git

# Used to invalidate cache
ADD https://api.github.com/repos/lucaskulla/SpreadSheetImporter/git/refs/heads/master version.json
RUN git clone -b master https://github.com/lucaskulla/SpreadSheetImporter.git


WORKDIR /kaapana/app/SpreadSheetImporter

RUN npm ci --silent
RUN npm run build

###############################
######### Production ##########
###############################
FROM docker.io/nginx:1.23.3-alpine

WORKDIR /kaapana/app

EXPOSE 80

COPY --from=build-stage /kaapana/app/SpreadSheetImporter/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
