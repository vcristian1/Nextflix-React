import { UserRemoveIcon } from '@heroicons/react/outline'
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
  } from 'firebase/auth'
  
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth } from '../firebase'

interface IAuth {
    user: User | null
    signUp: (email: string, password: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    error: string | null
    loading: boolean
  }

const AuthContext = createContext<IAuth>({
    user: null,
    signUp: async () => {},
    signIn: async () => {},
    logout: async () => {},
    error: null,
    loading: false
})

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState(null);
    const router = useRouter()

    const signUp = async (email: string, password: string) => {
        setLoading(true)

        await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            setUser(userCredential.user)
            router.push('/')
            setLoading(false)
            }
        ).catch((error) => alert(error.message))
        .finally(() => setLoading(false))
    }

    const signIn = async (email: string, password: string) => {
        setLoading(true)

        await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            setUser(userCredential.user)
            router.push('/')
            setLoading(false)
            }
        ).catch((error) => alert(error.message))
        .finally(() => setLoading(false))
    }

    const logout = async () => {
        setLoading(true)

        signOut(auth)
          .then(() => {
            setUser(null)
          })
          .catch((error) => alert(error.message))
          .finally(() => setLoading(false))
    }


  const memoedValue = useMemo(() => ({
    user, signUp, signIn, error, loading, logout
  }), [user, loading,])

  return (
  <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  )
}

export default function useAuth() {
    return useContext(AuthContext)
}
