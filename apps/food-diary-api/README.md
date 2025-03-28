# Food diary api

The food diary API is a robust backend for the food diary client application.

## Installation guide
1. fire up your terminal and go to the root directory of the client application
2. create the virtual environment `python -m venv env`
3. enable the virtual environment `source env/bin/activate`
4. install all packages `pip install -r requirements.txt`


## Start the application
1. copy the dev.env file and save it as .env: `cp dev.env .env`
2. serve web application in development mode (the env file will be loaded automatically): `python manage.py runserver` 
3. terminate the application: `ctrl + c`

## Docker

1. install docker on your host
    - ubuntu server installation using snap: `sudo snap install docker`
2. start docker
3. fire up your terminal and go to the root directory of the client application
4. build the docker image: `docker build -t food-diary-api .`
5. start the docker container (.env file must be passed): `docker run -p 4000:8000 --env-file .env food-diary-api`
6. to access the application open the browser and navigate to: http://localhost:4000/admin
7. terminate the docker container: `ctrl + c`
8. remove docker container `docker rm $(docker ps -a --filter "ancestor=food-diary-api" -q)`
9. remove docker image: `docker rmi food-diary-api`

