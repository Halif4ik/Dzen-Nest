FROM node:20.6.1

WORKDIR /app

COPY package*.json ./

# Install other dependencies
RUN yarn install --ignore-engines

COPY . .

CMD yarn prisma generate  && npx prisma migrate deploy && yarn run start:dev
#CMD ["yarn", "run","start:prod"]