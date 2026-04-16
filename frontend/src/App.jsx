import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { MessageCircleMore, Power } from "lucide-react";

// Components
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ChatBox from "./components/chatbox/chatbox";

// Pages
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Courses from "./pages/Courses/Courses";
import Contact from "./pages/Contact/Contact";
import Admissions from "./pages/Admissions/Admissions";
import ProgramDetail from "./pages/ProgramDetail/ProgramDetail";

import "./App.css";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function AppContent() {
  const [chatboxState, setChatboxState] = useState(false);
  const location = useLocation();

  function toggleChatWindow(newState) {
    setChatboxState(newState);
  }

  return (
    <div className="app-container">
      <Header />
      
      <ScrollToTop />
      
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/programs/:slug" element={<ProgramDetail />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
      
      <button 
        className="chat-toggle-btn glass" 
        onClick={() => toggleChatWindow(!chatboxState)}
        aria-label={chatboxState ? "Turn Off Chatbot" : "Turn On Chatbot"}
        title={chatboxState ? "Turn Off Chatbot" : "Turn On Chatbot"}
        data-active={chatboxState ? "true" : "false"}
      >
        {chatboxState ? <Power size={24} strokeWidth={2.2} /> : <MessageCircleMore size={26} strokeWidth={2.2} />}
        <span className="chat-tooltip text-xs">{chatboxState ? "Turn Off Assistant" : "Turn On Assistant"}</span>
      </button>
      
      <ChatBox
        isActive={chatboxState}
        toggle={() => toggleChatWindow(false)}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
