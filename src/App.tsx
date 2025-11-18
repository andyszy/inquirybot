import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClockCounterClockwise } from "@phosphor-icons/react";
import Anthropic from "@anthropic-ai/sdk";
import { Header } from "./components/Header.tsx";
import { SearchForm } from "./components/SearchForm.tsx";
import { InquiryList } from "./components/InquiryList.tsx";
import { InquiryHistory } from "./components/InquiryHistory.tsx";
import { LoadingState } from "./components/LoadingState.tsx";
import { ErrorMessage } from "./components/ErrorMessage.tsx";
import { useDarkMode } from "./hooks/useDarkMode.ts";
import { useLocalStorage } from "./hooks/useLocalStorage.ts";
import type { Inquiry } from "./types/index.ts";

function App() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [inquiries, setInquiries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useDarkMode();
  const [history, setHistory] = useLocalStorage<Inquiry[]>(
    "inquiryHistory",
    []
  );
  const [showHistory, setShowHistory] = useState(false);

  const generateInquiries = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setInquiries([]);

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

      if (!apiKey || apiKey === "your_api_key_here") {
        throw new Error("Please set your Anthropic API key in the .env file");
      }

      const client = new Anthropic({
        apiKey,
        dangerouslyAllowBrowser: true,
      });

      const prompt = `You are an aristocratic tutor

For each topic the student specifies output a list of potential inquiries. Prioritize interestingness and intellectual depth over comprehensiveness. Good: unsolved problems, moral dilemmas, awkward questions. Bad: restating the question, topics with simple answers, "trivia" or memorization questions.

Example topic: plane crashes
Example answer
- why do jet engines stall
- why do we need the aviation alphabet
- why do airports use trained falcons
- why does etops exist
- why do first class customers board first
- why did the Concorde fail
- why don't we have flying cars yet
- why do we have electric cars but not electric planes

Topic: ${topic}`;

      const message = await client.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      // Extract text from response
      const responseText = message.content
        .filter((block) => block.type === "text")
        .map((block) => ("text" in block ? block.text : ""))
        .join("");

      // Parse the response into individual inquiries
      const inquiryList = responseText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("-"))
        .map((line) => line.substring(1).trim());

      setInquiries(inquiryList);

      // Save to history
      if (inquiryList.length > 0) {
        const newInquiry: Inquiry = {
          id: Date.now().toString(),
          topic,
          questions: inquiryList,
          timestamp: Date.now(),
        };
        setHistory([newInquiry, ...history].slice(0, 50)); // Keep last 50
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error generating inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateInquiries();
  };

  const handleSelectInquiry = (inquiry: Inquiry) => {
    setTopic(inquiry.topic);
    setInquiries(inquiry.questions);
    setError(null);
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      setHistory([]);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleQuestionClick = (question: string) => {
    // Navigate to a new chat session with the question and topic in state
    navigate('/chat/new', { 
      state: { 
        topic, 
        questions: inquiries, 
        selectedQuestion: question 
      } 
    });
  };

  const hasResults = inquiries.length > 0 || loading;

  return (
    <div className="min-h-screen bg-ivory dark:bg-[#1A1A1A] paper-texture transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        <Header
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          minimized={hasResults}
        />

        <div className="bg-pearl/95 dark:bg-charcoal/20 backdrop-blur-sm rounded-lg shadow-2xl shadow-burgundy/10 p-8 sm:p-12 mb-8 border-[0.5px] border-champagne/20 dark:border-champagne/30 relative overflow-hidden">
          <div className="relative z-10">
            <SearchForm
              topic={topic}
              loading={loading}
              onTopicChange={setTopic}
              onSubmit={handleSubmit}
            />

            {error && <ErrorMessage message={error} />}

            {loading && <LoadingState />}

            {!loading && inquiries.length > 0 && (
              <InquiryList
                topic={topic}
                inquiries={inquiries}
                onQuestionClick={handleQuestionClick}
              />
            )}
          </div>
        </div>

        {/* History Button */}
        {history.length > 0 && (
          <button
            onClick={() => setShowHistory(true)}
            className="fixed bottom-6 right-6 p-4 bg-navy text-pearl rounded-full shadow-2xl shadow-burgundy/30 hover:bg-navy-deep hover:scale-110 transition-all duration-300 group z-30 border-[0.5px] border-champagne"
            aria-label="View history"
          >
            <ClockCounterClockwise
              size={24}
              weight="bold"
              className="group-hover:rotate-12 transition-transform duration-300"
            />
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-emerald text-pearl text-xs font-serif font-bold rounded-full flex items-center justify-center shadow-lg border border-champagne">
              {history.length > 9 ? "9+" : history.length}
            </span>
          </button>
        )}

        <InquiryHistory
          history={history}
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          onSelectInquiry={handleSelectInquiry}
          onClearHistory={handleClearHistory}
        />

        <footer className="text-center text-sm text-charcoal-light/60 dark:text-[#E8E6E0]/50 mt-8 font-decorative italic">
          <div className="ornament">Powered by Claude 3.5 Sonnet</div>
        </footer>
      </div>
    </div>
  );
}

export default App;
