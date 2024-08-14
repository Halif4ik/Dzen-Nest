# Test_Tasks SPA Mini Chat with websoket Back End and front-end
## Description:
This is a Single Page Application (SPA) mini forum where users can register with valid credentials,
benefiting from both front-end and back-end validation. Registered users receive a CSRF token and an email notification
confirming their registration. Once registered, users can create posts with the option to attach images or text.
They can also comment on posts made by other users. This project includes WebSocket integration to enable real-time
communication between users. WebSocket allows users to interact with the application seamlessly and receive live updates
without the need for constant page refreshing.
This project serves as the back end for a test task. It provides various API endpoints for managing sneakers, models,
and brands. The application is built using NestJS, a powerful framework for building scalable and maintainable
server-side applications.
I used for check on this endpoint- http://localhost:3008/.

## Features
**User Registration:** New users can register with valid credentials, ensuring data integrity and security.

**JWT Token:** Registered users receive a JWT token for enhanced security.

**Post Creation:** Users can create posts with the ability to attach images or text.

**Commenting:** Users can comment on posts made by other users, fostering community interaction.

**Sorting Options:** Posts can be displayed in either Last-In-First-Out (LIFO) or First-In-First-Out (FIFO) order, giving users flexibility in how they view content.

**Image Resizing:** All attached images are automatically resized to a consistent 320x240px resolution for a uniform viewing experience.

**Text Handling:** Text content is rigorously checked for size and securely saved in a static folder.

**Image Display:** Attached images are displayed with a smooth transition effect using the transition-timing-function: ease-in-out CSS property.

**Error Handling:** Users attempting to use incorrect or unauthorized methods (e.g., through Postman or browser dev tools) receive informative error messages, indicating which fields require correction.

**WebSocket Implementation:**
WebSocket functionality is implemented using the 'ws' library. The server creates a WebSocket server, and clients connect to it for bi-directional communication.
- **Live Updates:** Real-time updates are delivered to users when new posts or comments are made, enhancing the overall user experience.
- **Instant Notifications:** Users receive immediate notifications of new activity within the application, ensuring they never miss out on the latest discussions.

This project aims to provide a user-friendly and secure platform for discussions and interactions, making it an ideal choice for a mini forum or chat application.

##Technologies Used
Front-end: HTML, CSS, Materialize, JavaScript, Vue.js
Back-end: Node.js, NestJs
Database: PostgreSQL
ORM: Prisma

## Installation:
To run this project locally, follow these steps:

Clone the repository to your local machine.

Before running the application, create a .env file with the necessary environment variables, as specified in the sample
file, apply you credentials for database, in index.html change var HOST by ip where you will
launch(127.0.0.1 for exmple if it is localhost). Then, install the dependencies and start the application:
```
yarn install

nest start --watch
```
## Creating an Initial Migration:
To create an initial migration, execute the following command:
For create empty migration for handler contains execute next command:
```
yarn prisma generate
prisma db push

```
This will generate a new migration file in the "migrations" directory named {TIMESTAMP}_name_of_migration. You can then
run this migration to create the necessary tables:
```
prisma migrate dev --name posts-commits-relation
```
Applying Migrations:
Apply the migrations and create the tables in the database, execute in automatically if deployed all project in hosting :
```
npx prisma migrate deploy
```
Reverting Migrations:
If needed, you can revert the migrations and remove the tables by running:
```
yarn run migration:revert
```
## API Endpoints:
POST http://{{dzenLoc}}/api/v1/user/register : Create a new user with credentials.
POST http://{{dzenLoc}}/api/v1/auth/login  : Login created user with credentials and recive JWT tokens.
POST http://{{dzenLoc}}/api/v1/auth/refresh : User with refresh tokenand email can generate all new JWT tokens.
GET http://{{dzenLoc}}/api/v1/items?page=1&revert=false : Receive all posts and commits from the database.
POST http://{{dzenLoc}}/api/v1/posts/create : Only login user with JWT token can create new Posts.

## Additional Notes:
Feel free to explore the API and interact with the provided endpoints. This project is structured to maintain code readability, scalability, and ease of maintenance. If you have any questions or face issues, please don't hesitate to reach out.

Happy coding! 🚀
