FROM node:14.17.3

# install dependencies
WORKDIR /opt/server
COPY package.json yarn.lock* ./
RUN yarn cache clean --force && yarn

# copy source code after dependencies are installed
COPY . /opt/server

CMD ["yarn", "start"]