FROM node:20-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install -g @expo/ngrok@^4.1

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start the Expo project using npx
CMD ["npx", "expo", "start", "--tunnel"]
