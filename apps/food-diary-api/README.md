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

