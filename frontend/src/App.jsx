import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocketchat } from "@fortawesome/free-brands-svg-icons";
import "./App.css";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Features from "./components/Features/Features";
import Footer from "./components/Footer/Footer";
import ChatBox from "./components/chatbox/chatbox";

function App() {
  const [chatboxState, setChatboxState] = useState(false);

  function toggleChatWindow(newState) {
    setChatboxState(newState);
  }

  return (
    <div className="app-container">
      <div className="main-content bg-custom-image">
        <Header />
        <Hero />
        <Features />
        <Footer />
      </div>
      
      <button 
        className="control-button" 
        onClick={() => toggleChatWindow(true)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 1002,
        }}
      >
        <FontAwesomeIcon icon={faRocketchat} />
        <span className="chat-tooltip">Need Help? Chat with us!</span>
      </button>
      
      <ChatBox
        isActive={chatboxState}
        toggle={() => toggleChatWindow(false)}
      />
    </div>
  );
}

export default App;
