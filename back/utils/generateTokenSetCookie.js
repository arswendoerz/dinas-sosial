import jwt from "jsonwebtoken";

export const generateTokenSetCookie = async (res, user) => {
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction, // harus true untuk sameSite: 'None' di production
    sameSite: isProduction ? "None" : "Lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 hari
  });

  return token;
};
