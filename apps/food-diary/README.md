# Food diary client application

The Food Diary client application is a web-based tool designed to help users track their daily food intake and monitor the occurrence of symptoms. This application not only allows users to log what they eat but also provides valuable insights into the correlation between their food consumption and the symptoms they experience.


## Installation guide
1. Install npm (shipped with node, nvm recommended for node install)
2. Install all dependencies: `npm install`


## Start the application
1. Build & serve web application in development mode: `npm run dev`

## Build the application
1. Build the application for production: `npm run build`

## Docker

1. install docker on your host
    - ubuntu server installation using snap: `sudo snap install docker`
2. start docker
3. fire up your terminal and go to the root directory of the client application
4. build the docker image: `docker build -t food-diary .`
5. start the docker container: `docker run -p 3000:80 food-diary`
6. to access the application open the browser and navigate to: http://localhost:3000/
7. terminate the docker container: `ctrl + c`
8. remove docker container `docker rm $(docker ps -a --filter "ancestor=food-diary" -q)`
9. remove docker image: `docker rmi food-diary`

