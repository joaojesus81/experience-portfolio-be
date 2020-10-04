# Experience Portfolio API by Sam Styles, Alex Robu and Joao Jesus

This project establishes a psql database to host data related to Arup staff and projects for the purposes of generating customised CVs. There are a series of endpoints that can be used to query and add to the data.

The project was initially established as part of the Northcoders project, September 2020.

The project was developed using `Node.js` [v14.4.0] and `VS Code`. `Knex` has been used as a 'query-builder' to manage the interface with the psql database, which is built using `postgres` [v12.3]. The server is established using `Express`. `Jest` and `Supertest` have been used for testing.

The app has been published to Heroku at this location: `https://experience-portfolio-be.herokuapp.com/api`

# Features

The database containts data tables relating to `staff` and `projects`. The staff data is split into `staffMeta` (person-specific information which is needed for the CV), and `staff experience` (which projects a person has worked on). Projects also have metadata, as well as information related to the keywords that apply to each projet. Keywords are stored in separate keywords tables. Upwards migrations are carried out in the following order when seeding the database:

- Keyword groups
- Keyword list
- Keyword thesaurus
- Projects
- Project keywords
- Staff meta
- Staff experience

Separate "test", "dev" and "prod" data is included in the relevant "./db/" directories.

Endpoints have been established that allow users to view and amend the data as described in the `API Reference` section below.

# Data

The data has been obtained using ADS queries. These queries generally filter Arup's data by cost centre. For the current staff data, cost centre 01-419, 01-212 and 01-102 have been used. 01-181 has also been included for project data due to Joao's previous experience there.

