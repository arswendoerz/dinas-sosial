import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

const AuthenticatedBarrier = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          "https://archive-sos-drive.et.r.appspot.com/api/user/profile",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        if (!data.success) throw new Error("Unauthorized");

        setLoading(false);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        navigate({ to: "/" });
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) return <div className="p-4">Memuat halaman...</div>;

  return <>{children}</>;
};

export default AuthenticatedBarrier;
