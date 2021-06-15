FROM node:10-alpine
RUN mkdir -p ./home/ && chown -R node:node ./home/
WORKDIR ./home/
USER node
COPY package.json ./
RUN npm install
COPY --chown=node:node . .
EXPOSE 8001
ENTRYPOINT ["npm"]