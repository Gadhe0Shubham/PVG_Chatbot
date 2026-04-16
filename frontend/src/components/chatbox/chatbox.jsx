import React, { useEffect, useRef, useState } from "react";
import "./chatbox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faMicrophone,
  faPaperPlane,
  faExpand,
  faCompress
} from "@fortawesome/free-solid-svg-icons";
import { useSpeechRecognition, useSpeechSynthesis } from "../../hooks/useSpeech";
import ChatApi from "../../api/chatApi";
import Chat from "../chat/chat";
import LoadingDots from "../LoadingDots/LoadingDots";

export default function ChatBox(props) {
  const [chatBoxValue, setChatBoxValue] = useState("");
  const locked = useRef(false);
  const inputRef = useRef(null);
  const divRef = useRef(null)
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const { listen, listening, stop, supported } = useSpeechRecognition({
    onResult: (result) => {
      setChatBoxValue(result);
    },
  });

  useSpeechSynthesis();

  // Function to scroll to bottom smoothly
  const scrollToBottom = () => {
    if (divRef.current) {
      setTimeout(() => {
        divRef.current.scrollTop = divRef.current.scrollHeight;
      }, 100);
    }
  };

  function updateChats(created_by, message, related = null) {
    setChats((chats) => [
      ...chats,
      {
        created_by: created_by,
        message: message,
        related: related,
      },
    ]);
    // Scroll to bottom after adding new message
    scrollToBottom();
  }

  function onDataReceived(data) {
    console.log("Received data:", data); // Debug log
    setIsLoading(false);
    setChatBoxValue("");
    
    // Handle case where data is a string (legacy error handling)
    if (typeof data === 'string') {
      updateChats("server", data);
    }
    // Handle successful responses
    else if (data && data["status"] === 200) {
      const related = data["related"] ? Object.values(data["related"]) : [];
      if (related.length === 0) {
        updateChats("server", data["message"]);
      } else {
        updateChats("server", data["message"], related);
      }
    } 
    // Handle error responses
    else if (data && (data["status"] === 400 || data["status"] === 500)) {
      updateChats("server", data["message"] || "An error occurred");
    }
    // Handle other error cases or malformed responses
    else {
      const errorMessage = data && data["message"] 
        ? data["message"] 
        : "Sorry, I encountered an error. Please try again.";
      updateChats("server", errorMessage);
    }
    
    locked.current = false;
  }

  useEffect(() => {
    if(chats.length === 0) {
      ChatApi.direct_request("welcomegreeting").then(onDataReceived)
    }
    // Scroll to bottom when chats change
    scrollToBottom();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats.length])

  return (
    <div
      className={`chat-box-container flex flex-col ${isMaximized ? 'is-maximized' : ''}`}
      style={{
        height: props.isActive ? (isMaximized ? "calc(100dvh - 24px)" : "min(620px, calc(100dvh - 120px))") : 0,
        width: props.isActive ? (isMaximized ? "calc(100dvw - 24px)" : "min(420px, calc(100dvw - 24px))") : 0,
        maxWidth: props.isActive ? (isMaximized ? "calc(100dvw - 24px)" : "min(420px, calc(100dvw - 24px))") : 0,
        opacity: props.isActive ? 1 : 0,
        position: 'fixed',
        bottom: props.isActive ? (isMaximized ? "12px" : "96px") : 0,
        right: props.isActive ? "12px" : 0,
        left: props.isActive && isMaximized ? "12px" : "auto",
        top: props.isActive && isMaximized ? "12px" : "auto",
        zIndex: 2000,
        transition: 'all 0.3s ease-in-out',
        borderRadius: isMaximized ? '18px' : '20px',
      }}
    >

      <div className="chat-box-top bg-black h-14 w-full text-white flex items-center px-4">
        <div className="chatbox-logo-ak">
           <img src="/logo.png" alt="PVGCOE Logo" className="chatbox-logo-image" />
        </div>
        <div className="chatbox-title-section-ak">
          <h6 className="font-bold text-sm leading-tight">PVGCOE & SSDIOM AI</h6>
          <p className="text-[10px] opacity-60 leading-tight uppercase font-bold tracking-widest">College Assistant</p>
        </div>
        <span className="flex-1" />
        
        <button
          className="hover:opacity-70 transition-opacity mr-4"
          onClick={() => setIsMaximized(!isMaximized)}
          title={isMaximized ? "Minimize" : "Maximize"}
        >
          <FontAwesomeIcon className="text-xl" icon={isMaximized ? faCompress : faExpand} />
        </button>
        <button
          className="hover:text-red-400 transition-colors"
          onClick={() => {
            setIsMaximized(false);
            props.toggle();
          }}
        >
          <FontAwesomeIcon className="text-xl" icon={faXmark} />
        </button>

      </div>
      <div className="chat-box-middle flex-1" ref={divRef}>
        <div className="chat-messages-container">
          {chats.map((item, index) => (
            <Chat
              key={`chat-${index}-${Date.now()}`}
              data={item}
              onAction={(klass, text) => {
                if (locked.current) {
                  return;
                }
                locked.current = true;
                setIsLoading(true);
                updateChats("client", text);
                ChatApi.direct_request(klass).then(onDataReceived);
              }}
            />
          ))}
          {isLoading && <LoadingDots />}
        </div>
      </div>
      <div className="chat-box-bottom bg-black h-16 w-full flex items-center justify-center p-3">
        <input
          type="text"
          className="text-sm"
          placeholder="Ask me anything..."
          autoCapitalize="false"
          value={chatBoxValue}
          onChange={(e) => setChatBoxValue(e.target.value)}
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (locked.current || !chatBoxValue.trim()) {
                return;
              }
              locked.current = true;
              setIsLoading(true);
              updateChats("client", chatBoxValue);
              ChatApi.query_request(chatBoxValue).then(onDataReceived).catch(error => {
                console.error("Query request failed:", error);
                setIsLoading(false);
                updateChats("server", "Sorry, I'm having trouble connecting. Please try again.");
                locked.current = false;
              });
            }
          }}
        />
        <button
          className="s2t-mic-btn"
          style={{
            color: listening ? "red" : "black",
          }}
          onClick={() => {
            if (!supported) {
              alert("Sorry! But Your Browser Does Not Supports Voice Inputs");
              return;
            }
            if (listening) {
              stop();
              inputRef.current.focus();
            } else {
              listen();
            }
          }}
        >
          <FontAwesomeIcon className="s2t-mic-btn-icon" icon={faMicrophone} />
        </button>
        <button
          className="hover:text-red-500"
          onClick={() => {
            if (locked.current || !chatBoxValue.trim()) {
              return;
            }
            locked.current = true;
            setIsLoading(true);
            updateChats("client", chatBoxValue);
            ChatApi.query_request(chatBoxValue).then(onDataReceived).catch(error => {
              console.error("Query request failed:", error);
              setIsLoading(false);
              updateChats("server", "Sorry, I'm having trouble connecting. Please try again.");
              locked.current = false;
            });
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
}
