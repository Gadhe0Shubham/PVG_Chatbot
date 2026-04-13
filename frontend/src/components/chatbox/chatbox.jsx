import React, { useEffect, useRef, useState } from "react";
import "./chatbox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faMicrophone,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { useSpeechRecognition, useSpeechSynthesis } from "../../hooks/useSpeech";
import ChatApi from "../../api/chatApi";
import Chat from "../chat/chat";
import LoadingDots from "../LoadingDots/LoadingDots";

export default function ChatBox(props) {
  const [chatBoxValue, setChatBoxValue] = useState("");
  const [micActive, setMicActive] = useState(false);
  const locked = useRef(false);
  const inputRef = useRef(null);
  const divRef = useRef(null)
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { listen, listening, stop, supported } = useSpeechRecognition({
    onResult: (result) => {
      setChatBoxValue(result);
    },
  });

  const { speak } = useSpeechSynthesis();

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
    if (micActive && created_by === "server") {
      speak({ text: message });
    }
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
      className="chat-box-container flex flex-col"
      style={{
        height: props.isActive ? "550px" : 0,
        width: props.isActive ? "400px" : 0,
        opacity: props.isActive ? 1 : 0,
        position: 'fixed',
        bottom: '120px',
        right: '30px',
        zIndex: 1000,
      }}
    >
      <div className="chat-box-top bg-gradient-to-r from-purple-600 to-blue-600 h-14 w-full text-white flex items-center px-4">
        <img src="/logo.png" alt="College Logo" className="chatbox-logo" />
        <div className="chatbox-title-section">
          <h6 className="font-bold text-xs leading-tight">PVGCOE & SSDIOM</h6>
          <p className="text-xs opacity-80 leading-tight">AI Assistant</p>
        </div>
        <span className="flex-1" />
        <button
          className="speach-btn hover:scale-125 m-5"
          style={{
            color: micActive ? "green" : "white",
          }}
          onClick={() => {
            setMicActive(!micActive);
          }}
        >
          <FontAwesomeIcon
            className="text-xl speach-btn-icon"
            icon={faMicrophone}
          />
        </button>
        <button
          className="hover:text-red-400 hover:scale-125"
          onClick={() => props.toggle()}
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
      <div className="chat-box-bottom bg-gradient-to-r from-purple-600 to-blue-600 h-16 w-full flex items-center justify-center p-3">
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
