import dotenv from "dotenv";
dotenv.config();

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const [username, password] = Buffer.from(token, "base64")
    .toString()
    .split(":");

  const expectedUsername = process.env.USER_NAME;
  const expectedPassword = process.env.PASS_WORD;

  if (username === expectedUsername && password === expectedPassword) {
    return next();
  }

  return res.status(401).json({ error: "Unauthorized" });
}

export default authenticate;
