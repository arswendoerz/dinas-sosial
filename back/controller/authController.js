// import bcryptjs from "bcryptjs";
import bcrypt from "bcrypt";
import { generateTokenSetCookie } from "../utils/generateTokenSetCookie.js";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import db from "../firestore.js";

const usersCollection = db.collection("users");

export const register = async (req, res) => {
  try {
    const { email, password, nama, role } = req.body;

    if (!email || !password || !nama || !role) {
      return res.status(400).json({
        success: false,
        message: "Oooppss! Lengkapi dulu data anda!",
      });
    }

    const userAlreadyExists = await usersCollection
      .where("email", "==", email)
      .get();

    if (!userAlreadyExists.empty) {
      return res.status(400).json({
        success: false,
        message: "Pengguna sudah ada, silahkan masukkan kembali!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const userId = uuidv4();

    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      nama,
      role,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: new Date(Date.now() + 1 + 60 * 60 * 1000),
      createdAt: new Date(),
      lastLogin: null,
      previousLogin: null,
    };

    await usersCollection.doc(userId).set(newUser);

    generateTokenSetCookie(res, newUser);

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

    const snapshot = await usersCollection
      .where("email", "==", email.toLowerCase())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        message: "Ooooppss! Email atau password anda salah",
      });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    // Validasi password after hashing
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Oooppss! Email atau password anda salah",
      });
    }

    // Generate token dan set cookie login
    generateTokenSetCookie(res, user);

    // Update last login time
    await usersCollection.doc(user.id).update({
      previousLogin: user.lastLogin || null,
      lastLogin: new Date(),
    });

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

export const logout = async (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  return res.status(200).json({
    success: true,
    message: "Anda berhasil keluar!",
  });
};

export const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Lengkapi data email, password lama, dan password baru!",
      });
    }

    const snapshot = await usersCollection
      .where("email", "==", email.toLowerCase())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan!",
      });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    // Validasi password lama
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password lama anda salah!",
      });
    }

    // Hash password baru
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password di database
    await usersCollection.doc(user.id).update({
      password: hashedNewPassword,
    });

    return res.status(200).json({
      success: true,
      message: "Password berhasil diubah!",
    });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server!",
    });
  }
};
