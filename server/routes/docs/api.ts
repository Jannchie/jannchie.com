export default defineEventHandler(() => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jannchie API Reference</title>
  <meta name="description" content="OpenAPI documentation for Jannchie developer and agent integrations.">
  <link rel="icon" type="image/png" href="/favicon.ico">
</head>
<body style="margin:0;padding:0">
  <script
    id="api-reference"
    type="application/json"
    data-configuration='{"spec":{"url":"/openapi.json"}}'
  ></script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.28.14/dist/browser/standalone.js"></script>
</body>
</html>`
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  })
})
