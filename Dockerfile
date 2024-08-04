FROM node:20.12.2

# Create app directory
WORKDIR ./

# copy app dependencies
COPY package.json .

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

CMD ["node", "app.js"]






