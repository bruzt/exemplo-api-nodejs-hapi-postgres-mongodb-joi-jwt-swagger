FROM node:11.6.0

COPY . /home/node/

RUN npm install pm2 -g 
ENV PM2_PUBLIC_KEY kqi23kwxrprk0o8 
ENV PM2_SECRET_KEY 6r0dugkg9b6wlbf

EXPOSE 5000

CMD ["bash", "init.sh"]