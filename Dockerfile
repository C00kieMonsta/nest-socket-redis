FROM node:12.13-alpine As development

ENV NODE_ENV=development

WORKDIR /srv/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:12.13-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /srv/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /srv/app/dist ./dist

CMD ["node", "dist/main"]