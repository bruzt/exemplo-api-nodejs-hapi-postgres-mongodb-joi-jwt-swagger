FROM node:11.6.0

COPY . /home/node/

EXPOSE 5000

CMD ["node", "/home/node/src/api.js"]