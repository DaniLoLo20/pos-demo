import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, logout as logoutApi, getSession } from "../api/auth";
import { getProfile } from "../api/profile";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Cargar sesión al iniciar
  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);

      getProfile()
        .then((data) => setProfile(data))
        .catch(() => setProfile(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // 🔑 LOGIN
  const login = async (email, password) => {
    const loggedUser = await loginRequest(email, password);
    setUser(loggedUser);

    const profileData = await getProfile();
    setProfile(profileData);
  };

  // 🔴 LOGOUT
  const logout = () => {
    logoutApi();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🪝 Hook bonito
export const useAuth = () => {
  return useContext(AuthContext);
};
