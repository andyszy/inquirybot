import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Chat } from '../components/Chat';
import { QuestionSidebar } from '../components/QuestionSidebar';
import { Toast } from '../components/Toast';
import { useDarkMode } from '../hooks/useDarkMode';
import { useChat, type Message } from '../hooks/useChat';
import { ShareNetwork, Moon, Sun } from '@phosphor-icons/react';

interface ChatPageState {
  topic?: string;
  questions?: string[];
  selectedQuestion?: string;
  messages?: Message[];
  sessionId?: string;
}

export function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useDarkMode();
  const hasLoadedRef = useRef(false);
  
  const locationState = location.state as ChatPageState;
  
  const [topic, setTopic] = useState(locationState?.topic || '');
  const [questions, setQuestions] = useState<string[]>(locationState?.questions || []);
  const [selectedQuestion, setSelectedQuestion] = useState(locationState?.selectedQuestion || '');
  const [loading, setLoading] = useState(!locationState); // Skip loading if we have state
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const {
    messages,
    isLoading: isChatLoading,
    error: chatError,
    sendMessage,
    loadMessages,
  } = useChat({
    sessionId: id,
    topic,
    questions,
    selectedQuestion,
  });

  // Reset the loaded ref when ID changes
  useEffect(() => {
    hasLoadedRef.current = false;
  }, [id]);

  useEffect(() => {
    // Prevent infinite loops - only load once per session ID
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    
    // If we have location state from navigation, use it and skip the API call
    if (locationState?.messages) {
      console.log('Using cached session data from navigation state');
      loadMessages(locationState.messages);
      setLoading(false);
      return;
    }

    // Otherwise, fetch from API
    const fetchSession = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/chat/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Chat session not found');
          }
          throw new Error('Failed to load chat session');
        }

        const data = await response.json();
        setTopic(data.topic);
        setQuestions(data.questions);
        setSelectedQuestion(data.selectedQuestion);
        loadMessages(data.messages as Message[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching session:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleQuestionClick = (_question: string) => {
    // Don't allow switching questions in shared chat view
    // Could be enhanced to create a new session
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

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-[#1A1A1A] paper-texture transition-colors duration-500 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-navy dark:border-[#5B89B3] border-t-transparent mb-4"></div>
          <p className="text-charcoal dark:text-[#E8E6E0] font-body">Loading chat session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-[#1A1A1A] paper-texture transition-colors duration-500 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-serif font-bold text-navy dark:text-[#5B89B3] mb-4">
            Oops!
          </h2>
          <p className="text-charcoal dark:text-[#E8E6E0] font-body mb-6">{error}</p>
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-navy dark:bg-[#5B89B3] text-pearl rounded-lg font-serif hover:opacity-90 transition-opacity"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

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
          <div className="flex-1 flex flex-col bg-pearl/95 dark:bg-charcoal/20 backdrop-blur-sm relative overflow-hidden border-l-2 border-champagne/20">
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

