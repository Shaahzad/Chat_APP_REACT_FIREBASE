import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from './Firebase';
import { useUserStore } from './userstore';

export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBLocked: false,
  isReceiverBlocked: false,
  changeChat: (chatId, user) => {
    const currentuser = useUserStore.getState().currentUser


    if(user.block.includes(currentuser.id)){
      return set({
        chatId,
        user: null,
        isCurrentUserBLocked: true,
        isReceiverBlocked: false,      
      })
  }


  else if(currentuser.block.includes(user.id)){
    return set({
      chatId,
      user: user,
      isCurrentUserBLocked: false,
      isReceiverBlocked: true,      
    })
}

  else{
    return set({
      chatId,
      user,
      isCurrentUserBLocked: false,
      isReceiverBlocked: false,
    })
  }
},


changeBlock: ()=>{
  set(state=>({...state, isReceiverBlocked: !state.isReceiverBlocked}))
}





}));
