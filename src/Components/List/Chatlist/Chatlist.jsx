import React, { useEffect, useState } from 'react'
import './Chatlist.css'
import Adduser from '../../AddNewUser/Adduser'
import { useUserStore } from '../../../Lib/userstore'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../../Lib/Firebase'
import { useChatStore } from '../../../Lib/userchats'

const Chatlist = () => {
  const [addMode,setaddMode] = useState(false)
  const [chats,setChats] = useState([])
  const [input,setinput] = useState("")


  const {currentUser} = useUserStore()
  const {chatId, changeChat} = useChatStore()


  useEffect(() => {
    const unsub = onSnapshot(doc(db, "userChats", currentUser.id), async (res) => {
      const item = res.data().chats;


      const promises = item?.map(async (item) => {
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);


        const user = userDocSnap.data();
        return {...item, user};
      })

      const ChatData = await Promise.all(promises)
      setChats(ChatData.sort((a, b) => b.updatedAt - a.updatedAt));
  });

    return () => {
      unsub()
    }


  }, [currentUser.id]);


  const HandleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const {user, ...rest} = item

      return rest
    })
    const chatIndex = userChats.findIndex((item) => item.chatId === chat.chatId)

    userChats[chatIndex].isSeen = true
    const userChatRef = doc(db, "userChats", currentUser.id)


    try {


      await updateDoc(userChatRef, {
        chats: userChats
      })
      changeChat(chat.chatId, chat.user)      
    } catch (error) {
      console.log(error)
    }


  }


  const filteredChats = chats.filter((chat) => chat.user.username.toLowerCase().includes(input.toLowerCase()))

  return (
    <div className='chatlist'>
    <div className="search">
    <div className="searchBar">
    <img src="./search.png" alt="" />
    <input type="text" placeholder='Search'  onChange={(e) => setinput(e.target.value)}/>
    </div>
    <img src={addMode ? "./minus.png" : "./plus.png"} alt="" className='add'
    onClick={() => setaddMode(!addMode)}
    />
    </div>
    {filteredChats.map((chat) => (
    <div className="item" key={chat.chatId} onClick={() => HandleSelect(chat)}
    style={{backgroundColor: chat.isSeen ? "transparent" : "#5183f3"}}
    >
      <img src={chat.user.block.includes(currentUser.id) ? "./avatar.png" : chat.user.Avatar || "./avatar.png"} alt="" />
      <div className="texts">
        <span>{chat.user.block.includes(currentUser.id) ? "User" : chat.user.username}</span>
        <p>{chat.lastMessage}</p>
      </div>
    </div>
    ))}
{addMode && <Adduser/>}    
</div>
  )
}

export default Chatlist