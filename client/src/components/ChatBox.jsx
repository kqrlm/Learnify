import React, { useState, useEffect, useRef } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'

const ChatBox = () => {

  const containerRef = useRef(null) // <-- useRef is now defined

  const { selectedChat, theme, user, axios, token, setUser } = useAppContext()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('text')

  const onSubmit = async (e) => {
      try {
        e.preventDefault()
        if(!user) return toast('Login to ask questions')
          setLoading(true)
          const promptCopy = prompt
          setPrompt('')
          setMessages(prev => [...prev, {role: 'user', content: prompt, timestamp: Date.now(), isImage: false }])

          const {data} = await axios.post(`/api/chat/${mode}`, {chatId: selectedChat._id, prompt: prompt}, {
            headers: {Authorization: `Bearer ${token}`}
          })

            if(data.success){
              setMessages(prev => [...prev, data.reply])
            } else {
              toast.error(data.message)
            }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message)
      }finally{
        setPrompt('')
        setLoading(false)
      }
  }

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || [])
    } else {
      setMessages([])
    }
  }, [selectedChat])

  useEffect(() => {
    if(containerRef.current){
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

  const showEmptyState = !selectedChat || messages.length === 0

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
      {/* CHAT AREA */}
      <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
        {showEmptyState && (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
            <img
              src={theme === 'dark' ? assets.logo_white_full : assets.logo_dark_full}
              alt="logo"
              className="w-full max-w-56 sm:max-w-64 opacity-90"
            />
            <p className="mt-4 text-3xl sm:text-5xl font-semibold text-gray-400 dark:text-gray-200">
              Ask me anything
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {/* loading animation */}
        {loading && (
          <div className='loader flex items-center gap-1.5'>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
          </div>
        )}
      </div>

      {/* INPUT BOX */}
      <form onSubmit={onSubmit} className='bg-primary/20 dark:bg-[#00008b]/30 border border-primary dark:border-[#00bfff]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center'>
        <select onChange={(e)=>setMode(e.target.value)} value={mode} className='text-sm pl-3 pr-2 outline-none'>
          <option className='dark:bg-purple-900' value="text">Text</option> 
          <option className='dark:bg-purple-900'  value="image">Image</option>
        </select>
        <input onChange={(e)=>setPrompt(e.target.value)} value={prompt} type="text" placeholder="Just Ask Me" className='flex-1 w-full text-sm outline-none' required/>

        <button disabled={loading}> 
          <img src={loading ? assets.stop_icon : assets.send_icon} className='w-8 cursor-pointer' alt="" />
        </button>
      </form>
    </div>
  )
}

export default ChatBox
