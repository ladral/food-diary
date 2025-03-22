<p align="center">
    <i>🚀 food-diary custom Keycloak theme using <a href="https://keycloakify.dev">Keycloakify</a> 🚀</i>
    <br/>
    <br/>
</p>

# Quick start

# Testing the theme locally

[Documentation](https://docs.keycloakify.dev/testing-your-theme)


# Building the theme

You need to have [Maven](https://maven.apache.org/) installed to build the theme (Maven >= 3.1.1, Java >= 7).  
The `mvn` command must be in the $PATH.

-   On macOS: `brew install maven`
-   On Debian/Ubuntu: `sudo apt-get install maven`
-   On Windows: `choco install openjdk` and `choco install maven` (Or download from [here](https://maven.apache.org/download.cgi))

```bash
npm run build-keycloak-theme
```

Note that by default Keycloakify generates multiple .jar files for different versions of Keycloak.

# Initializing the account theme

```bash
npx keycloakify initialize-account-theme
```

# Initializing the email theme

```bash
npx keycloakify initialize-email-theme
```