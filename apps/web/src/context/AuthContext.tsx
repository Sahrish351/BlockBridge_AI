import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export type UserRole = 'resident' | 'small_business' | 'partner' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  role: UserRole;
  created_at?: string;
}

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  role: UserRole;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  signInDemoRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_PERSONAS: Record<UserRole, UserProfile> = {
  resident: {
    id: 'demo-resident-keisha',
    email: 'keisha.jenkins@community.org',
    display_name: 'Keisha Jenkins',
    role: 'resident',
  },
  small_business: {
    id: 'demo-business-marcus',
    email: 'marcus.vance@vanceroasters.com',
    display_name: 'Marcus Vance',
    role: 'small_business',
  },
  partner: {
    id: 'demo-partner-westside',
    email: 'coordinator@westsidefuturefund.org',
    display_name: 'Westside Community Partner',
    role: 'partner',
  },
  admin: {
    id: 'demo-admin-reviewer',
    email: 'civic.reviewer@blockbridge.org',
    display_name: 'Senior Civic Reviewer',
    role: 'admin',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load active session from Supabase or localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      // Check localStorage for demo persona first
      const storedDemo = localStorage.getItem('bb_demo_profile');
      if (storedDemo) {
        try {
          const parsed = JSON.parse(storedDemo);
          setProfile(parsed);
          setUser({ id: parsed.id, email: parsed.email });
          setIsLoading(false);
          return;
        } catch {
          localStorage.removeItem('bb_demo_profile');
        }
      }

      // Check real Supabase session
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const metaRole = (session.user.user_metadata?.role as UserRole) || 'resident';
          const metaName = session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Community Member';
          setProfile({
            id: session.user.id,
            email: session.user.email || '',
            display_name: metaName,
            role: metaRole,
          });
        }
      } catch (err) {
        console.warn('Supabase auth initialization:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen to real Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const metaRole = (session.user.user_metadata?.role as UserRole) || 'resident';
        const metaName = session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Community Member';
        setProfile({
          id: session.user.id,
          email: session.user.email || '',
          display_name: metaName,
          role: metaRole,
        });
        localStorage.removeItem('bb_demo_profile');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        const metaRole = (data.user.user_metadata?.role as UserRole) || 'resident';
        const metaName = data.user.user_metadata?.display_name || data.user.email?.split('@')[0] || 'Community Member';
        const newProf: UserProfile = {
          id: data.user.id,
          email: data.user.email || '',
          display_name: metaName,
          role: metaRole,
        };
        setProfile(newProf);
        localStorage.removeItem('bb_demo_profile');
      }

      setIsLoading(false);
      return { error: null };
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || 'Authentication error occurred.' };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole
  ): Promise<{ error: string | null }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role,
          },
        },
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        const newProf: UserProfile = {
          id: data.user.id,
          email: data.user.email || '',
          display_name: displayName,
          role,
        };
        setProfile(newProf);
        localStorage.removeItem('bb_demo_profile');
      }

      setIsLoading(false);
      return { error: null };
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || 'Registration failed.' };
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    } finally {
      localStorage.removeItem('bb_demo_profile');
      setUser(null);
      setProfile(null);
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?reset=true`,
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Password reset request failed.' };
    }
  };

  const signInDemoRole = async (role: UserRole) => {
    setIsLoading(true);
    const demoProf = DEMO_PERSONAS[role];
    localStorage.setItem('bb_demo_profile', JSON.stringify(demoProf));
    setProfile(demoProf);
    setUser({ id: demoProf.id, email: demoProf.email });
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: profile?.role || 'resident',
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        signInDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

