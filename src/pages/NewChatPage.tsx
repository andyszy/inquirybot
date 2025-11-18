import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chat } from '../components/Chat';
import { QuestionSidebar } from '../components/QuestionSidebar';
import { Toast } from '../components/Toast';
import { useDarkMode } from '../hooks/useDarkMode';
import { useChat } from '../hooks/useChat';
import { ShareNetwork, Moon, Sun } from '@phosphor-icons/react';

interface LocationState {
  topic: string;
  questions: string[];
  selectedQuestion: string;
}

export function NewChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useDarkMode();
  const [showToast, setShowToast] = useState(false);
  const initRef = useRef(false);
  
  const state = location.state as LocationState;
  
  // Redirect to home if no state
  useEffect(() => {
    if (!state || !state.topic || !state.questions || !state.selectedQuestion) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state) {
    return null;
  }

  const { topic, questions, selectedQuestion } = state;

  const handleSessionCreated = (sessionId: string) => {
    console.log('Session created, silently updating URL to:', sessionId);
    // Silently replace the URL without any navigation or reload
    window.history.replaceState(
      { topic, questions, selectedQuestion, sessionId },
      '',
      `/chat/${sessionId}`
    );
  };

  const {
    messages,
    isLoading: isChatLoading,
    error: chatError,
    sendMessage,
  } = useChat({
    topic,
    questions,
    selectedQuestion,
    onSessionCreated: handleSessionCreated,
  });

  // Send initial message on mount
  useEffect(() => {
    if (!initRef.current && messages.length === 0) {
      initRef.current = true;
      console.log('Sending initial message...');
      sendMessage('', selectedQuestion);
    }
  }, [selectedQuestion, sendMessage, messages.length]);

  const handleQuestionClick = (_question: string) => {
    // Don't allow switching questions in this view
  };

  const handleClose = () => {
    navigate('/');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-[#1A1A1A] paper-texture transition-colors duration-500">
      <div className="h-screen flex flex-col">
        <div className="flex-1 flex overflow-hidden">
          {/* Question Sidebar */}
          <div className="w-80 flex-shrink-0 hidden md:block">
            <QuestionSidebar
              topic={topic}
              questions={questions}
              selectedQuestion={selectedQuestion}
              onSelectQuestion={handleQuestionClick}
              onClose={handleClose}
            />
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-pearl/95 dark:bg-charcoal/20 backdrop-blur-sm relative overflow-hidden border-l-[0.5px] border-champagne/20">
            <div className="absolute inset-0 bg-gradient-to-br from-champagne/5 to-navy/5 dark:from-champagne/10 dark:to-navy/10 pointer-events-none paper-texture" />

            {/* Chat Header */}
            <div className="relative z-10 p-6 border-b-[0.5px] border-champagne/30 flex items-center justify-between bg-ivory/50 dark:bg-charcoal/30">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleClose}
                  className="p-2 rounded hover:bg-champagne/20 transition-colors text-navy dark:text-[#5B89B3]"
                >
                  ← Back
                </button>
                <div>
                  <h2 className="text-lg font-serif font-bold text-navy dark:text-[#5B89B3]">
                    Exploring
                  </h2>
                  <p className="text-sm font-body italic text-charcoal-light dark:text-[#E8E6E0]/70">
                    {selectedQuestion}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-gradient-to-r from-navy to-navy-deep hover:from-navy-deep hover:to-navy text-pearl rounded-lg font-serif font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border-[0.5px] border-champagne/30"
                >
                  <ShareNetwork size={20} weight="fill" />
                  <span className="text-sm">Share</span>
                </button>
                <button
                  onClick={toggleDarkMode}
                  className="p-3 rounded-full bg-pearl/80 dark:bg-charcoal/60 border-[0.5px] border-champagne/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <Sun size={20} weight="fill" className="text-champagne group-hover:rotate-180 transition-transform duration-500" />
                  ) : (
                    <Moon size={20} weight="fill" className="text-navy group-hover:-rotate-12 transition-transform duration-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="relative z-10 flex-1 overflow-hidden">
              <Chat
                messages={messages}
                isLoading={isChatLoading}
                onSendMessage={sendMessage}
              />
            </div>

            {chatError && (
              <div className="relative z-10 p-4 m-4 bg-red-50 dark:bg-red-900/20 border-[0.5px] border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">
                {chatError}
              </div>
            )}
          </div>
        </div>
      </div>
      {showToast && (
        <Toast
          message="URL copied to clipboard"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
