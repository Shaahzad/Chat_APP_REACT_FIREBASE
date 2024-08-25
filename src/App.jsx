import Chat from "./Components/Chat/Chat"
import List from "./Components/List/List"
import Detail from "./Components/Detail/Detail"
import Login from "./Components/Login/Login"
import Notification from "./Components/Notification/Notification"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./Lib/Firebase"
import { useUserStore } from "./Lib/userstore"
import { useChatStore } from "./Lib/userchats"
const App = () => {


  const {currentUser, isloading,fetchuserInfo} = useUserStore()
  const {chatId} = useChatStore()

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchuserInfo(user?.uid)
    })

    return () => {
      unSub()
    }
  }, [fetchuserInfo])

if(isloading) return <div className="loading">Loading....</div>

  return (
    <div className='container'>
      {
       currentUser  ? (
          <>
        <List/>
{ chatId &&     <Chat/>}
{  chatId &&    <Detail/> }          </>
        ) : (<Login/>)
      }

      <Notification/>
    </div>
  )
}

export default App