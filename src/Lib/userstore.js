import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from './Firebase';

export const useUserStore = create((set) => ({
  currentUser: null,
  isloading: true,
  fetchuserInfo: async (uid) => {
      if(!uid) return set ({currentUser: null, isloading: false})


      try {
        const docRef = doc(db, "users", uid);
         const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
    set({currentUser: docSnap.data(), isloading: false})
} 
else{
    set({currentUser: null, isloading: false})
}

      } catch (error) {
        console.log(error)
        return set ({currentUser: null, isloading: false})
      }
  }
}))
