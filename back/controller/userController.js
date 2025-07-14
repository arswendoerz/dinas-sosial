import db from "../firestore.js";

const usersCollection = db.collection("users");

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userDoc = await usersCollection.doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    const userData = userDoc.data();

    res.status(200).json({
      success: true,
      data: {
        email: userData.email,
        name: userData.nama,
        role: userData.role,
        lastLogin: userData.previousLogin
          ? new Intl.DateTimeFormat("id-ID", {
              dateStyle: "long",
              timeStyle: "medium",
              timeZone: "Asia/Jakarta",
            }).format(userData.previousLogin.toDate())
          : null,
      },
    });
  } catch (err) {
    console.error("Error getting profile:", err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};
