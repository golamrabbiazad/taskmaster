# Stage 1: Build the Angular application
FROM node:alpine AS build-stage

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @angular/cli

RUN npm install

COPY . .

RUN ng build --configuration=production


# Stage 2: Serve the application with Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /usr/src/app/dist/taskmaster-frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
