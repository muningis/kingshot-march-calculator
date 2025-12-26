const BASE_PATH = './dist';

Bun.serve({
  port: 3000,
  async fetch(req) {
    const path = new URL(req.url).pathname;
    const filePath = `${BASE_PATH}${path === '/' ? '/index.html' : path}`;
    const file = Bun.file(filePath);
    return new Response(file);
  },
  error() {
    return new Response(null, { status: 404 });
  },
});

console.info('🚀 Server running at http://localhost:3000/');