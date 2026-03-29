1. Project Overview
=================
What does this API do?
This API provides a secure and structured interface for managing tasks, and accesing application data.
It allows clinets to create, read update and delete tasks in a structured and validated way with Joi scheams, CORS policies and helmet.js and other middleware for enhanced security and performance.

What problem does it solve?
This API provides solutions the common problem of managing task, project, items and other entities in applications where consistent data handling, validation and error management.
It is desinged for deveolpers to build task tracking system, menagement tools, CRUD functions, and other application with JSON-based RESTful API.

Who is it for?
This API is for developers who are building application that require security, data validation and structured API. Easy integration with proper security mesaures and error handling.
=================

2. Installation instructions
=================
Prerequeisites:
- Node.js (version 14 or higher)
- npm (Node Package Manager)
Installation steps:
Choose one of the following methods to set up the project: create a new repository or clone an existing repository.
Option 1-1. Create a new repository: git init your-repo                                   ##Replace your-repo with your actual repository name
Option 1-2. Clone the repository: git clone https://github.com/yourusername/your-repo.git ##Replace username and repo with your actual github repo information
2. Create and navigate to your working directory: cd your-repo
3. Create and naviaget to your working branch: git checkout -b branch-name ##Replace branch-name with your own branch name
4. Install npm: npm install
5. Install npm ci: npm ci
6. npm install dotenv
7. create a .env file in the root directory and add (replace the Firebase credentials with your own): 

NODE_ENV=development
PORT=3000
FIREBASE_PROJECT_ID=bed-demo-g3a74
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSOME_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-k9r4p@cloud-project-b7c31.iam.gserviceaccount.com
SWAGGER_SERVER_URL=http://localhost:3000/api/v1

8. Start the server: npm start
9. Open http://localhost:3000/api/v1 in your browser
=================

3. API Requests Examples (POSTMAN cURL format)
=================
### Get all items ###
**Request:**
curl --location 'http://localhost:3000/api/v1/events' \
--header 'Origin: http://localhost:3000' \
--data ''

**Expected Response:**
200 OK
All events in the system.

##Actual Response:**
200 OK
All events in the system.

### Create a new event ###
**Request:**

curl --location 'http://localhost:3000/api/v1/events' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Conference 2026",
    "capacity": 100,
    "registrationCount": 50,
    "category": "conference"
}'

**Expected Response:**

201 Created
{
    "message": "Event created succesfully",
    "status": "success",
    "data": {
        "id": "evt_000076",
        "name": "Conference 2026",
        "date": {
            "_seconds": 1774669178,
            "_nanoseconds": 479000000
        },
        "capacity": 100,
        "registrationCount": 50,
        "status": "active",
        "category": "conference",
        "createdAt": {
            "_seconds": 1774669178,
            "_nanoseconds": 479000000
        },
        "updatedAt": {
            "_seconds": 1774669178,
            "_nanoseconds": 479000000
        }
    }
}

**Actual Response:**
201 Created
{
    "message": "Event created succesfully",
    "status": "success",
    "data": {
        "id": "evt_000076",
        "name": "Conference 2026",
        "date": {
            "_seconds": 1774669178,
            "_nanoseconds": 479000000
        },
        "capacity": 100,
        "registrationCount": 50,
        "status": "active",
        "category": "conference",
        "createdAt": {
            "_seconds": 1774669178,
            "_nanoseconds": 479000000
        },
        "updatedAt": {
            "_seconds": 1774669178,
            "_nanoseconds": 479000000
        }
    }
}

### Get a specific event by ID ###
**Request:**
curl --location --request DELETE 'http://localhost:3000/api/v1/events/0ckUzmBF2s1d6LK8YOGg'

**Expected Response:**
200 OK
{
    "message": "Event deleted succesfully",
    "status": "success"
}

**Actual Response:**
200 OK
{
    "message": "Event deleted succesfully",
    "status": "success"
}
=================

4. Link to Public Documentation
=================
https://jihwan47.github.io/3018_Assignment5/
This is the link to the public documentation for the events API.
This URL provides access to the API documentation, including endpoint descriptions, request and response examples in general.
=================

5. Local Documentation Access
=================
http://localhost:3000/api-docs/
This is the URL to access the Local Documentation for the events API when running the server locally.
This URL provides access to the API documentation, including endpoint descriptions, request and response examples for developers working with the API in a local development environment.