FROM node:11-alpine

WORKDIR /usr/src/app

# Installs latest Chromium package.
RUN apk update && apk upgrade && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
        python@edge \
        g++ \
        make \
      chromium@edge \
      nss@edge \
      freetype@edge \
      freetype-dev@edge \
      harfbuzz@edge \
      ttf-freefont@edge

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

COPY package*.json ./
COPY ecosystem.config.js .
COPY .env .

RUN npm i

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
