import { db, auth } from '../firebase';
import { collection, doc, getDoc, setDoc, addDoc, onSnapshot, query, where, orderBy, limit, Timestamp, serverTimestamp } from 'firebase/firestore';
import { UserProfile, Reward, Bin, RecyclingHistory } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
};

export const createUserProfile = async (profile: UserProfile) => {
  const path = `users/${profile.uid}`;
  try {
    await setDoc(doc(db, 'users', profile.uid), profile);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getRewards = (callback: (rewards: Reward[]) => void) => {
  const path = 'rewards';
  const q = query(collection(db, 'rewards'), orderBy('pointsCost', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const rewards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reward));
    callback(rewards);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

export const getBins = (callback: (bins: Bin[]) => void) => {
  const path = 'bins';
  return onSnapshot(collection(db, 'bins'), (snapshot) => {
    const bins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bin));
    callback(bins);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

export const getHistory = (userId: string, callback: (history: RecyclingHistory[]) => void) => {
  const path = 'history';
  const q = query(collection(db, 'history'), where('userId', '==', userId), orderBy('timestamp', 'desc'), limit(20));
  return onSnapshot(q, (snapshot) => {
    const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RecyclingHistory));
    callback(history);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

export const addRecyclingEvent = async (event: Omit<RecyclingHistory, 'id'>) => {
  const path = 'history';
  try {
    await addDoc(collection(db, 'history'), {
      ...event,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};
