import React, { useEffect, useRef, useState } from 'react'
import "./Chat.css"
import EmojiPicker from "emoji-picker-react";
import { db } from '../../Lib/Firebase'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { useChatStore } from '../../Lib/userchats';
import { useUserStore } from '../../Lib/userstore';
import upload from '../../Lib/upload';

const Chat = () => {
  const [text, setText] = useState("")
  const [open, setopen] = useState(false)
  const [chat, setChat] = useState([])
  const [img, setImg] = useState({
    file: null,
    url: "",
  })

  const {chatId, user, isCurrentUserBLocked, isReceiverBlocked} = useChatStore()
  const {currentUser} = useUserStore()

const endRef = useRef(null)

useEffect(()=>{
  endRef.current?.scrollIntoView({ behavior: "smooth" })
},[])


useEffect(()=>{
const unSub = onSnapshot(doc(db, "chats", chatId), async (res) => {
  setChat(res.data())
})
return () => {
  unSub()
}
},[chatId])

  const onEmojiClick = (e)=>{
    setText((prev)=> prev + e.emoji)
    setopen(false)
  }


  const Handlesend = async () => {
    if(text === "") return


    let imgUrl = null

    if(img.file){
      imgUrl = await upload(img.file)
    }

  try {
  await updateDoc(doc(db, "chats", chatId), {
  Message:arrayUnion({
  senderId: currentUser.id,
  text,
  createdAt: new Date(), 
  ...(imgUrl && {img:imgUrl})
}),
})


  const userIds = [currentUser.id, user.id]

  userIds.forEach(async (id) => {
    const userchatRef = doc(db, "userChats", id)
    const userchatsnapshot = await getDoc(userchatRef)
    if(userchatsnapshot.exists()){
        const userchatsData = userchatsnapshot.data()
        const chatindex = userchatsData.chats.findIndex((chat)=> chat.chatId === chatId)

        userchatsData.chats[chatindex].lastMessage = text;
        userchatsData.chats[chatindex].isSeen = id === currentUser.id ? true : false;
        userchatsData.chats[chatindex].updatedAt = Date.now()
      
        await updateDoc(userchatRef, {
          chats: userchatsData.chats
        })
      }
  })
    } catch (error) {
      console.log(error)
    }

    setImg({
      file: null,
      url: "",
    })

    setText("")
  }



  const HandleImg = (e) => {
    if(e.target.files[0]){
    setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
    })
}
}


  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={user.Avatar || "./avatar.png"} alt="" />
          <div className="text">
            <span>{user.username}</span>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quas, consequatur!</p>
          </div>
        </div>
        <div className="icon">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
       {
        chat?.Message?.map((message) => (
          <div className={message.senderId === currentUser.id ? "message own" : "message"} key={message.createAt}>
          <div className="texts">
            {message.img && <img src={message.img} alt="" />}
            <p>
              {message.text}
            </p>
            <span>{message.createAt}</span>
          </div>
        </div>
        )
       )}     
       {
        img.url && <div className='message own'>
        <div className='texts'>
        <img src={img.url}alt="" />
        </div>
        </div>
       } 
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
        <label htmlFor="file">
        <img src="./img.png" alt="" />
        </label>
        <input type="file" style={{ display: "none" }} id="file" onChange={HandleImg} />
        <img src="./camera.png" alt="" />
        <img src="./mic.png" alt="" />
        </div>
        <input type="text" placeholder={isCurrentUserBLocked || isReceiverBlocked ? 'You are blocked' : 'Type a Message....'} onChange={(e) => setText(e.target.value)}
        value={text}
        disabled={isCurrentUserBLocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img src="./emoji.png" alt="" onClick={() => setopen(!open)}/>
          <div className="picker">
          <EmojiPicker open={open} onEmojiClick={onEmojiClick}/>
          </div>
        </div>
        <button className='send' onClick={Handlesend} disabled={isCurrentUserBLocked || isReceiverBlocked}>Send</button>
      </div>
    </div>
  )
}

export default Chat