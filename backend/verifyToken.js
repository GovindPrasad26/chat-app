// const jwt = require("jsonwebtoken");
// const secret_key = "abcdefghijklmn"; // same key as in login

// // Middleware to verify JWT token
// const verifytoken = (req, res, next) => {
//   try {
//     // Expect token from headers
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
// console.log(token,'kkkkkkkkkkkkkk')
//     if (!token) {
//       return res.status(401).json({
//         ok: false,
//         message: "Access denied, token missing",
//       });
//     }

//     // Verify the token
//     jwt.verify(token, secret_key, (err, decoded) => {
//       if (err) {
//         if (err.name === "TokenExpiredError") {
//           return res.status(401).json({
//             ok: false,
//             message: "Token expired, please login again",
//           });
//         }
//         return res.status(403).json({
//           ok: false,
//           message: "Invalid token",
//         });
//       }

//       // Attach decoded user data to request
//       req.userdata = decoded;
//       next();
//     });
//   } catch (error) {
//     res.status(500).json({
//       ok: false,
//       message: "Token verification failed",
//       error: error.message,
//     });
//   }
// };

// module.exports = verifytoken;

const jwt = require("jsonwebtoken");
const secret_key = "abcdefghijklmn";

const verifytoken = (req, res, next) => {
  console.log("🛠 verifyToken middleware running...");

  const authHeader = req.headers["authorization"];
  console.log("📦 Received header:", authHeader);

  if (!authHeader) {
    console.log("❌ No Authorization header found");
    return res.status(401).json({ ok: false, message: "Missing Authorization header" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔑 Extracted token:", token);

  if (!token) {
    console.log("❌ Token missing after Bearer split");
    return res.status(401).json({ ok: false, message: "Token missing" });
  }

  jwt.verify(token, secret_key, (err, decoded) => {
    if (err) {
      console.log("❌ JWT verify error:", err.message);
      return res.status(403).json({ ok: false, message: "Invalid or expired token" });
    }

    console.log("✅ Token verified successfully:", decoded);
    req.userdata = decoded;
   console.log(decoded,'kjfrkjf')
    console.log(req.userdata)
    next();
  });
};

module.exports = verifytoken;
