# ROOM ROVER - Connecting You to Dream Destinations

## Website Link: [Click Here](https://room-rover.web.app)

## Server Link: [Click Here](https://roomrover-sever-hz75sv5qr-mehedi-hasans-hrid.vercel.app)

Welcome to the RoomRover server-side application! This server powers the backend functionality for RoomRover, a platform for managing user feedback, bookings, and room information.

## Features

### 1. User Feedback Submission

- Allow users to submit feedback through the `/feedback` endpoint.
- Feedback is stored in the MongoDB database for future analysis and improvements.

### 2. Booking Data Management

- Users can submit booking information through the `/bookings` endpoint.
- Booking data is stored in the MongoDB database, facilitating efficient tracking and management.

### 3. Room Information Retrieval

- Retrieve detailed information about rooms through the `/rooms` and `/rooms/:id` endpoints.
- Room data is fetched from the MongoDB database, providing clients with up-to-date details.

### 4. Secure JWT Authentication

- Implement secure JSON Web Token (JWT) authentication for user sessions.
- Users receive a JWT upon successful login through the `/jwt` endpoint, enhancing data security.

### 5. User Authentication State Management

- Utilize Firebase authentication to manage user authentication states.
- The server tracks user login and logout actions, updating the authentication state accordingly.

## Getting Started

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up a MongoDB database and update the connection URI in the `uri` variable.
4. Configure Firebase authentication settings in the `AuthProvider` module.
5. Run the server using `npm start`.

Feel free to explore the API endpoints and integrate this server with your RoomRover client application!
