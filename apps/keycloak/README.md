# Keycloak

# Introduction
Keycloak is an open-source identity provider designed for centralized user management. It offers a robust solution for authentication and authorization, particularly suited for modern applications, including single-page applications and REST APIs.
While Keycloak provides a default user interface, it does not align with the styling of the food diary application. 
Fortunately, Keycloak supports custom themes, and with the help of the project [Keycloakify](https://keycloakify.dev), you can create custom themes using React. 
Additionally, Keycloak provides a simple way to importing and export realms, which is particularly useful for automating setup during deployment.


## Realms
The `/realms` subfolder contains the realm export necessary for production deployment. This realm includes only the essential configurations for the initial setup of Keycloak and does not contain any default user data.
For demonstration purposes, a demo realm is available in the `/mocks` folder (on project level), which includes a demo user. This setup is ideal for local or Docker deployments.

## Theme
The `/theme` subfolder includes the Keycloakify project along with the final custom theme for the food diary application. 
There is no need to run or build the theme locally, as the final Keycloak theme is already built and included in the repository. This decision was made to avoid the complexity of requiring Java for local builds. During local deployment, the default Keycloak theme will be used, while the custom food diary theme is automatically included in production deployments using Docker Compose.

If you're interested in exploring Keycloakify further, feel free to check out the `/theme` folder for more details.


# Local setup
1. install docker on your host
2. start docker
3. fire up your terminal
4. run the following command `docker run -p 8080:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:26.2.4 start-dev`
5. open your browser and navigate to http://localhost:8080/
6. login as admin
   - username: admin
   - password: admin
7. on the sidebar navigation collapse the realm selection (Keycloak master) and select `Create realm`
8. select `Browse` on the Resource file selection
9. browse to `food-diary/mocks/keycloak/realms` and select the `food-diary-demo-realm.json`
10. click on `Create
11. now are ready to use the food diary application locally. Use the following demo user to log in:
    - username: alcie
    - password: wonderland



