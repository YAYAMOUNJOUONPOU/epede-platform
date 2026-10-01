import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, testConnection } from './firebase';
import { CanonicalRole, CANONICAL_ROLES } from '../types/engineeringRoles';

export interface EngineerProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  organization?: string;
  roleTitle?: string;
}

export interface UserBookmark {
  id: string;
  userId: string;
  targetType: 'equipment' | 'domain' | 'calculator' | 'diagram' | 'standard';
  targetId: string;
  title: string;
  subtitle?: string;
  notes?: string;
  createdAt?: any;
}

export interface UserCalculationNote {
  id: string;
  userId: string;
  title: string;
  calculatorType: string;
  parameters: string;
  status: 'draft' | 'validated' | 'archived';
  createdAt?: any;
  updatedAt?: any;
}

export interface UserSldAnnotation {
  id: string;
  userId: string;
  topology: string;
  cbStates: Record<string, boolean>;
  notes?: string;
  updatedAt?: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: EngineerProfile | null;
  activeRole: CanonicalRole;
  activeRoleSlug: string;
  setActiveRoleSlug: (slug: string) => Promise<void>;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  bookmarks: UserBookmark[];
  calculationNotes: UserCalculationNote[];
  sldAnnotations: Record<string, UserSldAnnotation>;
  addBookmark: (bookmark: Omit<UserBookmark, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  isBookmarked: (targetId: string) => boolean;
  saveCalculationNote: (note: Omit<UserCalculationNote, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<string>;
  deleteCalculationNote: (id: string) => Promise<void>;
  saveSldAnnotation: (topology: string, cbStates: Record<string, boolean>, notes?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<EngineerProfile | null>(null);
  const [activeRoleSlug, setActiveRoleSlugState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('epede_active_role') || 'protection-engineer';
    }
    return 'protection-engineer';
  });
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<UserBookmark[]>([]);
  const [calculationNotes, setCalculationNotes] = useState<UserCalculationNote[]>([]);
  const [sldAnnotations, setSldAnnotations] = useState<Record<string, UserSldAnnotation>>({});

  const activeRole = useMemo(() => {
    return CANONICAL_ROLES.find((r) => r.slug === activeRoleSlug) || CANONICAL_ROLES[0];
  }, [activeRoleSlug]);

  const setActiveRoleSlug = async (slug: string) => {
    setActiveRoleSlugState(slug);
    if (typeof window !== 'undefined') {
      localStorage.setItem('epede_active_role', slug);
    }
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { roleTitle: slug, updatedAt: serverTimestamp() }, { merge: true });
      } catch (err) {
        console.warn('Could not sync roleTitle to Firestore:', err);
      }
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userProf: EngineerProfile = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          roleTitle: activeRoleSlug,
        };
        setProfile(userProf);

        // Sync or create user profile doc in Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          await setDoc(
            userDocRef,
            {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              photoURL: currentUser.photoURL || '',
              roleTitle: activeRoleSlug,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (err) {
          console.warn('Could not sync user document to Firestore:', err);
        }
      } else {
        setProfile(null);
        setBookmarks([]);
        setCalculationNotes([]);
        setSldAnnotations({});
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeRoleSlug]);

  // Listen to bookmarks when user is logged in
  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      return;
    }
    const bookmarksCol = collection(db, 'users', user.uid, 'bookmarks');
    const unsub = onSnapshot(
      bookmarksCol,
      (snapshot) => {
        const items: UserBookmark[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        setBookmarks(items);
      },
      (error) => {
        console.warn('Bookmarks listener notice:', error.message);
      }
    );
    return () => unsub();
  }, [user]);

  // Listen to calculation notes when user is logged in
  useEffect(() => {
    if (!user) {
      setCalculationNotes([]);
      return;
    }
    const notesCol = collection(db, 'users', user.uid, 'calculationNotes');
    const unsub = onSnapshot(
      notesCol,
      (snapshot) => {
        const items: UserCalculationNote[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        setCalculationNotes(items);
      },
      (error) => {
        console.warn('Calculation notes listener notice:', error.message);
      }
    );
    return () => unsub();
  }, [user]);

  // Listen to SLD annotations when user is logged in
  useEffect(() => {
    if (!user) {
      setSldAnnotations({});
      return;
    }
    const sldCol = collection(db, 'users', user.uid, 'sldAnnotations');
    const unsub = onSnapshot(
      sldCol,
      (snapshot) => {
        const map: Record<string, UserSldAnnotation> = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          let cbStates = {};
          try {
            cbStates = typeof data.cbStates === 'string' ? JSON.parse(data.cbStates) : data.cbStates;
          } catch {
            cbStates = {};
          }
          map[data.topology || docSnap.id] = {
            id: docSnap.id,
            userId: user.uid,
            topology: data.topology || docSnap.id,
            cbStates,
            notes: data.notes || '',
            updatedAt: data.updatedAt,
          };
        });
        setSldAnnotations(map);
      },
      (error) => {
        console.warn('SLD annotations listener notice:', error.message);
      }
    );
    return () => unsub();
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Google Sign-in error:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await fbSignOut(auth);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  const addBookmark = async (data: Omit<UserBookmark, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error('User must be signed in to add bookmarks');
    const bookmarkId = `bm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const docRef = doc(db, 'users', user.uid, 'bookmarks', bookmarkId);
    await setDoc(docRef, {
      id: bookmarkId,
      userId: user.uid,
      targetType: data.targetType,
      targetId: data.targetId,
      title: data.title,
      subtitle: data.subtitle || '',
      notes: data.notes || '',
      createdAt: serverTimestamp(),
    });
  };

  const removeBookmark = async (id: string) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid, 'bookmarks', id);
    await deleteDoc(docRef);
  };

  const isBookmarked = (targetId: string) => {
    return bookmarks.some((b) => b.targetId === targetId);
  };

  const saveCalculationNote = async (
    note: Omit<UserCalculationNote, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    if (!user) throw new Error('User must be signed in to save calculations');
    const noteId = note.id || `calc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const docRef = doc(db, 'users', user.uid, 'calculationNotes', noteId);
    await setDoc(
      docRef,
      {
        id: noteId,
        userId: user.uid,
        title: note.title,
        calculatorType: note.calculatorType,
        parameters: note.parameters,
        status: note.status || 'draft',
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
    return noteId;
  };

  const deleteCalculationNote = async (id: string) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid, 'calculationNotes', id);
    await deleteDoc(docRef);
  };

  const saveSldAnnotation = async (topology: string, cbStates: Record<string, boolean>, notes?: string) => {
    if (!user) throw new Error('User must be signed in to save SLD states');
    const docRef = doc(db, 'users', user.uid, 'sldAnnotations', topology);
    await setDoc(
      docRef,
      {
        id: topology,
        userId: user.uid,
        topology,
        cbStates: JSON.stringify(cbStates),
        notes: notes || '',
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      activeRole,
      activeRoleSlug,
      setActiveRoleSlug,
      loading,
      signInWithGoogle,
      signOutUser,
      bookmarks,
      calculationNotes,
      sldAnnotations,
      addBookmark,
      removeBookmark,
      isBookmarked,
      saveCalculationNote,
      deleteCalculationNote,
      saveSldAnnotation,
    }),
    [user, profile, activeRole, activeRoleSlug, loading, bookmarks, calculationNotes, sldAnnotations]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
