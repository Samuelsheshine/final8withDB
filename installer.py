import os

# 定義要建立的目錄結構
directories = [
    "client",
    "client/src",
    "server"
]

# 定義每個檔案的內容
files = {
    # --- 前端檔案 (Client) ---
    "client/package.json": """{
  "name": "study-hub-client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.460.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "eslint": "^9.9.0",
    "eslint-plugin-react": "^7.35.0",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.9",
    "globals": "^15.9.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "vite": "^5.4.1"
  }
}""",
    
    "client/vite.config.js": """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})""",

    "client/postcss.config.js": """export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}""",

    "client/tailwind.config.js": """/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}""",

    "client/index.html": """<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Study Hub</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>""",

    "client/src/index.css": """@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  padding: 0;
  background-color: #e5e7eb;
}""",

    "client/src/main.jsx": """import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)""",

    "client/src/App.jsx": """import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Check, Edit2, RotateCw, X, BookOpen, ArrowLeft, Sparkles, Clock, Calendar, Calculator, Trash2, Send, Link as LinkIcon, ExternalLink, BarChart2, PieChart, Cloud } from 'lucide-react';

// --- 設定區 ---
const CATEGORIES = {
  EXAM: { id: 'exam', label: '考試', color: 'bg-red-500', border: 'border-l-4 border-red-500', text: 'text-red-700' },
  REPORT: { id: 'report', label: '報告', color: 'bg-green-500', border: 'border-l-4 border-green-500', text: 'text-green-700' },
  HOMEWORK: { id: 'homework', label: '作業', color: 'bg-purple-500', border: 'border-l-4 border-purple-500', text: 'text-purple-700' },
  CANCEL: { id: 'cancel', label: '停課', color: 'bg-yellow-400', border: 'border-l-4 border-yellow-400', text: 'text-yellow-700' },
  OTHER: { id: 'other', label: '其他', color: 'bg-blue-400', border: 'border-l-4 border-blue-400', text: 'text-blue-700' }
};

// GPA 對照表 (4.3制)
const scoreToPoint = (score) => {
    const s = parseInt(score);
    if (isNaN(s)) return 0;
    if (s >= 90) return 4.3;
    if (s >= 85) return 4.0;
    if (s >= 80) return 3.7;
    if (s >= 77) return 3.3;
    if (s >= 73) return 3.0;
    if (s >= 70) return 2.7;
    if (s >= 67) return 2.3;
    if (s >= 63) return 2.0;
    if (s >= 60) return 1.7;
    if (s >= 50) return 1.0;
    return 0;
};

export default function StudyHubApp() {
  const [activeTab, setActiveTab] = useState('timetable'); 
  // 這裡使用預設值，若資料庫有資料會被覆蓋
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [semesterStart, setSemesterStart] = useState(new Date(new Date().getFullYear(), 8, 1)); 
  
  // --- 資料庫同步狀態 ---
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved, error
  const saveTimeoutRef = useRef(null);

  // --- 資料狀態 (預設值作為新使用者的範本) ---
  const [tasks, setTasks] = useState([
    { id: 1, date: new Date().toISOString().split('T')[0], category: 'exam', subject: '範例:微積分', note: 'Ch1-3', completed: false },
  ]);

  const [grades, setGrades] = useState([
    { id: 1, date: new Date().toISOString().split('T')[0], subject: '範例:計算機概論', score: '85', note: '期中考' },
  ]);

  const [timetable, setTimetable] = useState({
      "1-1": "微積分", "1-2": "微積分",
  });

  const [periodTimes, setPeriodTimes] = useState({
      '1': '08:10-09:00', '2': '09:10-10:00', '3': '10:10-11:00', '4': '11:10-12:00',
      '5': '13:20-14:10', '6': '14:20-15:10', '7': '15:20-16:10', '8': '16:20-17:10',
  });

  const [gpaCourses, setGpaCourses] = useState([]);
  const [links, setLinks] = useState([]);
  const [studyLogs, setStudyLogs] = useState([]);
  const [pomodoroSubjects, setPomodoroSubjects] = useState([]);

  // --- 資料庫整合邏輯 ---

  // 1. 初始化：從後端讀取資料
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          const data = await res.json();
          // 如果資料庫是空的 (新使用者)，保持前端的預設值，否則使用資料庫的值
          if (Object.keys(data).length > 0) {
            if (data.tasks) setTasks(data.tasks);
            if (data.grades) setGrades(data.grades);
            if (data.timetable) setTimetable(data.timetable);
            if (data.periodTimes) setPeriodTimes(data.periodTimes);
            if (data.gpaCourses) setGpaCourses(data.gpaCourses);
            if (data.links) setLinks(data.links);
            if (data.studyLogs) setStudyLogs(data.studyLogs);
            if (data.pomodoroSubjects) setPomodoroSubjects(data.pomodoroSubjects);
            // 恢復日期設定
            if (data.currentDate) setCurrentDate(new Date(data.currentDate));
            if (data.semesterStart) setSemesterStart(new Date(data.semesterStart));
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsDataLoaded(true);
      }
    };
    fetchData();
  }, []);

  // 2. 自動存檔：監聽狀態變化
  useEffect(() => {
    // 只有在資料載入完成後才開始監聽變化並存檔，避免覆蓋掉資料庫
    if (!isDataLoaded) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    setSaveStatus('saving');

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const payload = {
          tasks, grades, timetable, periodTimes, gpaCourses, links, studyLogs, pomodoroSubjects,
          currentDate: currentDate.toISOString(),
          semesterStart: semesterStart.toISOString()
        };
        
        const res = await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (res.ok) setSaveStatus('saved');
        else setSaveStatus('error');
      } catch (e) {
        console.error("Save error:", e);
        setSaveStatus('error');
      }
    }, 1500); // 1.5秒防抖

    return () => clearTimeout(saveTimeoutRef.current);
  }, [tasks, grades, timetable, periodTimes, gpaCourses, links, studyLogs, pomodoroSubjects, currentDate, semesterStart, isDataLoaded]);


  // --- 輔助函式 ---
  const getWeekNumber = (date) => {
    const diff = date - semesterStart;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.max(1, Math.ceil(diff / oneWeek));
  };

  const getWeekDays = (baseDate) => {
    const startOfWeek = new Date(baseDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); 
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
  const currentWeekNum = getWeekNumber(currentDate);


  // --- API 呼叫 (AI Chat) ---
  const [aiSummary, setAiSummary] = useState(""); 
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  // --- 介面元件 ---

  const Header = () => (
    <div className="bg-white border-b border-gray-200 px-3 pb-2 pt-14 sticky top-0 z-20 shadow-sm relative">
      <div className="absolute top-5 right-5 text-xl font-bold text-gray-200 pointer-events-none select-none flex items-center gap-2">
        {/* 存檔狀態指示燈 */}
        <div className={`flex items-center gap-1 text-[10px] font-bold transition-colors duration-500
            ${saveStatus === 'saving' ? 'text-blue-400' : 
              saveStatus === 'saved' ? 'text-green-400' : 
              saveStatus === 'error' ? 'text-red-400' : 'text-gray-200'}`}>
             <Cloud size={14} />
             {saveStatus === 'saving' && '...'}
             {saveStatus === 'saved' && 'OK'}
             {saveStatus === 'error' && '!'}
        </div>
        {currentDate.getFullYear()}
      </div>

      <div className="grid grid-cols-4 gap-2 relative z-10 mb-2">
          {[
            { id: 'timetable', label: '課表', icon: <RotateCw size={14}/> },
            { id: 'planner', label: '聯絡簿', icon: <BookOpen size={14}/> },
            { id: 'grades', label: '成績', icon: <Edit2 size={14}/> },
            { id: 'gpa', label: 'GPA', icon: <Calculator size={14}/> },
            { id: 'dashboard', label: '行事曆', icon: <Calendar size={14}/> },
            { id: 'ai', label: 'AI', icon: <Sparkles size={14}/>, special: true },
            { id: 'pomodoro', label: '番茄鐘', icon: <Clock size={14}/> },
            { id: 'links', label: '連結', icon: <LinkIcon size={14}/> },
          ].map(item => (
             <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                    px-2 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5
                    ${item.special && activeTab !== item.id
                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' 
                        : activeTab === item.id 
                            ? (item.special ? 'bg-indigo-600 text-white shadow-md' : 'bg-black text-white shadow-md')
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                `}
             >
                {item.icon}
                {item.label}
             </button>
          ))}
      </div>

      <div className="flex justify-between items-center bg-gray-50 p-1.5 rounded-lg border border-gray-100 mt-1 relative z-10">
        <button onClick={() => {
          const newDate = new Date(currentDate);
          newDate.setDate(newDate.getDate() - 7);
          setCurrentDate(newDate);
        }} className="text-gray-400 hover:text-black flex items-center px-2 active:scale-95 transition-transform">
          <ChevronLeft size={16} /> <span className="text-xs ml-0.5 font-bold">上週</span>
        </button>
        
        <div className="text-center">
          <div className="text-xs font-bold text-gray-800">
            {weekDays[0].getMonth()+1}/{weekDays[0].getDate()} - {weekDays[6].getMonth()+1}/{weekDays[6].getDate()}
          </div>
          <div className="text-[10px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full mt-0.5 inline-block">
            學期第 {currentWeekNum} 週
          </div>
        </div>

        <button onClick={() => {
          const newDate = new Date(currentDate);
          newDate.setDate(newDate.getDate() + 7);
          setCurrentDate(newDate);
        }} className="text-gray-400 hover:text-black flex items-center px-2 active:scale-95 transition-transform">
          <span className="text-xs mr-0.5 font-bold">下週</span> <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  // --- Views ---

  const LinksView = ({ links, setLinks }) => {
      const [isAdding, setIsAdding] = useState(false);
      const [newLink, setNewLink] = useState({ title: '', url: '' });

      const addLink = () => {
          if (newLink.title && newLink.url) {
              setLinks([...links, { id: Date.now(), ...newLink }]);
              setNewLink({ title: '', url: '' });
              setIsAdding(false);
          }
      };
      
      const confirmDelete = (id, title) => {
          if (window.confirm(`確定要刪除連結「${title}」嗎？`)) {
              setLinks(links.filter(l => l.id !== id));
          }
      };

      return (
          <div className="p-4 h-full overflow-y-auto pb-24">
              <div className="grid grid-cols-2 gap-4">
                  {links.map(link => (
                      <div key={link.id} className="relative group">
                          {/* 刪除按鈕 */}
                          <button 
                              onClick={(e) => {
                                  e.stopPropagation();
                                  confirmDelete(link.id, link.title);
                              }}
                              className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                          >
                              <X size={14} />
                          </button>
                          
                          <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:border-blue-300 transition-all cursor-pointer no-underline text-gray-700 block h-full"
                          >
                              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                  <LinkIcon size={24} />
                              </div>
                              <span className="font-bold text-sm text-center line-clamp-1 break-all w-full px-1">{link.title}</span>
                              <div className="flex items-center text-[10px] text-gray-400 gap-1">
                                  <span>開啟</span> <ExternalLink size={10} />
                              </div>
                          </a>
                      </div>
                  ))}
                  
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600 min-h-[120px]"
                  >
                      <Plus size={24} />
                      <span className="text-xs font-bold">新增連結</span>
                  </button>
              </div>

              {isAdding && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
                      <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-xl">
                          <h3 className="font-bold text-lg mb-4 text-gray-800">新增連結</h3>
                          <input placeholder="名稱" className="w-full border border-gray-300 rounded-xl p-3 mb-3 text-sm focus:border-black outline-none" value={newLink.title} onChange={e => setNewLink({...newLink, title: e.target.value})} />
                          <input placeholder="網址" className="w-full border border-gray-300 rounded-xl p-3 mb-5 text-sm focus:border-black outline-none" value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} />
                          <div className="flex gap-3">
                              <button onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-gray-100 rounded-xl text-sm font-bold">取消</button>
                              <button onClick={addLink} className="flex-1 py-3 bg-black text-white rounded-xl text-sm font-bold">確認</button>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const AIChatView = ({ tasks, grades, timetable, currentDate, gpaCourses }) => {
    const [messages, setMessages] = useState([{ role: 'assistant', content: '嗨！我是 AI 助理。我能讀取你的課表、成績和待辦事項，有什麼我可以幫你的嗎？' }]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    
    useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

    const getSystemContext = () => {
        // 修正這裡的字串跳脫問題，確保生成正確的 JS 字串
        const taskStr = tasks.length > 0 ? tasks.map(t => `- ${t.date} ${t.subject}: ${t.note}`).join('\\n') : "無";
        const gradeStr = grades.length > 0 ? grades.map(g => `- ${g.subject}: ${g.score}分`).join('\\n') : "無";
        const timetableStr = Object.entries(timetable).map(([k, v]) => `${k}: ${v}`).join('\\n');
        
        let totalPoints = 0, totalCredits = 0;
        gpaCourses.forEach(c => {
            const credit = parseFloat(c.credit), score = parseFloat(c.score);
            if (!isNaN(credit) && !isNaN(score)) { totalPoints += scoreToPoint(score) * credit; totalCredits += credit; }
        });
        const currentGPA = totalCredits === 0 ? "0.00" : (totalPoints / totalCredits).toFixed(2);

        return `今天是 ${currentDate.toISOString().split('T')[0]}。\\n【聯絡簿】\\n${taskStr}\\n【成績】\\n${gradeStr}\\n【課表】\\n${timetableStr}\\n【預估GPA】${currentGPA}\\n請回答問題。`;
    };

    const handleSend = async () => {
        if (!input.trim() || isSending) return;
        const userMsg = { role: 'user', content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages); setInput(''); setIsSending(true);
        try {
            const apiMessages = [{ role: 'system', content: getSystemContext() }, ...newMessages];
            const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: apiMessages }) });
            if (!response.ok) throw new Error("API Error");
            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (error) { setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ 錯誤: ${error.message}` }]); } finally { setIsSending(false); }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-4">
                {messages.map((msg, idx) => ( <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${msg.role === 'user' ? 'bg-black text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>{msg.content}</div></div> ))}
                {isSending && <div className="text-gray-400 text-xs ml-4">思考中...</div>}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-3 bg-white border-t border-gray-200 flex gap-2"><input type="text" placeholder="輸入訊息..." className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm outline-none" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} /><button onClick={handleSend} disabled={isSending || !input.trim()} className="bg-black text-white p-2.5 rounded-xl"><Send size={18} /></button></div>
        </div>
    );
  };

  const TimetableView = ({ timetable, setTimetable, periodTimes, setPeriodTimes }) => {
      const periods = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'B', 'C'];
      const days = ['一', '二', '三', '四', '五', '六', '日'];
      
      const [isEditing, setIsEditing] = useState(false);
      const [editModal, setEditModal] = useState({ isOpen: false, type: null, key: null, value: '' });
      const [timeEdit, setTimeEdit] = useState({ start: '', end: '' });

      const handleCellClick = (dayIdx, period) => {
          if (!isEditing) return;
          const key = `${dayIdx + 1}-${period}`;
          setEditModal({ isOpen: true, type: 'subject', key: key, value: timetable[key] || '' });
      };

      const handleTimeClick = (p) => {
          if (!isEditing) return;
          const currentVal = periodTimes[p] || "";
          let start = "", end = "";
          if (currentVal.includes('-')) {
              [start, end] = currentVal.split('-');
          }
          setTimeEdit({ start, end });
          setEditModal({ isOpen: true, type: 'time', key: p });
      };

      const saveEdit = () => {
          const { type, key, value } = editModal;
          if (type === 'subject') {
               const newTimetable = { ...timetable };
               if (!value.trim()) delete newTimetable[key];
               else newTimetable[key] = value;
               setTimetable(newTimetable);
          } else if (type === 'time') {
               const timeStr = `${timeEdit.start}-${timeEdit.end}`;
               setPeriodTimes(prev => ({...prev, [key]: timeStr}));
          }
          setEditModal({ ...editModal, isOpen: false });
      };

      return (
          <div className="p-4 h-full overflow-y-auto pb-24 relative flex flex-col">
              <div className="flex-1">
                <div className={`bg-white rounded-xl shadow-sm border overflow-hidden min-w-[800px] md:min-w-0 transition-colors ${isEditing ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-200'}`}>
                    <div className="grid grid-cols-[40px_80px_repeat(7,1fr)] text-center text-xs font-bold bg-gray-50 border-b border-gray-200">
                        <div className="p-2 border-r border-gray-200 text-gray-400 flex items-center justify-center">節</div>
                        <div className="p-2 border-r border-gray-200 text-gray-400 flex items-center justify-center">時間</div>
                        {days.map(d => <div key={d} className="p-2 border-r border-gray-200 last:border-0 flex items-center justify-center">{d}</div>)}
                    </div>
                    {periods.map(p => (
                        <div key={p} className="grid grid-cols-[40px_80px_repeat(7,1fr)] text-center text-xs h-14 border-b border-gray-100 last:border-0">
                            <div className="flex items-center justify-center bg-gray-50 text-gray-400 font-bold border-r border-gray-200">{p}</div>
                            
                            <div onClick={() => handleTimeClick(p)} className={`flex flex-col items-center justify-center border-r border-gray-200 p-1 h-full ${isEditing ? 'cursor-pointer hover:bg-indigo-50 active:bg-indigo-100' : ''}`}>
                                <div className="text-[10px] text-gray-500 text-center leading-tight">
                                    {(() => {
                                        const t = periodTimes[p] || "";
                                        if (t.includes('-')) {
                                            const [start, end] = t.split('-');
                                            return (<><div>{start}-</div><div>{end}</div></>);
                                        }
                                        return t || (isEditing ? <span className="text-indigo-300">設定</span> : "");
                                    })()}
                                </div>
                            </div>

                            {days.map((_, dayIdx) => {
                                const key = `${dayIdx + 1}-${p}`;
                                const subject = timetable[key];
                                return (
                                    <div key={key} onClick={() => handleCellClick(dayIdx, p)} className={`flex items-center justify-center p-1 border-r border-gray-100 last:border-0 transition-colors ${isEditing ? 'cursor-pointer hover:bg-indigo-50 active:bg-indigo-100' : ''}`}>
                                        {subject ? (
                                            <div className="bg-blue-100 text-blue-800 rounded px-1 py-0.5 w-full h-full flex items-center justify-center text-[10px] font-bold break-all leading-tight">{subject}</div>
                                        ) : (
                                            isEditing && <div className="text-indigo-200 text-[10px]">+</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
              </div>
              
              <div className="mt-4 sticky bottom-0 bg-white/90 backdrop-blur p-2 border-t border-gray-100 flex justify-center">
                  <button onClick={() => setIsEditing(!isEditing)} className={`w-full max-w-xs py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${isEditing ? 'bg-black text-white hover:bg-gray-800' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                      {isEditing ? <> <Check size={16} /> 完成編輯 </> : <> <Edit2 size={16} /> 編輯課表 </>}
                  </button>
              </div>

              {editModal.isOpen && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
                      <div className="bg-white w-full max-w-xs rounded-2xl p-5 shadow-xl">
                          <h3 className="font-bold text-lg mb-4 text-gray-800">{editModal.type === 'time' ? '修改時間' : '編輯課程'}</h3>
                          {editModal.type === 'time' ? (
                              <div className="flex items-center gap-2 mb-6">
                                  <input type="time" className="border border-gray-300 rounded-lg p-2 text-sm w-full" value={timeEdit.start} onChange={e => setTimeEdit({...timeEdit, start: e.target.value})} />
                                  <span>-</span>
                                  <input type="time" className="border border-gray-300 rounded-lg p-2 text-sm w-full" value={timeEdit.end} onChange={e => setTimeEdit({...timeEdit, end: e.target.value})} />
                              </div>
                          ) : (
                              <input autoFocus className="w-full border border-gray-300 rounded-xl p-3 mb-5 text-sm focus:border-black outline-none" value={editModal.value} onChange={e => setEditModal({...editModal, value: e.target.value})} placeholder="輸入課程名稱..." />
                          )}
                          <div className="flex gap-3">
                              <button onClick={() => setEditModal({...editModal, isOpen: false})} className="flex-1 py-2.5 bg-gray-100 rounded-xl text-sm font-bold text-gray-600">取消</button>
                              <button onClick={saveEdit} className="flex-1 py-2.5 bg-black text-white rounded-xl text-sm font-bold">確定</button>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const PomodoroView = ({ studyLogs, setStudyLogs, currentDate, pomodoroSubjects, setPomodoroSubjects }) => {
      const [timeLeft, setTimeLeft] = useState(25 * 60);
      const [isActive, setIsActive] = useState(false);
      const [mode, setMode] = useState('work'); 
      const [targetSubject, setTargetSubject] = useState("");
      
      const [isCreatingSubject, setIsCreatingSubject] = useState(false);
      const [customSubject, setCustomSubject] = useState("");

      useEffect(() => {
          let interval = null;
          if (isActive && timeLeft > 0) { interval = setInterval(() => setTimeLeft(t => t - 1), 1000); } 
          else if (timeLeft === 0) { 
              setIsActive(false); 
              if (mode === 'work') {
                  const subjectToSave = isCreatingSubject ? customSubject : targetSubject;
                  if (subjectToSave) {
                      alert(`專注結束！已記錄「${subjectToSave}」。`);
                      const todayStr = currentDate.toISOString().split('T')[0];
                      setStudyLogs(prev => [...prev, { id: Date.now(), date: todayStr, subject: subjectToSave, duration: 25 }]);
                      
                      if (isCreatingSubject && customSubject) {
                          setPomodoroSubjects(prev => [...prev, customSubject]);
                          setIsCreatingSubject(false);
                          setTargetSubject(customSubject);
                          setCustomSubject("");
                      }
                  } else {
                      alert("專注結束！");
                  }
              } else {
                  alert("休息結束！");
              }
          }
          return () => clearInterval(interval);
      }, [isActive, timeLeft, mode, targetSubject, customSubject, isCreatingSubject, currentDate]);

      const toggleTimer = () => setIsActive(!isActive);
      const resetTimer = () => { setIsActive(false); setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60); };
      const switchMode = (newMode) => { setMode(newMode); setIsActive(false); setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60); };
      const formatTime = (seconds) => { const m = Math.floor(seconds / 60).toString().padStart(2, '0'); const s = (seconds % 60).toString().padStart(2, '0'); return `${m}:${s}`; };

      const handleSubjectChange = (e) => {
          const val = e.target.value;
          if (val === 'NEW_CUSTOM') {
              setIsCreatingSubject(true);
              setTargetSubject("");
          } else {
              setIsCreatingSubject(false);
              setTargetSubject(val);
          }
      };
      
      const handleConfirmSubject = () => {
          if (customSubject.trim()) {
              setPomodoroSubjects(prev => [...prev, customSubject]);
              setIsCreatingSubject(false);
              setTargetSubject(customSubject);
              setCustomSubject("");
          }
      };

      const subjectStats = useMemo(() => {
          const startOfWeek = new Date(currentDate);
          const day = startOfWeek.getDay();
          const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
          startOfWeek.setDate(diff); // 週一
          
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(endOfWeek.getDate() + 6); // 週日

          const weekLogs = studyLogs.filter(l => {
              const d = new Date(l.date);
              return d >= startOfWeek && d <= endOfWeek;
          });

          const stats = {};
          weekLogs.forEach(l => {
              stats[l.subject] = (stats[l.subject] || 0) + l.duration;
          });

          return Object.entries(stats).map(([subj, mins]) => ({
              subject: subj,
              hours: (mins / 60).toFixed(1)
          })).sort((a,b) => b.hours - a.hours);
      }, [studyLogs, currentDate]);

      const maxSubjectHours = Math.max(...subjectStats.map(s => parseFloat(s.hours)), 1);

      return (
          <div className="p-6 h-full overflow-y-auto pb-24 flex flex-col space-y-8">
              <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="flex bg-gray-200 p-1 rounded-full">
                      <button onClick={() => switchMode('work')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'work' ? 'bg-white shadow text-red-500' : 'text-gray-500'}`}>專注</button>
                      <button onClick={() => switchMode('break')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'break' ? 'bg-white shadow text-green-500' : 'text-gray-500'}`}>休息</button>
                  </div>

                  {mode === 'work' && (
                      <div className="w-full max-w-[220px]">
                          {isCreatingSubject ? (
                              <div className="flex gap-2 items-center">
                                  <input autoFocus placeholder="輸入科目..." className="w-full border-b-2 border-indigo-500 outline-none text-center pb-1 bg-transparent text-sm" value={customSubject} onChange={(e) => setCustomSubject(e.target.value)} />
                                  <button onClick={handleConfirmSubject} className="text-green-500 hover:text-green-600"><Check size={18}/></button>
                                  <button onClick={() => setIsCreatingSubject(false)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
                              </div>
                          ) : (
                              <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 w-full outline-none focus:border-black" value={targetSubject} onChange={handleSubjectChange}>
                                  <option value="">-- 請選擇科目 --</option>
                                  {pomodoroSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                                  <option value="NEW_CUSTOM">＋ 新增科目...</option>
                              </select>
                          )}
                      </div>
                  )}

                  <div className={`w-56 h-56 rounded-full border-8 flex items-center justify-center shadow-xl transition-colors ${mode === 'work' ? 'border-red-100 bg-red-50' : 'border-green-100 bg-green-50'}`}>
                      <span className={`text-5xl font-mono font-bold ${mode === 'work' ? 'text-red-500' : 'text-green-500'}`}>{formatTime(timeLeft)}</span>
                  </div>

                  <div className="flex gap-4">
                      <button onClick={toggleTimer} className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg">{isActive ? "⏸" : "▶"}</button>
                      <button onClick={resetTimer} className="w-16 h-16 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 shadow"><RotateCw size={20} /></button>
                  </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-700 flex items-center gap-2"><BarChart2 size={18}/> 本週各科累積</h3>
                      <span className="text-xs text-gray-400">單位: 小時</span>
                  </div>
                  
                  {subjectStats.length === 0 ? (
                      <div className="h-32 flex items-center justify-center text-gray-300 text-sm italic border-2 border-dashed border-gray-100 rounded-lg">
                          本週尚無讀書紀錄
                      </div>
                  ) : (
                      <div className="space-y-3">
                          {subjectStats.map((stat, i) => (
                              <div key={stat.subject} className="flex items-center gap-3">
                                  <div className="w-20 text-xs font-bold text-gray-600 truncate text-right">{stat.subject}</div>
                                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full" style={{ width: `${(parseFloat(stat.hours) / maxSubjectHours) * 100}%` }}></div>
                                  </div>
                                  <div className="w-8 text-xs text-gray-500 font-mono">{stat.hours}</div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      );
  };

  const GpaView = ({ gpaCourses, setGpaCourses }) => {
      const calculatedGPA = useMemo(() => {
          let totalPoints = 0; let totalCredits = 0;
          gpaCourses.forEach(c => { const credit = parseFloat(c.credit); const score = parseFloat(c.score); if (!isNaN(credit) && !isNaN(score)) { totalPoints += scoreToPoint(score) * credit; totalCredits += credit; } });
          return totalCredits === 0 ? "0.00" : (totalPoints / totalCredits).toFixed(2);
      }, [gpaCourses]);
      
      const [isAdding, setIsAdding] = useState(false);
      const [newCourse, setNewCourse] = useState({ name: '', credit: '', score: '', note: '' }); 

      const addNewCourse = () => {
        if (!newCourse.name) return; 
        setGpaCourses([...gpaCourses, { id: Date.now(), ...newCourse }]);
        setNewCourse({ name: '', credit: '', score: '', note: '' }); 
        setIsAdding(false); 
      };

      const removeGpaRow = (id) => setGpaCourses(gpaCourses.filter(c => c.id !== id));
      const updateGpaRow = (id, field, value) => { setGpaCourses(gpaCourses.map(c => c.id === id ? { ...c, [field]: value } : c)); };

      return (
          <div className="p-4 h-full overflow-y-auto pb-24 no-scrollbar flex flex-col">
              <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white text-center shadow-lg"><p className="text-sm opacity-80 mb-1">本學期預估 GPA (4.3制)</p><h2 className="text-5xl font-bold tracking-tight">{calculatedGPA}</h2></div>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="grid grid-cols-10 bg-gray-50 text-xs font-bold text-gray-500 p-2 border-b border-gray-200"><div className="col-span-4 pl-2">課程名稱</div><div className="col-span-2 text-center">學分</div><div className="col-span-2 text-center">分數</div><div className="col-span-2 text-center">操作</div></div>
                      {gpaCourses.map(course => (
                          <div key={course.id} className="grid grid-cols-10 p-2 border-b border-gray-100 items-center gap-1">
                              <input placeholder="課程..." className="col-span-4 text-sm border-b border-transparent focus:border-blue-500 outline-none bg-transparent pl-2" value={course.name} onChange={e => updateGpaRow(course.id, 'name', e.target.value)}/>
                              <input placeholder="3" type="number" className="col-span-2 text-center text-sm border border-gray-200 rounded p-1" value={course.credit} onChange={e => updateGpaRow(course.id, 'credit', e.target.value)}/>
                              <input placeholder="85" type="number" className="col-span-2 text-center text-sm border border-gray-200 rounded p-1 font-bold text-blue-600" value={course.score} onChange={e => updateGpaRow(course.id, 'score', e.target.value)}/>
                              <div className="col-span-2 flex justify-center"><button onClick={() => removeGpaRow(course.id)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={16} /></button></div>
                          </div>
                      ))}
                      <button onClick={() => setIsAdding(true)} className="w-full py-4 text-center text-sm text-blue-600 font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 border-t border-gray-100"><Plus size={18} /> 新增課程</button>
                  </div>
              </div>
              {isAdding && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
                      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">
                          <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-gray-800">新增一筆成績</h3><button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button></div>
                          <div className="flex flex-col gap-3 mb-6">
                              <div className="flex gap-3">
                                  <input className="flex-[2] border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-black" placeholder="科目 (如: 經濟學)" value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})}/>
                                  <input className="flex-1 border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-black text-center" placeholder="分數" type="number" value={newCourse.score} onChange={e => setNewCourse({...newCourse, score: e.target.value})}/>
                              </div>
                              <input className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-black" placeholder="學分 (Credit) - 計算 GPA 必填" type="number" value={newCourse.credit} onChange={e => setNewCourse({...newCourse, credit: e.target.value})}/>
                              <input className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-black" placeholder="備註 (如: 期末考)" value={newCourse.note} onChange={e => setNewCourse({...newCourse, note: e.target.value})}/>
                          </div>
                          <button onClick={addNewCourse} className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">確認新增</button>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const GradesView = ({ grades, setGrades }) => {
    const [viewMode, setViewMode] = useState('all'); 
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newGradeEntry, setNewGradeEntry] = useState({ date: new Date().toISOString().split('T')[0], subject: '', score: '', note: '' });
    const uniqueSubjects = useMemo(() => [...new Set(grades.map(g => g.subject))], [grades]);
    const saveNewGrade = () => { if (!newGradeEntry.subject) return; setGrades([...grades, { id: Date.now(), ...newGradeEntry }]); setIsAdding(false); };

    return (
      <div className="p-4 h-full overflow-y-auto pb-24 no-scrollbar flex flex-col">
        <div className="flex bg-gray-200 p-1 rounded-xl mb-4 shrink-0 overflow-x-auto">
            {['all:紀錄', 'subjects:分類'].map(m => {
                const [mode, label] = m.split(':');
                return ( <button key={mode} onClick={() => { setViewMode(mode); setSelectedSubject(null); }} className={`flex-1 py-2 px-1 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${viewMode === mode || (mode==='subjects' && viewMode==='subject-detail') ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700'}`}>{label}</button> )
            })}
        </div>
        
        {viewMode === 'all' && (
            <div className="space-y-4">
                {grades.sort((a,b) => new Date(b.date) - new Date(a.date)).map(grade => (
                    <div key={grade.id} className="bg-white border-l-4 border-blue-500 shadow-sm rounded-r-xl p-4">
                        <div className="flex justify-between items-start"><div><h4 className="font-bold text-gray-800">{grade.subject}</h4><p className="text-xs text-gray-500 mt-1">{grade.date}</p></div><div className="text-2xl font-black text-gray-800">{grade.score}</div></div>
                        <div className="text-sm text-gray-600 border-t border-gray-100 pt-2 mt-2">{grade.note}</div>
                    </div>
                ))}
                {isAdding ? (
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between"><span className="font-bold text-sm">新增成績</span><button onClick={()=>setIsAdding(false)}><X size={16}/></button></div>
                        <input type="date" value={newGradeEntry.date} onChange={e=>setNewGradeEntry({...newGradeEntry, date: e.target.value})} className="w-full border p-2 rounded text-sm"/>
                        <div className="flex gap-2"><input placeholder="科目" value={newGradeEntry.subject} onChange={e=>setNewGradeEntry({...newGradeEntry, subject: e.target.value})} className="flex-1 border p-2 rounded text-sm"/><input placeholder="分數" value={newGradeEntry.score} onChange={e=>setNewGradeEntry({...newGradeEntry, score: e.target.value})} className="w-20 border p-2 rounded text-sm"/></div>
                        <input placeholder="備註" value={newGradeEntry.note} onChange={e=>setNewGradeEntry({...newGradeEntry, note: e.target.value})} className="w-full border p-2 rounded text-sm"/>
                        <button onClick={saveNewGrade} className="w-full bg-black text-white py-2 rounded-lg text-sm font-bold">確認新增</button>
                    </div>
                ) : ( <button onClick={()=>setIsAdding(true)} className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-gray-400 hover:text-gray-600 flex justify-center items-center gap-2"><Plus size={20} /> 新增成績</button> )}
            </div>
        )}
        {viewMode === 'subjects' && (
             <div className="grid grid-cols-2 gap-3">{uniqueSubjects.map(subject => (
                <div key={subject} onClick={() => { setSelectedSubject(subject); setViewMode('subject-detail'); }} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer h-32 flex flex-col justify-between">
                    <div className="flex justify-between items-start"><div className="p-2 bg-blue-50 rounded-lg text-blue-600"><BookOpen size={20} /></div><span className="text-xs font-bold text-gray-400">{grades.filter(g=>g.subject===subject).length} 筆</span></div>
                    <h4 className="font-bold text-gray-800 line-clamp-1">{subject}</h4>
                </div>
             ))}</div>
        )}
        {viewMode === 'subject-detail' && selectedSubject && (
            <div className="space-y-4">
                <button onClick={() => setViewMode('subjects')} className="flex items-center text-gray-500 mb-2"><ArrowLeft size={16} className="mr-1" /> 返回</button>
                <h2 className="text-xl font-bold text-gray-800">{selectedSubject}</h2>
                {grades.filter(g => g.subject === selectedSubject).map(grade => (
                    <div key={grade.id} className="bg-white border-l-4 border-blue-500 shadow-sm rounded-r-xl p-4 flex justify-between items-center"><div><span className="text-xs text-gray-500 block">{grade.date}</span><span className="text-sm font-bold">{grade.note}</span></div><span className="text-xl font-black">{grade.score}</span></div>
                ))}
            </div>
        )}
      </div>
    );
  };

  const DashboardView = ({ tasks, currentDate, setCurrentDate }) => (
      <div className="p-4 space-y-4 h-full overflow-y-auto pb-24">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
              <h2 className="text-lg font-bold text-gray-800 mb-2">{currentDate.getMonth()+1} 月</h2>
              <div className="grid grid-cols-7 gap-2 text-sm text-gray-400 mb-2 text-xs"><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div><div>日</div></div>
              <div className="grid grid-cols-7 gap-2 text-sm">
                  {Array.from({length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() === 0 ? 6 : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() - 1}).map((_, i) => (<div key={`empty-${i}`} className="aspect-square"></div>))}
                  {Array.from({length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()}).map((_, i) => {
                      const day = i + 1;
                      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                      const isSelected = day === currentDate.getDate();
                      const dayTasks = tasks.filter(t => new Date(t.date).toDateString() === dateObj.toDateString());
                      return (
                          <div key={i} onClick={() => setCurrentDate(dateObj)} className={`aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer relative transition-all ${isSelected ? 'bg-black text-white shadow-md' : 'bg-gray-50 hover:bg-gray-100'}`}>
                              <span className="text-xs font-medium z-10">{day}</span>
                              <div className="flex gap-0.5 mt-0.5">{dayTasks.slice(0, 3).map((t, idx) => (<div key={idx} className={`w-1 h-1 rounded-full ${CATEGORIES[t.category.toUpperCase()]?.color || 'bg-gray-400'}`}></div>))}</div>
                          </div>
                      );
                  })}
              </div>
          </div>
          <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-500 pl-1">{currentDate.getMonth()+1}/{currentDate.getDate()} 行程</h3>
              {tasks.filter(t => new Date(t.date).toDateString() === currentDate.toDateString()).length === 0 ? (
                  <div className="text-center py-8 text-gray-300 text-sm italic bg-gray-50 rounded-xl border border-dashed border-gray-200">本日無行程，好好休息吧！</div>
              ) : (
                  tasks.filter(t => new Date(t.date).toDateString() === currentDate.toDateString()).map(task => (
                      <div key={task.id} className={`flex items-center p-3 bg-white rounded-xl shadow-sm border-l-4 ${CATEGORIES[task.category.toUpperCase()].border} border-t border-r border-b border-gray-100`}>
                          <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1"><span className={`text-[10px] px-1.5 py-0.5 rounded text-white ${CATEGORIES[task.category.toUpperCase()].color.replace('bg-', 'bg-opacity-90 bg-')}`}>{CATEGORIES[task.category.toUpperCase()].label}</span><span className="font-bold text-gray-800 text-sm">{task.subject}</span></div>
                              <p className="text-xs text-gray-500">{task.note}</p>
                          </div>
                          {task.completed ? <Check size={16} className="text-green-500"/> : <div className="w-4 h-4 rounded-full border-2 border-gray-200"></div>}
                      </div>
                  ))
              )}
          </div>
      </div>
  );

  const PlannerView = ({ tasks, setTasks, weekDays }) => {
    const [newItem, setNewItem] = useState({ category: 'homework', subject: '', note: '' });
    const toggleTask = (id) => { setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)); };
    const handleAdd = (dateStr) => { if (!newItem.subject) return; setTasks([...tasks, { id: Date.now(), date: dateStr, ...newItem, completed: false }]); setNewItem({ ...newItem, subject: '', note: '' }); };

    return (
      <div className="p-4 space-y-6 h-full overflow-y-auto pb-24">
        {weekDays.map((day) => {
          const dayTasks = tasks.filter(t => new Date(t.date).toDateString() === day.toDateString());
          const dateStr = day.toISOString().split('T')[0];
          return (
            <div key={dateStr} className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 text-sm font-bold flex justify-between text-gray-700"><span>{day.getMonth()+1}/{day.getDate()} ({['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][day.getDay() === 0 ? 6 : day.getDay()-1]})</span></div>
              <div className="p-3 space-y-2">
                {dayTasks.length === 0 && <div className="text-sm text-gray-400 text-center py-4 italic">無項目</div>}
                {dayTasks.map(task => (
                    <div key={task.id} className={`flex items-center justify-between text-sm ${CATEGORIES[task.category.toUpperCase()].border} bg-white pl-3 py-2 rounded-r shadow-sm border-t border-r border-b border-gray-100 transition-all ${task.completed ? 'opacity-60' : ''}`}>
                        <div className="flex items-center gap-3 overflow-hidden flex-1"><input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"/><div className={`truncate flex-1 ${task.completed ? 'line-through text-gray-400' : ''}`}><span className={`font-bold mr-2 ${task.completed ? 'text-gray-500' : 'text-gray-800'}`}>{task.subject}</span><span className="text-xs text-gray-500">{task.note}</span></div></div>
                        {task.completed && <span className="text-[10px] font-bold text-gray-400 mr-1 whitespace-nowrap">完成</span>}
                    </div>
                ))}
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
                  <select className="text-xs border border-gray-200 rounded p-1.5 bg-gray-50 outline-none focus:border-blue-500 transition-colors" value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})}>{Object.values(CATEGORIES).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select>
                  <input placeholder="科目" className="text-xs border p-1.5 w-20 rounded" onChange={e=>setNewItem({...newItem, subject: e.target.value})} value={newItem.subject} />
                  <input placeholder="備註" className="text-xs border p-1.5 flex-1 rounded" onChange={e=>setNewItem({...newItem, note: e.target.value})} value={newItem.note} />
                  <button onClick={()=>handleAdd(dateStr)} className="p-1.5 bg-black text-white rounded"><Plus size={14}/></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-gray-200 min-h-screen w-full flex justify-center items-center font-sans">
        <div className="w-full max-w-md bg-white h-[95vh] md:h-[850px] md:rounded-[3rem] md:border-8 md:border-gray-800 flex flex-col shadow-2xl overflow-hidden relative">
            <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-50"></div>
            
            <Header />
            
            <div className="flex-1 overflow-hidden relative bg-gray-50">
                {!isDataLoaded ? (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    資料載入中...
                  </div>
                ) : (
                  <>
                    {activeTab === 'dashboard' && <DashboardView tasks={tasks} currentDate={currentDate} setCurrentDate={setCurrentDate} />}
                    {activeTab === 'planner' && <PlannerView tasks={tasks} setTasks={setTasks} weekDays={weekDays} />}
                    {activeTab === 'grades' && <GradesView grades={grades} setGrades={setGrades} />}
                    {activeTab === 'gpa' && <GpaView gpaCourses={gpaCourses} setGpaCourses={setGpaCourses} />}
                    {activeTab === 'timetable' && <TimetableView timetable={timetable} setTimetable={setTimetable} periodTimes={periodTimes} setPeriodTimes={setPeriodTimes} />}
                    {activeTab === 'pomodoro' && <PomodoroView studyLogs={studyLogs} setStudyLogs={setStudyLogs} currentDate={currentDate} pomodoroSubjects={pomodoroSubjects} setPomodoroSubjects={setPomodoroSubjects} />}
                    {activeTab === 'ai' && <AIChatView tasks={tasks} grades={grades} timetable={timetable} currentDate={currentDate} gpaCourses={gpaCourses} />}
                    {activeTab === 'links' && <LinksView links={links} setLinks={setLinks} />}
                  </>
                )}
            </div>
        </div>
    </div>
  );
}""",

    # --- 後端檔案 (Server) ---
    "server/requirements.txt": """flask
flask-cors
requests
flask-sqlalchemy""",

    "server/app.py": """from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import requests
import json
import os

app = Flask(__name__)
CORS(app)

# --- 資料庫設定 (SQLite) ---
# 資料庫檔案會建立在 server 目錄下的 studyhub.db
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'studyhub.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- 資料模型 ---
# 為了保持彈性並盡量不更動前端結構，我們將所有使用者資料存為一個 JSON 欄位
class UserData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # 儲存整個應用程式的狀態 (tasks, grades, timetable...)
    data_json = db.Column(db.Text, nullable=False) 

# 初始化資料庫
with app.app_context():
    db.create_all()

# --- LMStudio 設定 ---
LM_STUDIO_URL = "http://localhost:1234/v1/chat/completions"

@app.route('/')
def home():
    return "Study Hub Backend (with SQLite) is running!"

# --- 資料庫 API ---

@app.route('/api/data', methods=['GET'])
def get_data():
    \"\"\"取得使用者資料\"\"\"
    try:
        # 假設單機版只有一個使用者，直接取第一筆
        record = UserData.query.first()
        if record:
            return jsonify(json.loads(record.data_json))
        else:
            # 如果沒有資料，回傳空物件，讓前端使用預設值
            return jsonify({}) 
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/data', methods=['POST'])
def save_data():
    \"\"\"儲存使用者資料 (全量更新)\"\"\"
    try:
        new_data = request.json
        record = UserData.query.first()
        
        if record:
            record.data_json = json.dumps(new_data)
        else:
            new_record = UserData(data_json=json.dumps(new_data))
            db.session.add(new_record)
        
        db.session.commit()
        return jsonify({"status": "success", "message": "Data saved"})
    except Exception as e:
        print(f"Save Error: {e}")
        return jsonify({"error": str(e)}), 500

# --- AI API (維持原樣) ---

@app.route('/api/summary', methods=['POST'])
def generate_summary():
    try:
        data = request.json
        tasks = data.get('tasks', [])
        current_date = data.get('current_date', 'Unknown Date')
        
        task_desc = []
        for t in tasks:
            status = "已完成" if t.get('completed') else "未完成"
            cat_map = {'exam': '考試', 'report': '報告', 'cancel': '停課', 'other': '其他'}
            cat = cat_map.get(t.get('category'), '事項')
            task_desc.append(f"- {t['date']} [{cat}] {t['subject']}: {t['note']} ({status})")
        
        task_text = "\\n".join(task_desc) if task_desc else "本週無行程"

        system_prompt = "你是一個大學生私人助理。請根據行程表，用繁體中文生成一段簡短的『本週摘要』(100字內)。語氣自然。優先提醒未完成的考試與報告。"
        user_prompt = f"今天是 {current_date}。行程：\\n{task_text}"

        payload = {
            "model": "local-model",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 200,
            "stream": False
        }

        resp = requests.post(LM_STUDIO_URL, json=payload, headers={"Content-Type": "application/json"})
        
        if resp.status_code == 200:
            return jsonify({"summary": resp.json()['choices'][0]['message']['content']})
        else:
            return jsonify({"summary": f"AI 回應錯誤: {resp.status_code}"}), 500

    except requests.exceptions.ConnectionError:
        return jsonify({"summary": "⚠️ 無法連線到 LMStudio，請確認 Local Server (Port 1234) 已啟動。"}), 503
    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"summary": f"伺服器錯誤: {str(e)}"}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    \"\"\"
    接收前端傳來的對話歷史 (messages)，轉發給 LMStudio
    \"\"\"
    try:
        data = request.json
        messages = data.get('messages', [])
        
        payload = {
            "model": "local-model",
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 800,
            "stream": False
        }

        resp = requests.post(
            LM_STUDIO_URL, 
            json=payload, 
            headers={"Content-Type": "application/json"}
        )
        
        if resp.status_code == 200:
            ai_response = resp.json()
            reply_content = ai_response['choices'][0]['message']['content']
            return jsonify({"reply": reply_content})
        else:
            error_msg = f"LM Studio Error: {resp.status_code} - {resp.text}"
            print(error_msg)
            return jsonify({"error": error_msg}), 500

    except requests.exceptions.ConnectionError:
        return jsonify({"error": "無法連線到 LMStudio，請確認 Local Server (Port 1234) 已啟動。"}), 503
    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": f"伺服器內部錯誤: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
"""
}

def create_project():
    print("🚀 開始建立 StudyHub 專案 (含資料庫功能)...")
    
    # 1. 建立目錄
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"📂 建立目錄: {directory}")

    # 2. 寫入檔案
    for filepath, content in files.items():
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"📝 建立檔案: {filepath}")

    print("\\n✅ 安裝完成！請依照以下步驟啟動：")
    print("====================================")
    print("1. 開啟第一個終端機 (後端):")
    print("   cd server")
    print("   pip install -r requirements.txt")
    print("   python app.py")
    print("")
    print("2. 開啟第二個終端機 (前端):")
    print("   cd client")
    print("   npm install")
    print("   npm run dev")
    print("====================================")

if __name__ == "__main__":
    create_project()