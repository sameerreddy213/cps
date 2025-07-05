// // server/src/middleware/sessionAuth.ts
// import { Request, Response, NextFunction } from "express";
// module.exports = (req:Request, res:Response, next) => {
//   if (!req.session.user) {
//     return res.status(401).json({ error: "Authentication required" });
//   }
//   req.user = req.session.user;
//   next();
// };