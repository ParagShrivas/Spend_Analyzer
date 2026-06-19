const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
     try {
          const token = req.cookies?.token;

          if (!token) {
               return res.status(401).json({
                    message: "Unauthorized: No token provided"
               });
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          req.user = {
               id: decoded.id,
               email: decoded.email,
               name: decoded.name
          };

          next();

     } catch (error) {
          return res.status(401).json({
               message: "Invalid or expired token"
          });
     }
};

module.exports = authMiddleware;