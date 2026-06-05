import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello and welcome to Ikonex Academy!');
});

export default app;
