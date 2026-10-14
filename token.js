// Vercel serverless function: exchanges the OAuth code for an access token.
// Needs the environment variable DERIV_CLIENT_ID (Vercel: Settings -> Environment Variables).
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const body = req.body || {};
  const code = body.code;
  const codeVerifier = body.code_verifier;
  const redirectUri = body.redirect_uri;

  if (!code || !codeVerifier || !redirectUri) {
    return res.status(400).json({ error: "missing_parameters" });
  }
  if (!process.env.DERIV_CLIENT_ID) {
    return res.status(500).json({ error: "server_not_configured" });
  }

  try {
    const r = await fetch("https://auth.deriv.com/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.DERIV_CLIENT_ID,
        code: code,
        code_verifier: codeVerifier,
        redirect_uri: redirectUri
      })
    });
    const data = await r.json();
    return res.status(r.ok ? 200 : 400).json(
      r.ok ? { access_token: data.access_token, expires_in: data.expires_in } : { error: "token_exchange_failed" }
    );
  } catch (e) {
    return res.status(502).json({ error: "upstream_error" });
  }
};
