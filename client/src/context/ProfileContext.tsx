// src/context/ProfileContext.tsx
// Fetches profile ONCE from backend — shared across all pages

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { profileAPI } from '@/services/api';
import { Profile } from '@/types';

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  refetch: () => void;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loading: true,
  refetch: () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await profileAPI.get();
      setProfile(res.data.profile);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, refetch: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
