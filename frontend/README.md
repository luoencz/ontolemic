# Frontend

This directory is intended for the Inner Cosmos frontend application, built with React and Vite.

## Development

To start the development server, run the following commands from this directory:

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use). The Nginx configuration is not used for development.

## Production Build

To build the application for production, run:

```bash
npm run build
```

This will create a `dist` directory with the optimized assets. The Nginx server is configured to serve the application from this `dist` directory. Ensure that the output of the build is placed in `/opt/sites/inner-cosmos/frontend/dist`.
