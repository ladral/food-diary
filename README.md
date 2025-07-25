# Food diary main project

## Introduction

The Food Diary application is a web-based tool designed to help users track their daily food intake and monitor the occurrence of symptoms. 
This application not only allows users to log what they eat but also provides valuable insights into the correlation between their food consumption and the symptoms they experience.

The project consists of two main components: a client application and a server (API) application. Additionally, it utilizes an open-source solution (Keycloak) as an external identity provider for user authentication.

## Installation guide
To simplify the installation process, all three components have been consolidated into a single Docker Compose file. This README outlines the steps for setting up the Docker Compose environment. 
Each application can also be installed separately. please refer to the dedicated README files for detailed instructions on local development setups for each application.

There are two methods to install the application: production mode and demonstration mode. Once the application is started in production mode, it cannot be switched to demonstration mode without a complete reinstallation.
To switch between modes, you must clean the Docker Compose installation by running the command `docker-compose down --rmi all`. After that, you need to delete the `/data` folder. Please note that all user data stored in the `/data` folder will be lost.

Before proceeding, ensure you read and fully understand the instructions. Execute the necessary steps for your preferred installation method. 
If any issues occur on windows, please refer the troubleshooting section below. This step can also be done in advanced to avoid any issues to even occure.

If you're in a hurry and just want a fast demo setup, then you can refer to the **TL;DR** section below.

### Docker compose deployment
1. install docker on your host
   - ubuntu server installation using snap: `sudo snap install docker`
2. start docker
3. fire up your terminal and go to the root directory of the project
4. copy the dev.env file and save it as .env: `cp dev.env .env`
5. update the .env file:
   - replace the placeholder passwords with secure values
   - replace api secret key with a secure value
   - **good to know:**
     - if you change any hostname or port in the .env file, ensure the changes are also reflected in the main nginx.conf
     - the value of the APP_ENV_PREFIX variable must match the prefix of all client application environment variables within the project .env file. 
     - all top level client application environment variable keys must match to a value of an application level environment variable. These variables will override the environment variables of the client application. For more information, see ./apps/food-diary/env.sh.
6. run one of the following docker commands (after starting the application, the mode can not be switched without a complete re-installation): 
   - **production mode:** `docker-compose up -d`
   - **demo mode:** `docker compose -f docker-compose.yml -f docker-compose-demo-seed.yml up -d` (starts the application in demo mode with demo data seed)
7. remove unused build images `docker image prune`
8. application is now available at the specified port 8000 -> `http://localhost:8000`
   - if started in demo mode then the following demo user already exists:
      - **user:** alice 
      - **password:** wonderland 
9. the keycloak admin site is available at `http://localhost:8000/auth/` (credentials defined in the .env file)
10. the django admin site is available at `http://localhost:8000/admin` (credentials defined in the .env file)
11. update the OIDC client secret for enhanced security (**obsolete for local setup but recommend for production**)
    - open the keycloak admin site in the browser: `http://localhost:8000/auth/`
    - login with your admin credentials
    - select the food-diary realm on the realm drop down
    - select `Clients` form the sidebar navigation
    - select the client: `food-diary-api-client`
    - select the tab `Credentials`
    - regenerate the client secret and copy the new secret
    - stop your deployment: `docker-compose stop`
    - update your docker compose deployment environment variable with the new secret (.env -> FOOD_DIARY_API_OIDC_CLIENT_SECRET) 
    - restart your deployment: `docker-compose up`
12. Stop all containers
    - stop containers `docker-compose stop` (restart containers: `docker-compose start`)
    - stop and removes containers, networks, volumes created by up: `docker-compose down`
    - stop containers and removes containers, networks, volumes, and images created by up: `docker-compose down --rmi all`
13. remove unused images `docker image prune`
14. remove the folder `./data` to remove all the data created by the application

### TL;TR - docker compose deployment for demonstration purpose
1. copy the dev.env file and save it as .env: `cp dev.env .env`
2. `docker compose -f docker-compose.yml -f docker-compose-demo-seed.yml up -d`
3. browser -> `http://localhost:8000`
4. login
   - **user:** alice
   - **password:** wonderland

### Docker compose deployment UML
![plantuml](./docs/plantuml.png)

## Troubleshooting
### Windows
As we all know, there are some key differences between DOS and UNIX systems. Under certain circumstances, the line endings when checking out a repository may not be correct. This can cause the bash and .env files to be unrecognized by the docker daemon file parser, resulting in a failed deployment.
If not all containers are up and running, it is likely that you are encountering this issue.
To avoid such problems, it's essential to ensure that your Git configuration is set up to handle line endings appropriately.

To work around this issue, the line endings can be corrected using the CLI tool dos2unix.

1. To ensure that the `.env` file has the correct line endings, it is essential that steps 4 and 5 of the Docker Compose deployment process have already been completed.
2. ensure you have [git bash for windows](https://gitforwindows.org/) installed
3. install dos2unix (https://dos2unix.sourceforge.io/)
   - recommended way for installation is to use scoop
     - follow the quickstart section on the [scoop website](https://scoop.sh/)
     - run `scoop install main/dos2unix`
4. open git bash and navigate to the root directory of the application
5. run the following command `find . \( -name '*.sh' -o -name '*.env' \) -print0 | xargs -0 dos2unix`
6. clean the Docker Compose deployment `docker-compose down --rmi all`
7. remove the folder `./data`
8. run the following command to start the application: `docker compose -f docker-compose.yml -f docker-compose-demo-seed.yml up -d`
9. **(optional)** - buy a UNIX system ;-)