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

const DEMO_PERSONAS: Record<UserRole, UserProfile & { password?: string }> = {
  resident: {
    id: 'c79e1926-a3a6-41ec-88ef-bd06272ca7ac',
    email: 'keisha.jenkins@blockbridge.org',
    display_name: 'Keisha Jenkins',
    role: 'resident',
  },
  small_business: {
    id: 'ede69e22-4380-4374-b988-75ef4cb89ca4',
    email: 'marcus.vance@vanceroasters.com',
    display_name: 'Marcus Vance',
    role: 'small_business',
  },
  partner: {
    id: '0bd8eabf-c37d-4393-864f-25e334981207',
    email: 'coordinator@westsidefuturefund.org',
    display_name: 'Westside Community Partner',
    role: 'partner',
  },
  admin: {
    id: 'e3aeab14-f80d-466a-bb96-39d3501de48e',
    email: 'civic.reviewer@blockbridge.org',
    display_name: 'Senior Civic Reviewer',
    role: 'admin',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      const storedDemo = localStorage.getItem('bb_demo_profile');
      if (storedDemo) {
        try {
          const parsed = JSON.parse(storedDemo);
          setProfile(parsed);
          setUser({ id: parsed.id, email: parsed.email });
        } catch {
          localStorage.removeItem('bb_demo_profile');
        }
      }

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
        } else if (!storedDemo && import.meta.env.VITE_DEMO_MODE === 'true' && !sessionStorage.getItem('bb_explicit_signout')) {
          const defaultDemo = DEMO_PERSONAS.resident;
          try {
            const { data } = await supabase.auth.signInWithPassword({
              email: defaultDemo.email,
              password: 'DemoPassword2026!',
            });
            if (data?.user) {
              setUser(data.user);
              setProfile({
                id: data.user.id,
                email: data.user.email || defaultDemo.email,
                display_name: defaultDemo.display_name,
                role: defaultDemo.role,
              });
              localStorage.setItem('bb_demo_profile', JSON.stringify(defaultDemo));
            }
          } catch {}
        }
      } catch (err) {
        console.warn('Supabase auth initialization:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

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
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    sessionStorage.removeItem('bb_explicit_signout');
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
    } finally {
      localStorage.removeItem('bb_demo_profile');
      sessionStorage.setItem('bb_explicit_signout', 'true');
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
    sessionStorage.removeItem('bb_explicit_signout');
    setIsLoading(true);
    const demoProf = DEMO_PERSONAS[role];
    try {
      const { data } = await supabase.auth.signInWithPassword({
        email: demoProf.email,
        password: 'DemoPassword2026!',
      });
      if (data?.user) {
        setUser(data.user);
        setProfile({
          id: data.user.id,
          email: data.user.email || demoProf.email,
          display_name: demoProf.display_name,
          role: demoProf.role,
        });
        localStorage.setItem('bb_demo_profile', JSON.stringify(demoProf));
        setIsLoading(false);
        return;
      }
    } catch {}

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
