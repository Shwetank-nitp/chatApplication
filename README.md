# Chat Application using Firebase

Welcome to the Chat Application repository! This project is a real-time chat application built using Firebase. It demonstrates the integration of Firebase services to provide a seamless, real-time messaging experience.

## Features

- **Real-Time Messaging**: Messages are sent and received in real-time using Firebase Firestore.
- **User Authentication**: Secure user authentication with Firebase Authentication.
- **User Profiles**: Users can create and manage their profiles.
- **Chat Rooms**: Users can join chat rooms or start private conversations.
- **Offline Support**: Access your messages even when you're offline, thanks to Firebase's offline capabilities.
- **Media Messages**: Send and receive images, videos, and other media files.

## Technologies Used

- **React**: Frontend library for building user interfaces.
- **Firebase**: Backend-as-a-Service (BaaS) providing Firestore, Authentication, and Storage.
- **Firestore**: NoSQL database for real-time data synchronization.
- **Firebase Authentication**: Handles user sign-in and authentication.
- **Firebase Storage**: Stores user-uploaded media files.
- **React Router**: For navigating between different pages in the application.
- **Tailwind-CSS**: For styling the application.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Shwetank-nitp/chatApplication.git
   cd chatApplication
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase**:
   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore, Authentication, and Storage.
   - Obtain your Firebase configuration and add it to a `.env` file in the root of your project:
     ```plaintext
     VITE_API_KEY=your_api_key
     VITE_AUTH_DOMAIN=your_auth_domain
     VITE_PROJECT_ID=your_project_id
     VITE_STORAGE_BUCKET=your_storage_bucket
     VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_APP_ID=your_app_id
     VITE_MEASUREMENT_ID=your_measurement_id
     ```

4. **Start the application**:
   ```bash
   npm run dev
   ```

   The application should now be running on `http://localhost:5173`.

## Usage

- **Sign Up/Sign In**: Create a new account or sign in with an existing account.
- **Chat**: Join existing chat rooms or start a new private conversation.
- **Send Messages**: Send text or media messages in real-time.
- **Profile Management**: Update your user profile with a display name and profile picture.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and create a pull request with your changes.

## Acknowledgements

- Special thanks to the Firebase team for providing an amazing platform for building real-time applications.
