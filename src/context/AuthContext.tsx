import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type Result = { error: string | null; info?: string };

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<Result>;
  signIn: (email: string, password: string) => Promise<Result>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string): Promise<Result> => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    // Generic message: never reveal whether an email is already registered
    if (error) {
      return {
        error: 'Could not create the account. Try another email or sign in.',
      };
    }
    if (!data.session) {
      return {
        error: null,
        info: 'Check your email to confirm your account, then sign in.',
      };
    }
    return { error: null };
  };

  const signIn = async (email: string, password: string): Promise<Result> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: 'Incorrect email or password.' };
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}