import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Sample route
app.get('/', (req, res) => {
  res.send('Server is running successfully!');
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
