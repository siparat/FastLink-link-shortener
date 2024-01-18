FROM node:20-alpine as build
WORKDIR /opt/app
ADD *.json ./
RUN npm ci
ADD . .
RUN npm run db:push
RUN npm run generate
RUN npm run build

FROM node:20-alpine
WORKDIR /opt/app
ADD package*.json ./
RUN npm ci --omit=dev
COPY --from=build /opt/app/.env ./.env
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/prisma ./prisma
CMD ["node", "./dist/main.js"]
EXPOSE 3000
