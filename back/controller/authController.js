import bcryptjs from "bcryptjs";
import User from "../model/user.model.js";
import { generateTokenSetCookie } from "../utils/generateTokenSetCookie.js";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export const register = async (req, res) => {
  try {
    console.log("Body Data:", req.body);
    const { email, password, nama, role } = req.body;

    if (!email || !password || !nama || !role) {
      return res.status(400).json({
        success: false,
        message: "Oooppss! Lengkapi dulu data anda!",
      });
    }

    const userAlreadyExists = await User.findOne({ where: { email } });
    if (userAlreadyExists != null) {
      return res.status(400).json({
        success: false,
        message: "Pengguna sudah ada, silahkan masukkan kembali!",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 16);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = await User.create({
      id: uuidv4(),
      email,
      nama,
      role,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: new Date(Date.now() + 1 + 60 * 60 * 1000),
    });

    await user.save();

    generateTokenSetCookie(res, user);

    return res.status(201).json({
      success: true,
      message: "Yeayyy! Pengguna berhasil dibuat",
    });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({
      success: false,
      message: "Server internal sedang bermasalah",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password anda tidak sesuai!",
      });
      // Check if email or password is empty
    } else if (email === "" || password === "") {
      return res.status(400).json({
        success: false,
        message: "Email dan password tidak boleh kosong!",
      });
    }

    // Search for user in the database
    const user = await User.findOne({
      where: { [Op.or]: [{ email: email }] },
    });

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Oooppss! Email atau password anda salah",
      });
    }

    // Validasi password after hashing
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Oooppss! Email atau password anda salah",
      });
    }

    // Generate token dan set cookie login
    generateTokenSetCookie(res, user);

    // Update last login time
    user.previousLogin = user.lastLogin;
    user.lastLogin = new Date();
    await user.save();

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Yeeayy! Anda berhasil login",
    });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const logout = async (res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  return res.status(200).json({
    success: true,
    message: "Anda berhasil keluar!",
  });
};
