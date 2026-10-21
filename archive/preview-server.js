#!/usr/bin/env node

const express = require('express');
const path = require('path');

const app = express();
const rootDir = __dirname;
const port = process.env.PORT || 8080;

app.use(express.static(rootDir, {
  extensions: ['html']
}));

// Serve the site's custom 404 page for unknown routes.
app.use((req, res) => {
  res.status(404).sendFile(path.join(rootDir, '404.html'));
});

app.listen(port, () => {
  console.log(`Preview server running on http://localhost:${port}`);
});
