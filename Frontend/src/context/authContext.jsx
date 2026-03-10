// import React, { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(() => {
//     // Retrieve login state from localStorage (default to false if not set)
//     return localStorage.getItem("isLoggedIn") === "true";
//   });

//   useEffect(() => {
//     // Save login state to localStorage whenever it changes
//     localStorage.setItem("isLoggedIn", isLoggedIn);
//   }, [isLoggedIn]);

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };




import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

 

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn}}>
      {children}
    </AuthContext.Provider>
  );
};



// import React, { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(() => {
//     // Retrieve login state from localStorage (default to false if not set)
//     return localStorage.getItem("isLoggedIn") === "true";
//   });

//   // ✅ New state for user info (including isECE)
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem("user");
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   useEffect(() => {
//     // Save login state to localStorage whenever it changes
//     localStorage.setItem("isLoggedIn", isLoggedIn);
//   }, [isLoggedIn]);

//   // ✅ Persist user data
//   useEffect(() => {
//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user));
//     } else {
//       localStorage.removeItem("user");
//     }
//   }, [user]);

//   // ✅ Helpers to update user
//   const login = (userData) => {
//     setIsLoggedIn(true);
//     setUser(userData); // userData should include isECE
//   };

//   const logout = () => {
//     setIsLoggedIn(false);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

