import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Recipe Book API server is running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🍳 API endpoints: http://localhost:${PORT}/api/recipes`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
