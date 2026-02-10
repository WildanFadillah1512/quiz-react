import { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signOut
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            // Only set user if email is verified (or null)
            if (firebaseUser && firebaseUser.emailVerified) {
                setUser(firebaseUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (!result.user.emailVerified) {
            await signOut(auth);
            throw { code: 'auth/email-not-verified', message: 'Email belum diverifikasi' };
        }
        return result;
    };

    const register = async (email, password) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        // Send verification email
        await sendEmailVerification(result.user);
        // Sign out immediately — user must verify first
        await signOut(auth);
        return result;
    };

    const resendVerification = async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (!result.user.emailVerified) {
            await sendEmailVerification(result.user);
            await signOut(auth);
        }
        return result;
    };

    const logout = async () => {
        return signOut(auth);
    };

    const value = {
        user,
        loading,
        login,
        register,
        resendVerification,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
