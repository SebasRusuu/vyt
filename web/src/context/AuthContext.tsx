import React, { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

// Tipo para o token decodificado
interface DecodedToken {
    sub: string; // Representa o email
    userName: string; // Representa o nome do usuário
    exp: number; // Expiração do token
}

// Tipo para o contexto de autenticação
interface AuthContextType {
    user: string | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

// Inicialize o contexto
export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: () => {},
    logout: () => {},
});

// Tipo das props do AuthProvider
interface AuthProviderProps {
    children: ReactNode;
}

// Provedor de contexto
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            try {
                setToken(savedToken);
                const decoded: DecodedToken = jwtDecode(savedToken);
                setUser(decoded.userName); // Atualiza para usar o nome do usuário
            } catch (error) {
                console.error("Token inválido:", error);
                localStorage.removeItem("token");
            }
        }
    }, []);

    const login = (token: string) => {
        try {
            const decoded: DecodedToken = jwtDecode(token);
            localStorage.setItem("token", token);
            setToken(token);
            setUser(decoded.userName); // Atualiza para usar o nome do usuário
        } catch (error) {
            console.error("Erro ao decodificar token:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
