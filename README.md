# Memory Vault app

## Table of Contents

* [Project Goals](#Project-goals)
* [How to run the application](#How-to-run-the-application)
* [Built with](#Built-with)
* [Author](#Author)

## Project goals

The goal of the project was to build a fully functional serverless backend to a simple frontend that allows the user to save items, toggle them complete or incomplete as well as add an image to them and delete them as necessary. The serverless backend is implemented via the ```serverless``` framework on the ```AWS``` platform.

The frontend is a modified version of the one that was provided in the course and is built using ```React```.

### Functionality of the application

This application allows managing memory items, such as notes on a particular day or happening, with optional photo attachments for each memory item saved. Users have to log in to use the application and have access only to memory items that they have created.


## How to run the application

### Backend

To deploy the application you can run the following commands if you have serverless installed and configured to your AWS account; then the serverless configuration will deploy all necessary assets and configuration to your own AWS account. However, the client app is already configured to use my own backend (it will be functional for some time in the future, too) so you can try out the app by following the Frontend deployment instructions below.

Clone the repo, then run the following commands:
```
cd backend
npm install
sls deploy -v
```

### Frontend
```
cd client
npm install
npm start
```

This should start a development server with the React application that will interact with the serverless memory vault application.

__```ENJOY!```__

## Built With

* ```Javascript``` - :)
* [Node.js and Node Package Manager](https://nodejs.org/en/) - for handling dependencies and project configuration
* [Serverless](https://serverless.com) - Configuration and deployment framework that makes serverless app development much easier than using e.g. AWS CloudFormation. Works with multiple cloud service providers.
* [Auth0](https://auth0.com) - external authentication service used.


## Author

* **Tamas Dinh** - [LinkedIn profile](https://www.linkedin.com/in/tamasdinh/)
