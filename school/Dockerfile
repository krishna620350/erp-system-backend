FROM node:16.20.1
WORKDIR /app
COPY package.json ./
RUN nom install
COPY . .
EXPOSE 8001
CMD ["npm", "start"]