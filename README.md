Run Commands

To start developing or running the project, you can use the following commands:

Development Mode:

```
npm run dev
```

This command is used to run the application in development mode. This typically involves monitoring file changes and automatically restarting the server (using tools like nodemon) to provide a smooth development experience.

Production Mode:

```
npm start
```

This command first builds the project (npm run build) to create the final, ready-to-deploy version, and then runs the application from the resulting folder (./dist/index.js). This is the recommended command for running the application in a production environment.

Additional notes you might include:

Make sure to install all dependencies first using npm install.

You may need to configure your production environment separately (e.g., environment variables).
