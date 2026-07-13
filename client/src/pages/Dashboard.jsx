import { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UploadCard from "../components/UploadCard";
import ChatBox from "../components/ChatBox";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  // 1. Fetch all chat sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoadingHistory(true);
        const res = await api.get("/chat");
        setSessions(res.data);
        if (res.data.length > 0) {
          // Select the most recent session by default
          setActiveSessionId(res.data[0]._id);
        }
      } catch (err) {
        toast.error("Failed to load chat history");
        console.error(err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchSessions();
  }, []);

  // Fetch documents for the active session
  const fetchDocuments = async (sessionId) => {
    if (!sessionId) {
      setDocuments([]);
      return;
    }
    try {
      const res = await api.get(`/documents/chat/${sessionId}`);
      setDocuments(res.data || []);
    } catch (err) {
      console.error("Failed to load documents list", err);
    }
  };

  // 2. Fetch messages and documents for active session when selected
  useEffect(() => {
    if (!activeSessionId) {
      setMessages([]);
      setDocuments([]);
      return;
    }

    const fetchSessionData = async () => {
      try {
        setLoadingHistory(true);
        const [messagesRes, docsRes] = await Promise.all([
          api.get(`/chat/${activeSessionId}`),
          api.get(`/documents/chat/${activeSessionId}`)
        ]);
        setMessages(messagesRes.data.messages || []);
        setDocuments(docsRes.data || []);
      } catch (err) {
        toast.error("Failed to load conversation history");
        console.error(err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchSessionData();
  }, [activeSessionId]);

  // 3. Create a new chat session
  const handleCreateSession = async () => {
    try {
      setLoadingSend(true);
      const res = await api.post("/chat");
      const newSession = res.data;
      
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession._id);
      setMessages([]);
      setDocuments([]);
    } catch (err) {
      toast.error("Failed to start new chat");
      console.error(err);
    } finally {
      setLoadingSend(false);
    }
  };

  // 4. Delete a chat session
  const handleDeleteSession = async (id) => {
    try {
      await api.delete(`/chat/${id}`);
      setSessions((prev) => prev.filter((s) => s._id !== id));
      
      // If we deleted the currently active chat
      if (activeSessionId === id) {
        const remaining = sessions.filter((s) => s._id !== id);
        if (remaining.length > 0) {
          setActiveSessionId(remaining[0]._id);
        } else {
          setActiveSessionId(null);
          setMessages([]);
          setDocuments([]);
        }
      }
      toast.success("Chat deleted");
    } catch (err) {
      toast.error("Failed to delete chat");
      console.error(err);
    }
  };

  // 5. Send a message to active or new session
  const handleSendMessage = async (text) => {
    let currentSessionId = activeSessionId;

    try {
      setLoadingSend(true);

      // Append user message immediately to the UI for responsiveness
      const tempUserMsg = { type: "user", text, sources: [] };
      setMessages((prev) => [...prev, tempUserMsg]);

      // If no active session exists, create one first
      if (!currentSessionId) {
        const createRes = await api.post("/chat");
        const newSession = createRes.data;
        currentSessionId = newSession._id;
        setActiveSessionId(newSession._id);
        setSessions((prev) => [newSession, ...prev]);
      }

      // Send message to backend
      const res = await api.post(`/chat/${currentSessionId}/message`, {
        question: text,
      });

      const { messages: newMsgs, title } = res.data;

      // Update active messages to include AI response
      setMessages((prev) => {
        const listWithoutTemp = prev.slice(0, -1);
        return [...listWithoutTemp, ...newMsgs];
      });

      // Update session title & timestamp in sidebar list
      setSessions((prev) => {
        const updated = prev.map((s) => {
          if (s._id === currentSessionId) {
            return { ...s, title, updatedAt: new Date().toISOString() };
          }
          return s;
        });
        // Sort sessions by updated time descending
        return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });

    } catch (err) {
      toast.error("Failed to send message");
      console.error(err);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoadingSend(false);
    }
  };

  const handleUploadSuccess = () => {
    fetchDocuments(activeSessionId);
  };

  return (
    <div className="flex flex-col h-screen bg-[#070a13] text-slate-100 overflow-hidden">
      
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar */}
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onDeleteSession={handleDeleteSession}
          onCreateSession={handleCreateSession}
          loading={loadingHistory || loadingSend}
        />

        {/* Main Interface */}
        <main className="flex-1 flex gap-6 p-6 overflow-hidden">
          
          {/* Chat View Box */}
          <div className="flex-1 h-full min-w-0">
            <ChatBox
              messages={messages}
              onSendMessage={handleSendMessage}
              loading={loadingSend}
              documents={documents}
            />
          </div>

          {/* Right Document Management Panel */}
          <div className="w-80 shrink-0 h-full overflow-y-auto">
            <UploadCard 
              chatId={activeSessionId} 
              onUploadSuccess={handleUploadSuccess} 
            />
          </div>

        </main>

      </div>

    </div>
  );
};

export default Dashboard;