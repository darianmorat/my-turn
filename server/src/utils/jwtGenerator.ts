import jwt from "jsonwebtoken";

export const jwtGenerator = (id: string) => {
   const payload = {
      userId: id,
   };

   return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "5h" });
};
