import createApp from './app';

const PORT = process.env.PORT || 3000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Upload endpoint: http://localhost:${PORT}/upload`);
  console.log(`Vehicles endpoint: http://localhost:${PORT}/vehicles`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});