// Vercel serverless function: lists the signed-in user's Deriv accounts.
module.exports = async function handler(req, res) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    const r = await fetch("https://api.derivws.com/trading/v1/options/accounts", {
      headers: { Authorization: auth }
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(502).json({ error: "upstream_error" });
  }
};
