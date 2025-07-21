# Food diary api

The food diary API is a robust backend for the food diary client application.

## Installation guide
1. fire up your terminal and go to the root directory of the API application
2. create the virtual environment `python -m venv env`
3. enable the virtual environment `source env/bin/activate`
   - activation of environment may vary depending on you operating system:
   
| Platform | Shell          | Command to Activate Virtual Environment               |
|----------|----------------|------------------------------------------------------|
| POSIX    | bash/zsh       | `$ source <venv>/bin/activate`                       |
|          | fish           | `$ source <venv>/bin/activate.fish`                 |
|          | csh/tcsh      | `$ source <venv>/bin/activate.csh`                  |
|          | pwsh           | `$ <venv>/bin/Activate.ps1`                         |
| Windows  | cmd.exe       | `C:\> <venv>\Scripts\activate.bat`                  |
|          | PowerShell     | `PS C:\> <venv>\Scripts\Activate.ps1`               |


4. install all packages `pip install -r requirements.txt`
5. start a local keycloak instance -> see README.md of keycloak app (optionally)
   - if you just want to test the API locally, than there is no need to set up the keycloak locally. Just use the Django admin User to access the API.
   - however, if you want to use the API together with the food diary client application locally, than the local keycloak setup is required 


## Start the application
1. copy the dev.env file and save it as .env: `cp dev.env .env`
2. apply db migrations `python manage.py migrate` 
3. seed food categories to database `python manage.py seed_food_categories`
4. seed food and their synonymes to database `python manage.py seed_food_and_synonyms`
5. add demo data seed for demo user (optional)
   - `python manage.py seed_demo_user`
   - `python manage.py seed_demo_user_intakes`
   - `python manage.py seed_demo_user_symptoms`
   - `python manage.py seed_demo_user_occurrences`
6. create superuser `python manage.py createsuperuser` (follow the instructions to create the superuser)
7. serve web application in development mode (the env file will be loaded automatically): `python manage.py runserver` 
8. terminate the application: `ctrl + c`

## Update dependencies
1. upgrade all packages: `pip-review --auto`
2. regenerate the requirements.txt with the latest versions: `pip freeze > requirements.txt`

## Docker
1. install docker on your host
    - ubuntu server installation using snap: `sudo snap install docker`
2. start docker
3. fire up your terminal and go to the root directory of the client application
4. copy the dev.env file and save it as .env: `cp dev.env .env`
5. build the docker image: `docker build -t food-diary-api .`
6. start the docker container (.env file must be passed): `docker run -p 4000:8000 --env-file .env food-diary-api`
7. to access the application open the browser and navigate to: http://localhost:4000/admin
8. terminate the docker container: `ctrl + c`
9. remove docker container `docker rm $(docker ps -a --filter "ancestor=food-diary-api" -q)`
10. remove docker image: `docker rmi food-diary-api`

This deployment includes only the Food Diary API. To integrate Keycloak with this setup, you will need to create a Docker network and connect both the Keycloak instance and the Food Diary API to that network. For detailed instructions on setting up Docker networks, please refer to the [official Docker documentation](https://docs.docker.com/engine/network/). 

If your Keycloak instance is not running in a Docker container, ensure that the Food Diary API can establish a connection to it.