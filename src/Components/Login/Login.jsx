import React from 'react'
import "./Login.css"
import { useState } from 'react'
import { toast } from 'react-toastify'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth"
import { auth, db } from '../../Lib/Firebase'
import { doc, setDoc } from 'firebase/firestore'
import upload from '../../Lib/upload'
const Login = () => {
    const [Avatar, setAvatar] = useState(
        {
            file: null,
            url: ""
        }
    )

    const [loading, setLoading] = useState(false)


    const HandleAvatar = (e) => {
        if(e.target.files[0]){
        setAvatar({
            file: e.target.files[0],
            url: URL.createObjectURL(e.target.files[0])
        })
    }
}


const HandleRegister = async (e) => {
    e.preventDefault()

     setLoading(true)
    const formData = new FormData(e.target)

    const {username, email, password} = Object.fromEntries(formData)


    console.log(username, email, password)


    try {

   const res = await createUserWithEmailAndPassword(auth, email, password)

   const imgUrl = await upload(Avatar.file)

   await setDoc(doc(db,  "users", res.user.uid), {
    username,
    email,
    Avatar: imgUrl,
    id: res.user.uid,
    block: [],
  });



  await setDoc(doc(db,  "userChats", res.user.uid), {
   Chat: [],
  });


  toast.success("Account created! You can login now")
        
    } catch (error) {
        console.log(error.message)
        toast.error(error.message)
    }finally{
        setLoading(false)
    }


}



const HandleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)

    const {email, password} = Object.fromEntries(formData)

    try {
 
        await signInWithEmailAndPassword(auth, email, password)


        toast.success("Login Successful!")
        
    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
    finally{
        setLoading(false)
    }
}




  return (
    <div className='login'>
        <div className="item">
            <h2>Welcome Back</h2>
            <form onSubmit={HandleLogin}>
            <input type="email" name="email" id="" placeholder='Email'/>
            <input type="password" name='password' placeholder='Password'/>
            <button disabled={loading}>{loading ? "Loading..." : "Login"}</button>
            </form>
        </div>
        <div className="seprator"></div>
        <div className="item">
            <h2>Create an Account</h2>
            <form onSubmit={HandleRegister}>
                <label htmlFor="file">
                    <img src={Avatar.url || "./avatar.png"} alt="" />
                    Upload an Image</label>
                <input type="file" id='file' style={{display:"none"}}
                onChange={HandleAvatar}
                />
                <input type="text" placeholder='UserName' name='username'/>
                <input type="email" name="email" id="" placeholder='Email'/>
                <input type="password" name='password' placeholder='Password'/>
                <button disabled={loading}>{loading ? "Loading..." : "Register"}</button>
            </form>
        </div>
    </div>
  )
}

export default Login