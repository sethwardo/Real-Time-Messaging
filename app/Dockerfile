FROM node:14

WORKDIR /app
COPY package.json .
RUN npm install
RUN mysql -u root -e "./util/startup.sql"
COPY . .
CMD npm start
