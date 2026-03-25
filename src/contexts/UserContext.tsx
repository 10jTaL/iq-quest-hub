import { createContext, useContext, useEffect, useState } from "react";
import { useOidcAccessToken } from "@axa-fr/react-oidc";

type Role = "user" | "maitre_du_jeu" | "administrateur";

const UserContext = createContext<{ role: Role | null }>({ role: null });

export const UserProvider = ({ children }) => {
  const { accessTokenPayload } = useOidcAccessToken();
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const email = accessTokenPayload?.email 
               ?? accessTokenPayload?.upn
               ?? accessTokenPayload?.unique_name;

    if (!email) return;

    fetch(`/api/users/role?email=${encodeURIComponent(email)}`)
      .then(r => r.json())
      .then(data => setRole(data.role));
  }, [accessTokenPayload]);

  return (
    <UserContext.Provider value={{ role }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);