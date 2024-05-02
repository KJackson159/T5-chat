When using this project, there are a few things you need to do before running it:

1) Set up you firebase database
  a) Create a firebase project, then add firebase to your web app
  b) Copy your firebase configuration in the SDK and paste it to the configuration section in the firebase.js inside the src folder.
  c) Go to authentication and click "Get started"
  d) Select Google and have it enabled. Enter your gmail account.
  e) Add a new provider and select Email/password, and have it enabled as well.
  f) Go to Firestore Database and create database
  g) Hit "next" and have it in test mode
  h) Go to "rules" tab and change to either [allow read, write: if request.auth != null;] or [allow read, write: if true;]

2) Install Node.js (You may have to copy the npm folder and have it pasted into your AppData\Roaming folder when you have to run the project)

3) Install the firebase tools to the project so that you can log in and connect your project to the firebase: https://www.youtube.com/watch?v=quA6rz-Efmw

4) npm install

5) npm start
 
