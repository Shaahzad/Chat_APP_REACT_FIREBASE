import React, { useState } from 'react'
import './Adduser.css'
import { db } from '../../Lib/Firebase'
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { useUserStore } from '../../Lib/userstore'
const Adduser = () => {
const [user, setUser] = useState(null)
const {currentUser} = useUserStore()



const HandleAdd = async () => {

const chatRef = collection(db,"chats")
const userChatsRef = collection(db, "userChats")

  try {

    const newChatRef = doc(chatRef)
    await setDoc(newChatRef,{
      createdAt: serverTimestamp(),
      Message: [],
    })

    await updateDoc(doc(userChatsRef, user.id), {

      chats:arrayUnion({
        chatId: newChatRef.id,
        lastMessage: "",
        receiverId: currentUser.id,
        updatedAt: Date.now(),
      })
      
      
    })
    


    await updateDoc(doc(userChatsRef, currentUser.id), {
      chats:arrayUnion({
        chatId: newChatRef.id,
        lastMessage: "",
        receiverId: user.id,
        updatedAt: Date.now(),
      })
      
      
    })

  } catch (error) {
    console.log(error.message)
  }
}

  const HandleSearch = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const username = formData.get('username')



    try {


      const userRef = collection(db, "users");
     const q = query(userRef, where("username", "==", username));

     const querySnapshot = await getDocs(q);


     if(!querySnapshot.empty) {
      setUser(querySnapshot.docs[0].data())
     }
       
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='adduser'>
        <form onSubmit={HandleSearch}>
        <input type="text" placeholder='username' name='username'/>
        <button>Search</button>
        </form>
{     user &&       <div className="user">
                <div className="detail">
                <img src={user.Avatar || "./avatar.png"} alt="" />
                <span>{user.username}</span>
                </div>
                <button onClick={HandleAdd}>Add User</button>
            </div>
            }
    </div>
  )
}

export default Adduser