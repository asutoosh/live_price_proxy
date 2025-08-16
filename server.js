// Simple Express proxy to Binance USDⓈ-M Futures
// Node 18+ has global fetch — no node-fetch needed.
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('*', async (req, res) => {
  try {
    const target = 'https://fapi.binance.com' + req.originalUrl;
    const r = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json, text/plain, */*',
        'Cache-Control': 'no-store'
      }
    });

    res.status(r.status);
    res.set('Content-Type', r.headers.get('content-type') || 'application/json');
    res.set('Cache-Control', 'no-store');

    // Stream the response through
    if (r.body && r.body.pipe) {
      r.body.pipe(res);
    } else {
      const text = await r.text();
      res.send(text);
    }
  } catch (e) {
    res.status(502).json({ error: 'proxy_failed', detail: String(e) });
  }
});

app.listen(PORT, () => {
  console.log('Proxy listening on ' + PORT);
});
