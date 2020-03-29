A simple API collection to manage task made with nodejs/express.

## Try it

Use the Postman Collection in project root to test API collection (https://aerdnach-taskman.herokuapp.com/) 

## Install

Create a free account for https://sendgrid.com/. Find a tutoria for run MongoDB locally on your OS.

Crete a config folder, in this dir create a file named dev.env. In this file put the following variables:

- PORT=3000
- SENDGRID_API_KEY=*your_sendgrid_api_token*
- MONGODB_URL=mongodb://127.0.0.1:27017/task-manager-api
- JWT_SECRET=*your_secret_key* (here you can put whatever you want)

From project root run *npm install*.