This ADS data set is processed using a util function to avoid problems when seeding the database (such as staff experience that relates to a job number that isn't included in the dataset) and to remove any projects that mention the word "confidential" in their description. This forms the "prod" data, which is then further filtered by staff number to create the smaller test & dev data.

To re-generate the test and dev data from the prod data, you can run `npm run make-data` in the root folder.

# API

The API allows access to the following endpoints. For more details refer to the "endpoints.json" file included.

"GET /api": serves up a json representation of all the available endpoints of the api
"GET /api/info": serves up an object containing various arrays of staff and project data from the db
"GET /api/projects": serves up an array of all projects; this list can be filtered in many ways using queries
"POST /api/projects/staff": when passed a list of projects, returns a list of staff who have worked on those projects. Accepts all properties of staffMeta as queries, e.g 'GradeLevel=5'.
"GET /api/projects/staff": serves up an object containing an array of staff who meet the filters (including relevant experience), together with an array of projects that meet the criteria
"GET /api/projects/staff/:StaffID": serves up project list for an individual. This list can be filtered in many ways using queries
"POST /api/staff/login": verifies whether a staff member exists and returns their grade and projects for which they are the Project Manager
"GET /api/staff/meta": fetch meta data for all staff; can be filtered by any staff meta key
"GET /api/staff/meta/:StaffID": fetch meta data for an individual
"PATCH /api/staff/meta/:StaffID": updates staff metadata for an individual. Array values can be updated by sending the entire array as part of the patch object
"POST /api/staff/meta/:StaffID": updates staff photo for an individual
"GET /api/project/:ProjectCode": get project details by project code
"GET /api/project/keywords/:ProjectCode": get keyword codes for a project, including the related keywords from the keyword thesaurus
"PATCH /api/project/:ProjectCode": amend project details. ScopeOfWorks can be updated by sending the entire array as part of the patch object - see example below. For imgURL, use POST or DELETE. Keywords cannot be patched, these need to be changed on the Arup system
"POST /api/project/:ProjectCode": updates a photo for a project
"DELETE /api/project/:ProjectCode": deletes a photo for a project
"PATCH /api/project/staff/:ProjectCode": add staff experience to project
"POST /api/project/staff/:ProjectCode": add staff experience to project where their time hasn't come from the Arup system
"GET /api/keywords": serves up an array of all keywords
"GET /api/keywords/allgroups": serves up an array of all keywords, grouped by keyword category (similar to /api/keywords/groups/:StaffID, but with all keywords)
"GET /api/keywords/groups": serves up an array of keyword groups
"GET /api/keywords/groups/:StaffID": serves up an object containing all keywords that a staff member has worked on, sorted into groups. The projects that the keywords come from can be queried.

# Architecture

The code has been developed using MVC architecture.

"app.js" identifies the correct router for the specific query. Where Heroku is used, incoming Heroku queries are identified by the "listen.js" file.

All well-formed queries are directed through the "/api" router into the relevant route. Routers can be found in the "./routes" folder. Each router passes well-formed queries on to the relevant Controller.

The Controllers are purely used to pass information between the Routers and the Models. Controllers have been grouped into files according to their API routing and can be found in "./controllers".

The Models interface with the database and also (typically) handle any custom error handling. Models have been grouped into files according to their API routing and can be found in"./models".

The models return their results back to the controllers, which return them on to the Client.

Errors are caught by `.catch` statements within the Controllers, and passed to the Error-Handling functions via "app.js" (see below for further information).

# Error-Handling

Error-Handling Functions are contained in "./errors/index.js".

The server can return the following errors:

400: Bad request (These are typically reflective of bad queries to the psql database.)

404: Invalid path (These can be generated by either:

- a non-existent end-point (e.g. "/apj/info"), which are handled by the "badPathError" function, or
- a well-formed request that does not return any results, which are handled by custom errors using Promise.reject, typically within the relevant model file)

405: Invalid method (e.g. attempting a post request to an endpoint that does not allow this functionality)

422: Unprocessable entity (this error is generated by a well-formed request that could not be processed by the PSQL database.

500: Server error (this error code will be returned if the error does not fall into the categories above)

# Environments

Three environments are used within the app:

`test` for testing purposes
`development` for development purposes
`production` for deployment to Heroku

Unless otherwise specified, the environment will default to `development`.

# Installation

To clone the project, run `git clone https://github.com/samstyles84/experience-portfolio-be`.

Dependencies are listed in the package.json file. To install dependencies, run "npm install".

The user will need to create their own knexfile.js (see Knexfile Configuration, below).

To initialise (or re-initialise) the databses, run "npm run setup-dbs". This will DROP both the test and development databases (if they exist) and then CREATE new (empty) versions of each.

To seed the development database, type "npm run seed" at the command line. This will rollback and then migrate the development database to the latest migration (i.e. clean the development database).

To run the test suites, use "npm test" at the command line. This will:

- set the environment to "test"
- run "knex.seed.run" before each test in `app.test.js`.
- this causes the file "./db/seeds/seed.js" to be run. This file rolls back the test database, and then runs all of the migrations, so that the db is clean before each test.
- runs the tests

# Knexfile Configuration

The user will need to create their own "./knexfile.js" to determine the configuration for Knex. Refer to http://knexjs.org/#Installation-client for Knex documentation.

This file should use a global variable (`process.env.NODE_ENV`) to set the correct environment (`test`, `development` or `production`). This variable also determines which version of the database should be used (`test`, for testing, `development` for development and the `Heroku` db for production).

Note that "Connection.js" is also used to manage the knex connections, switching between test / development / production environments as required.

Below are the resulting dbConfig files for each enviroment, for information:

`Test`:
{
connection: { database: 'experience_portfolio_test' },
client: 'pg',
migrations: { directory: './db/migrations' },
seeds: { directory: './db/seeds' }
}

`Development`:
{
connection: { database: 'experience_portfolio' },
client: 'pg',
migrations: { directory: './db/migrations' },
seeds: { directory: './db/seeds' }
}

`Production`:
{ client: "pg", connection: process.env.DATABASE_URL }

Non Mac OS users will need to add their username and password within these files.

An optional custom console log command can be introduced within "knexfile.js" to suppress knex warnings related to FSMigrations:

       const log = console.log;
       console.log = (...args) => {
         if (!/FsMigrations/.test(args[0])) log(...args);
       };

# Images

Images are uploaded to Cloudinary via their API. The API details are entered directly into Heroku, for security. A separate version of the software would require a new Cloudinary account with the appropriate API details - refer to Cloudinary / Heroku documentation.

# Tests

The code was developed using Test Driven Development (TDD) and therefore a comprehensive suite of test functions has been included.

Testing has been carried out using the `Jest` package. `Supertest` is also required, to simulate testing of the server.

Tests for app functionality are included within `./__tests__/app.test.js`.

Tests for utility functions (such as formatting data) are included within `./__tests__/utils.test.js`.

Scripts in the package.json file ensure that the "test" data will be used when tests are being run. Scripts also ensure that the test database is migrated to the latest version before each test, and rolled back after each test.
