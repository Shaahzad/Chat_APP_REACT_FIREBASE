import React from 'react'
import "./List.css"
import Chatlist from '../../Components/List/Chatlist/Chatlist'
import Userinfo from '../../Components/List/userinfo/Userinfo'

const List = () => {
  return (
    <div className='list'>
      <Userinfo/>
      <Chatlist/>
    </div>
  )
}

export default List