import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Check, Edit2, RotateCw, X, BookOpen, ArrowLeft, Sparkles, Clock, Calendar, Calculator, Trash2, Send, Link as LinkIcon, ExternalLink, BarChart2, Cloud, Settings, PieChart, Globe, Save } from 'lucide-react';

// --- 多語言翻譯字典 ---
const TRANSLATIONS = {
  'zh-TW': {
    // 通用
    save: '儲存',
    cancel: '取消',
    confirm: '確認',
    delete: '刪除',
    edit: '編輯',
    add: '新增',
    close: '關閉',
    loading: '資料載入中...',
    saving: '儲存中...',
    saved: '已儲存',
    save_error: '儲存失敗',
    idle: '準備就緒',
    week: '週',
    mon: '週一', tue: '週二', wed: '週三', thu: '週四', fri: '週五', sat: '週六', sun: '週日',
    week_prefix: '第', week_suffix: '週',
    semester_week: '學期第',
    pre_semester: '開學前',
    
    // 設定
    settings: '設定',
    semester_settings: '學期設定',
    language_settings: '語言 / Language',
    semester_start: '學期開始日 (第一週週一)',
    semester_total_weeks: '學期總週數',
    custom: '自訂',
    save_settings: '儲存設定',

    // 側邊欄 & 功能標題
    timetable: '課表',
    planner: '聯絡簿',
    grades: '成績',
    gpa: 'GPA',
    dashboard: '行事曆',
    ai_assistant: 'AI 助理',
    pomodoro: '番茄鐘',
    links: '常用連結',
    user_name: 'User',
    user_role: 'Student Account',

    // 聯絡簿
    no_tasks: '無待辦',
    no_tasks_today: '今日無行程',
    completed: '完成',
    confirm_delete_task: '確定要刪除「{subject}」嗎？',
    subject_placeholder: '科目...',
    note_placeholder: '備註...',
    
    // Categories (Flattened)
    'categories.exam': '考試',
    'categories.report': '報告',
    'categories.homework': '作業',
    'categories.cancel': '停課',
    'categories.other': '其他',

    // 課表
    period: '節',
    time: '時間',
    edit_timetable: '編輯課表',
    finish_edit: '完成編輯',
    edit_modal_title_time: '修改時間',
    edit_modal_title_course: '編輯課程',
    course_name_placeholder: '輸入課程名稱...',
    setting_hint: '設定',

    // 成績 & GPA
    all_records: '所有紀錄',
    subject_categories: '科目分類',
    add_grade: '新增紀錄',
    add_course: '新增課程',
    course_name: '科目名稱',
    credit: '學分',
    score: '分數',
    gpa_score: 'GPA',
    action: '操作',
    grade_note_placeholder: '備註 (例如：期中考)',
    grade_note_optional: '備註 (選填)',
    total_courses: '總課程數',
    current_gpa: '目前 GPA (4.3)',
    records_count: '{count} 筆紀錄',
    no_note: '無備註',
    calc_semester_score: '計算學期成績',
    
    // 成績計算機
    score_calculator: '學期成績計算',
    item_placeholder: '項目 (如: 期中考)',
    weight_placeholder: '30',
    score_placeholder: '得分',
    add_criteria_item: '+ 新增評分項目',
    total_weight: '總權重',
    not_100: '(未滿100%)',
    estimated_score: '預估學期成績',
    save_and_apply: '儲存並應用',
    save_criteria: '儲存評分標準',
    click_to_calc: '點擊以計算',

    // 番茄鐘
    focus_mode: '專注模式',
    break_mode: '休息模式',
    select_subject: '-- 請選擇專注科目 --',
    new_custom_subject: '＋ 新增科目...',
    input_subject: '輸入科目...',
    weekly_stats: '本週統計',
    unit_hours: '單位: 小時',
    no_study_records: '本週尚無讀書紀錄',
    focus_end: '專注結束！',
    break_end: '休息結束！',
    record_saved: '已記錄「{subject}」。',

    // AI
    ai_welcome: '嗨！我是 StudyHub 助理。我可以根據你的資料庫內容，回答關於課表、成績或行程的問題。\n\n你可以點擊下方的按鈕快速提問，或直接輸入文字。',
    ai_thinking: '思考中...',
    ai_input_placeholder: '詢問關於您的課表、成績...',
    ai_preset_today_class: '今天有什麼課？',
    ai_preset_exam: '什麼時候有考試？',
    ai_preset_report: '什麼時候有報告？',
    ai_preset_homework: '什麼時候有作業？',
    ai_preset_score: '我的成績如何？',
    ai_preview_prefix: '(預覽模擬 - 僅回答資料庫內容)\n根據您的資料庫：\n',
    ai_preview_suffix: '\n\n(以上為我所知的全部資訊)',
    ai_reject: '(系統訊息)\n抱歉，我被設計為「StudyHub 專屬資料庫查詢員」。\n\n我無法回答關於「{input}」的通用知識問題。請詢問關於您的 **課表、成績、聯絡簿** 或 **今日行程** 的問題。',
    today_highlight: '【今日 ({date}) 重點】',
    db_overview: '【資料庫全覽】',
    all_planner: '所有聯絡簿：',
    all_grades: '所有成績：',
    no_class: '無課程',
    no_todo: '無待辦',

    // 連結
    open_link: '開啟',
    add_link: '新增連結',
    link_name_placeholder: '名稱',
    link_url_placeholder: '網址',
    confirm_delete_link: '確定要刪除連結「{title}」嗎？'
  },
  'en': {
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    close: 'Close',
    loading: 'Loading...',
    saving: 'Saving...',
    saved: 'Saved',
    save_error: 'Error',
    idle: 'Ready',
    week: 'Week',
    mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
    week_prefix: 'Week ', week_suffix: '',
    semester_week: 'Sem. Week ',
    pre_semester: 'Pre-semester',
    
    settings: 'Settings',
    semester_settings: 'Semester Settings',
    language_settings: 'Language',
    semester_start: 'Semester Start Date (First Monday)',
    semester_total_weeks: 'Total Weeks',
    custom: 'Custom',
    save_settings: 'Save Settings',

    timetable: 'Timetable',
    planner: 'Planner',
    grades: 'Grades',
    gpa: 'GPA',
    dashboard: 'Dashboard',
    ai_assistant: 'AI Assistant',
    pomodoro: 'Pomodoro',
    links: 'Links',
    user_name: 'User',
    user_role: 'Student Account',

    no_tasks: 'No Tasks',
    no_tasks_today: 'No schedule today',
    completed: 'Done',
    confirm_delete_task: 'Delete "{subject}"?',
    subject_placeholder: 'Subject...',
    note_placeholder: 'Note...',
    
    // Categories
    'categories.exam': 'Exam',
    'categories.report': 'Report',
    'categories.homework': 'HW',
    'categories.cancel': 'Cancel',
    'categories.other': 'Other',

    period: 'Prd',
    time: 'Time',
    edit_timetable: 'Edit Table',
    finish_edit: 'Finish',
    edit_modal_title_time: 'Edit Time',
    edit_modal_title_course: 'Edit Course',
    course_name_placeholder: 'Course Name...',
    setting_hint: 'Set',

    all_records: 'All Records',
    subject_categories: 'By Subject',
    add_grade: 'Add Grade',
    add_course: 'Add Course',
    course_name: 'Course Name',
    credit: 'Credit',
    score: 'Score',
    gpa_score: 'GPA',
    action: 'Action',
    grade_note_placeholder: 'Note (e.g., Midterm)',
    grade_note_optional: 'Note (Optional)',
    total_courses: 'Total Courses',
    current_gpa: 'Current GPA (4.3)',
    records_count: '{count} records',
    no_note: 'No note',
    calc_semester_score: 'Calc. Semester Score',

    score_calculator: 'Score Calculator',
    item_placeholder: 'Item (e.g., Midterm)',
    weight_placeholder: '30',
    score_placeholder: 'Score',
    add_criteria_item: '+ Add Item',
    total_weight: 'Total Weight',
    not_100: '(< 100%)',
    estimated_score: 'Est. Score',
    save_and_apply: 'Save & Apply',
    save_criteria: 'Save Criteria',
    click_to_calc: 'Click to Calc',

    focus_mode: 'Focus Mode',
    break_mode: 'Break Mode',
    select_subject: '-- Select Subject --',
    new_custom_subject: '＋ New Subject...',
    input_subject: 'Enter Subject...',
    weekly_stats: 'Weekly Stats',
    unit_hours: 'Unit: Hours',
    no_study_records: 'No records this week',
    focus_end: 'Focus session ended!',
    break_end: 'Break ended!',
    record_saved: 'Recorded "{subject}".',

    ai_welcome: 'Hi! I am your StudyHub Assistant. I can answer questions about your schedule, grades, or planner based on your database.\n\nClick a button below or type to ask.',
    ai_thinking: 'Thinking...',
    ai_input_placeholder: 'Ask about schedule, grades...',
    ai_preset_today_class: 'Classes today?',
    ai_preset_exam: 'When is the exam?',
    ai_preset_report: 'When is the report due?',
    ai_preset_homework: 'Any homework?',
    ai_preset_score: 'How are my grades?',
    ai_preview_prefix: '(Preview - DB Context Only)\nBased on your data:\n',
    ai_preview_suffix: '\n\n(End of known info)',
    ai_reject: '(System)\nI am designed as a "StudyHub DB Query Agent".\n\nI cannot answer general questions like "{input}". Please ask about your **Timetable, Grades, Planner** or **Today\'s Schedule**.',
    today_highlight: '【Today ({date}) Highlights】',
    db_overview: '【Database Overview】',
    all_planner: 'All Planner Items:',
    all_grades: 'All Grades:',
    no_class: 'No classes',
    no_todo: 'No tasks',

    open_link: 'Open',
    add_link: 'Add Link',
    link_name_placeholder: 'Name',
    link_url_placeholder: 'URL',
    confirm_delete_link: 'Delete link "{title}"?'
  },
  'ja': {
    save: '保存',
    cancel: 'キャンセル',
    confirm: '確認',
    delete: '削除',
    edit: '編集',
    add: '追加',
    close: '閉じる',
    loading: '読み込み中...',
    saving: '保存中...',
    saved: '保存完了',
    save_error: '保存失敗',
    idle: '準備完了',
    week: '週',
    mon: '月', tue: '火', wed: '水', thu: '木', fri: '金', sat: '土', sun: '日',
    week_prefix: '第', week_suffix: '週',
    semester_week: '学期第',
    pre_semester: '学期前',
    
    settings: '設定',
    semester_settings: '学期設定',
    language_settings: '言語 / Language',
    semester_start: '学期開始日 (最初の月曜日)',
    semester_total_weeks: '総週数',
    custom: 'カスタム',
    save_settings: '設定を保存',

    timetable: '時間割',
    planner: '連絡帳',
    grades: '成績',
    gpa: 'GPA',
    dashboard: 'カレンダー',
    ai_assistant: 'AI アシスタント',
    pomodoro: 'ポモドーロ',
    links: 'リンク集',
    user_name: 'User',
    user_role: 'Student Account',

    no_tasks: 'なし',
    no_tasks_today: '今日の予定はありません',
    completed: '完了',
    confirm_delete_task: '「{subject}」を削除しますか？',
    subject_placeholder: '科目...',
    note_placeholder: 'メモ...',
    
    // Categories
    'categories.exam': '試験',
    'categories.report': 'レポート',
    'categories.homework': '宿題',
    'categories.cancel': '休講',
    'categories.other': 'その他',

    period: '限',
    time: '時間',
    edit_timetable: '時間割編集',
    finish_edit: '完了',
    edit_modal_title_time: '時間変更',
    edit_modal_title_course: '科目編集',
    course_name_placeholder: '科目名を入力...',
    setting_hint: '設定',

    all_records: '全記録',
    subject_categories: '科目別',
    add_grade: '記録追加',
    add_course: '科目追加',
    course_name: '科目名',
    credit: '単位',
    score: '点数',
    gpa_score: 'GPA',
    action: '操作',
    grade_note_placeholder: 'メモ (例: 中間テスト)',
    grade_note_optional: 'メモ (任意)',
    total_courses: '科目数',
    current_gpa: '現在 GPA (4.3)',
    records_count: '{count} 件',
    no_note: 'メモなし',
    calc_semester_score: '学期成績計算',

    score_calculator: '成績計算機',
    item_placeholder: '項目 (例: 中間)',
    weight_placeholder: '30',
    score_placeholder: '点数',
    add_criteria_item: '+ 評価項目を追加',
    total_weight: '総比重',
    not_100: '(100%未満)',
    estimated_score: '予想成績',
    save_and_apply: '保存して適用',
    save_criteria: '基準を保存',
    click_to_calc: 'クリックして計算',

    focus_mode: '集中モード',
    break_mode: '休憩モード',
    select_subject: '-- 科目を選択 --',
    new_custom_subject: '＋ 新しい科目...',
    input_subject: '科目を入力...',
    weekly_stats: '今週の統計',
    unit_hours: '単位: 時間',
    no_study_records: '今週の学習記録はありません',
    focus_end: '集中タイム終了！',
    break_end: '休憩終了！',
    record_saved: '「{subject}」を記録しました。',

    ai_welcome: 'こんにちは！StudyHub アシスタントです。あなたのデータベースに基づいて、時間割、成績、予定に関する質問にお答えします。\n\n下のボタンをクリックするか、文字を入力してください。',
    ai_thinking: '考え中...',
    ai_input_placeholder: '時間割や成績について聞く...',
    ai_preset_today_class: '今日の授業は？',
    ai_preset_exam: '試験はいつ？',
    ai_preset_report: 'レポートの締切は？',
    ai_preset_homework: '宿題はある？',
    ai_preset_score: '成績はどう？',
    ai_preview_prefix: '(プレビュー - DB内容のみ)\nデータに基づいて：\n',
    ai_preview_suffix: '\n\n(以上が私が知っている情報です)',
    ai_reject: '(システム)\n申し訳ありませんが、私は「StudyHub 専用 DB 検索エージェント」です。\n\n「{input}」のような一般的な質問にはお答えできません。**時間割、成績、連絡帳** または **今日の予定** について質問してください。',
    today_highlight: '【今日 ({date}) のハイライト】',
    db_overview: '【データベース概要】',
    all_planner: '全ての予定：',
    all_grades: '全ての成績：',
    no_class: '授業なし',
    no_todo: '予定なし',

    open_link: '開く',
    add_link: 'リンク追加',
    link_name_placeholder: '名称',
    link_url_placeholder: 'URL',
    confirm_delete_link: 'リンク「{title}」を削除しますか？'
  }
};

// --- 設定區 ---
const CATEGORIES = {
  EXAM: { id: 'exam', key: 'exam', color: 'bg-red-500', border: 'border-l-4 border-red-500', text: 'text-red-700' },
  REPORT: { id: 'report', key: 'report', color: 'bg-green-500', border: 'border-l-4 border-green-500', text: 'text-green-700' },
  HOMEWORK: { id: 'homework', key: 'homework', color: 'bg-purple-500', border: 'border-l-4 border-purple-500', text: 'text-purple-700' },
  CANCEL: { id: 'cancel', key: 'cancel', color: 'bg-yellow-400', border: 'border-l-4 border-yellow-400', text: 'text-yellow-700' },
  OTHER: { id: 'other', key: 'other', color: 'bg-blue-400', border: 'border-l-4 border-blue-400', text: 'text-blue-700' }
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

// 輔助函式：取得本地 YYYY-MM-DD 字串
const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function StudyHubApp() {
  const [activeTab, setActiveTab] = useState('timetable'); 
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [language, setLanguage] = useState('zh-TW'); // 預設語言
  
  const t = (key, params = {}) => {
    let text = TRANSLATIONS[language][key] || key;
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    return text;
  };

  // 學期設定
  const [semesterStart, setSemesterStart] = useState(new Date(new Date().getFullYear(), 8, 1)); // 預設 9/1
  const [semesterWeeks, setSemesterWeeks] = useState(18); // 預設 18 週，可改為 16
  
  // --- 資料庫同步狀態 ---
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); 
  const saveTimeoutRef = useRef(null);

  // --- 資料狀態 ---
  const [tasks, setTasks] = useState([
    { id: 1, date: getLocalDateString(new Date()), category: 'exam', subject: 'Calculus Example', note: 'Ch1-3', completed: false },
  ]);

  const [grades, setGrades] = useState([
    { id: 1, date: getLocalDateString(new Date()), subject: 'Intro to CS Example', score: '85', note: 'Midterm' },
  ]);

  const [timetable, setTimetable] = useState({
      "1-1": "Calculus", "1-2": "Calculus",
  });

  const [periodTimes, setPeriodTimes] = useState({
      '1': '08:10-09:00', '2': '09:10-10:00', '3': '10:20-11:10', '4': '11:20-12:10',
      '5': '12:20-13:10', '6': '13:20-14:10', '7': '14:20-15:10', '8': '15:30-16:20',
      '9': '16:30-17:20', '10': '17:30-18:20', 'A': '18:25-19:15', 'B':'19:20-20:10',
      'C': '20:15-21:05',
  });

  const [gpaCourses, setGpaCourses] = useState([]);
  const [links, setLinks] = useState([]);
  const [studyLogs, setStudyLogs] = useState([]);
  const [pomodoroSubjects, setPomodoroSubjects] = useState([]);
  const [courseCriteria, setCourseCriteria] = useState({});

  // --- 資料庫整合邏輯 ---

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedData = localStorage.getItem('studyhub_data');
        if (savedData) {
          const data = JSON.parse(savedData);
          if (Object.keys(data).length > 0) {
            if (data.tasks) setTasks(data.tasks);
            if (data.grades) setGrades(data.grades);
            if (data.timetable) setTimetable(data.timetable);
            if (data.periodTimes) setPeriodTimes(data.periodTimes);
            if (data.gpaCourses) setGpaCourses(data.gpaCourses);
            if (data.links) setLinks(data.links);
            if (data.studyLogs) setStudyLogs(data.studyLogs);
            if (data.pomodoroSubjects) setPomodoroSubjects(data.pomodoroSubjects);
            if (data.currentDate) setCurrentDate(new Date(data.currentDate));
            if (data.semesterStart) setSemesterStart(new Date(data.semesterStart));
            if (data.semesterWeeks) setSemesterWeeks(data.semesterWeeks);
            if (data.courseCriteria) setCourseCriteria(data.courseCriteria);
            if (data.language) setLanguage(data.language); // 讀取語言設定
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

  useEffect(() => {
    if (!isDataLoaded) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    setSaveStatus('saving');

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const payload = {
          tasks, grades, timetable, periodTimes, gpaCourses, links, studyLogs, pomodoroSubjects,
          currentDate: currentDate.toISOString(),
          semesterStart: semesterStart.toISOString(),
          semesterWeeks,
          courseCriteria,
          language // 儲存語言設定
        };
        
        localStorage.setItem('studyhub_data', JSON.stringify(payload));
        await new Promise(r => setTimeout(r, 300));
        setSaveStatus('saved');
      } catch (e) {
        console.error("Save error:", e);
        setSaveStatus('error');
      }
    }, 1000);

    return () => clearTimeout(saveTimeoutRef.current);
  }, [tasks, grades, timetable, periodTimes, gpaCourses, links, studyLogs, pomodoroSubjects, currentDate, semesterStart, semesterWeeks, courseCriteria, language, isDataLoaded]);


  // --- 輔助函式 ---
  const getWeekNumber = (date) => {
    const diff = date - semesterStart;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const weekNum = Math.ceil(diff / oneWeek);
    return weekNum > 0 ? weekNum : 0;
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

  // --- 新版網頁介面元件 ---

  const Sidebar = () => (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col transition-all duration-300 z-20">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <h1 className="text-xl font-black text-gray-800 flex items-center gap-2 tracking-tight">
          <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">
            <span className="font-serif italic">S</span>
          </div>
          StudyHub
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {[
            { id: 'timetable', label: t('timetable'), icon: <RotateCw size={18}/> },
            { id: 'planner', label: t('planner'), icon: <BookOpen size={18}/> },
            { id: 'grades', label: t('grades'), icon: <Edit2 size={18}/> },
            { id: 'gpa', label: t('gpa'), icon: <Calculator size={18}/> },
            { id: 'dashboard', label: t('dashboard'), icon: <Calendar size={18}/> },
            { id: 'ai', label: t('ai_assistant'), icon: <Sparkles size={18}/>, special: true },
            { id: 'pomodoro', label: t('pomodoro'), icon: <Clock size={18}/> },
            { id: 'links', label: t('links'), icon: <LinkIcon size={18}/> },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
              ${activeTab === item.id 
                ? (item.special ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-black text-white shadow-md shadow-gray-200') 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}
            `}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.special && <span className="ml-auto text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white">BETA</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 border border-gray-100">
           <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
             U
           </div>
           <div>
             <div className="text-xs font-bold text-gray-900">{t('user_name')}</div>
             <div className="text-[10px] text-gray-500">{t('user_role')}</div>
           </div>
        </div>
      </div>
    </aside>
  );

  const TopBar = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [tempStart, setTempStart] = useState(getLocalDateString(semesterStart));
    const [tempWeeks, setTempWeeks] = useState(semesterWeeks);

    const handleSaveSettings = () => {
        setSemesterStart(new Date(tempStart));
        setSemesterWeeks(parseInt(tempWeeks));
        setIsSettingsOpen(false);
    };

    // 依據語言設定格式化日期
    const todayDateString = new Intl.DateTimeFormat(language === 'en' ? 'en-US' : (language === 'ja' ? 'ja-JP' : 'zh-TW'), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    }).format(new Date());

    const weekKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-10 sticky top-0">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-lg border border-gray-200/50">
                <button onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() - 7);
                setCurrentDate(newDate);
                }} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-500 transition-all">
                <ChevronLeft size={16} />
                </button>
                
                <div className="flex flex-col items-center px-3 min-w-[120px]">
                <span className="text-xs font-bold text-gray-800">
                    {weekDays[0].getMonth()+1}/{weekDays[0].getDate()} - {weekDays[6].getMonth()+1}/{weekDays[6].getDate()}
                </span>
                
                {currentWeekNum <= 0 && (
                    <span className="text-[10px] font-bold px-2 rounded-full mt-0.5 bg-gray-50 text-gray-500">
                        {t('pre_semester')}
                    </span>
                )}
                {currentWeekNum > 0 && currentWeekNum <= semesterWeeks && (
                    <span className="text-[10px] font-bold px-2 rounded-full mt-0.5 bg-blue-50 text-blue-600">
                        {t('semester_week')} {currentWeekNum} {t('week_suffix')}
                    </span>
                )}
                </div>

                <button onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() + 7);
                setCurrentDate(newDate);
                }} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-gray-500 transition-all">
                <ChevronRight size={16} />
                </button>
            </div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 font-bold text-gray-700 text-sm hidden md:block">
            {todayDateString}
        </div>

        <div className="flex items-center gap-4">
            <button 
                onClick={() => {
                    setTempStart(getLocalDateString(semesterStart));
                    setTempWeeks(semesterWeeks);
                    setIsSettingsOpen(true);
                }}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
                title={t('settings')}
            >
                <Settings size={20} />
            </button>

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border
                ${saveStatus === 'saving' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                saveStatus === 'saved' ? 'bg-green-50 text-green-600 border-green-100' : 
                saveStatus === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                <Cloud size={14} />
                <span>
                {saveStatus === 'saving' && t('saving')}
                {saveStatus === 'saved' && t('saved')}
                {saveStatus === 'error' && t('save_error')}
                {saveStatus === 'idle' && t('idle')}
                </span>
            </div>
        </div>

        {isSettingsOpen && (
            <div className="fixed inset-0 bg-black/20 z-50 flex items-start justify-end p-4 animate-in fade-in">
                <div className="bg-white w-80 rounded-2xl p-5 shadow-2xl mt-16 border border-gray-200 mr-2">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2"><Settings size={16}/> {t('settings')}</h3>
                        <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
                    </div>
                    <div className="space-y-4">
                        {/* 語言設定 */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1.5 block flex items-center gap-1"><Globe size={12}/> {t('language_settings')}</label>
                            <div className="flex gap-2">
                                {[{code: 'zh-TW', label: '繁體中文'}, {code: 'en', label: 'English'}, {code: 'ja', label: '日本語'}].map(lang => (
                                    <button 
                                        key={lang.code}
                                        onClick={() => setLanguage(lang.code)}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${language === lang.code ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-gray-100 my-2"></div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1.5 block">{t('semester_start')}</label>
                            <input 
                                type="date" 
                                className="w-full border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:border-black transition-colors"
                                value={tempStart}
                                onChange={(e) => setTempStart(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1.5 block">{t('semester_total_weeks')}</label>
                            <div className="flex gap-2">
                                {[16, 18].map(w => (
                                    <button 
                                        key={w}
                                        onClick={() => setTempWeeks(w)}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${parseInt(tempWeeks) === w ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                                    >
                                        {w}{t('week')}
                                    </button>
                                ))}
                                <input 
                                    type="number" 
                                    className="w-16 border border-gray-300 rounded-lg p-2 text-sm text-center outline-none focus:border-black"
                                    value={tempWeeks}
                                    onChange={(e) => setTempWeeks(e.target.value)}
                                    placeholder={t('custom')}
                                />
                            </div>
                        </div>
                        <div className="pt-2">
                            <button 
                                onClick={handleSaveSettings}
                                className="w-full bg-black text-white py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
                            >
                                {t('save_settings')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </header>
    );
  };

  // --- Views (Content Area) ---

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
          if (window.confirm(t('confirm_delete_link', {title}))) {
              setLinks(links.filter(l => l.id !== id));
          }
      };

      return (
          <div className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {links.map(link => (
                      <div key={link.id} className="relative group h-40">
                          <button 
                              onClick={(e) => {
                                  e.stopPropagation();
                                  confirmDelete(link.id, link.title);
                              }}
                              className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                          >
                              <X size={14} />
                          </button>
                          
                          <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer no-underline text-gray-700 h-full"
                          >
                              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                  <LinkIcon size={24} />
                              </div>
                              <span className="font-bold text-sm text-center line-clamp-1 w-full px-1">{link.title}</span>
                              <div className="flex items-center text-[10px] text-gray-400 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span>{t('open_link')}</span> <ExternalLink size={10} />
                              </div>
                          </a>
                      </div>
                  ))}
                  
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600 hover:border-gray-400 hover:bg-gray-100 transition-all h-40"
                  >
                      <Plus size={24} />
                      <span className="text-xs font-bold">{t('add_link')}</span>
                  </button>
              </div>

              {isAdding && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
                      <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-xl">
                          <h3 className="font-bold text-lg mb-4 text-gray-800">{t('add_link')}</h3>
                          <input placeholder={t('link_name_placeholder')} className="w-full border border-gray-300 rounded-xl p-3 mb-3 text-sm focus:border-black outline-none" value={newLink.title} onChange={e => setNewLink({...newLink, title: e.target.value})} />
                          <input placeholder={t('link_url_placeholder')} className="w-full border border-gray-300 rounded-xl p-3 mb-5 text-sm focus:border-black outline-none" value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} />
                          <div className="flex gap-3">
                              <button onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-gray-100 rounded-xl text-sm font-bold">{t('cancel')}</button>
                              <button onClick={addLink} className="flex-1 py-3 bg-black text-white rounded-xl text-sm font-bold">{t('confirm')}</button>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const AIChatView = ({ tasks, grades, timetable, currentDate, gpaCourses, periodTimes }) => {
    // 翻譯支援：當語言切換時，重置歡迎訊息
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {
        // 初始化或語言切換時更新第一條訊息
        setMessages([{ role: 'assistant', content: t('ai_welcome') }]);
    }, [language]); // 依賴 language

    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    
    useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

    const getSystemContext = () => {
        const weekDaysKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        const currentDayIndex = currentDate.getDay(); 
        const tableDayIndex = currentDayIndex === 0 ? 7 : currentDayIndex;

        const todaysClasses = Object.entries(timetable)
            .filter(([k, v]) => k.startsWith(`${tableDayIndex}-`))
            .map(([k, v]) => {
                const period = k.split('-')[1];
                const time = periodTimes[period] || '';
                return `${t('week_prefix')}${period}${t('period')} (${time}): ${v}`;
            })
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
            .join('\n');

        const todaysTasks = tasks.filter(t => t.date === getLocalDateString(currentDate))
            .map(t => `[${t('categories.' + t.category) || t('categories.other')}] ${t.subject}: ${t.note}`)
            .join('\n');

        const allTasks = tasks.map(t => `(${t.date}) [${t('categories.' + t.category) || t('categories.other')}] ${t.subject}: ${t.note}`).join('\n');
        const allGrades = grades.map(g => `[${g.subject}] ${g.score} (${g.note})`).join('\n');

        return `${t('today_highlight', {date: getLocalDateString(currentDate)})}\n${todaysClasses || t('no_class')}\n\n${t('no_tasks_today') || t('no_todo')}\n${todaysTasks || t('no_tasks')}\n\n${t('db_overview')}\n${t('all_planner')}\n${allTasks}\n\n${t('all_grades')}\n${allGrades}`;
    };

    const handleSend = async (text = null) => {
        const content = typeof text === 'string' ? text : input;
        if (!content.trim() || isSending) return;
        
        const userMsg = { role: 'user', content: content };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages); 
        if (typeof text !== 'string') setInput(''); 
        setIsSending(true);
        
        setTimeout(() => {
            const dbKeywords = /課|行程|表|time|schedule|today|今天|成績|grade|score|gpa|聯絡簿|作業|考試|report|homework|exam/i;
            const isAskingAboutDB = dbKeywords.test(userMsg.content);

            let fakeReply = "";
            if (isAskingAboutDB) {
                 const context = getSystemContext();
                 fakeReply = `${t('ai_preview_prefix')}${context}${t('ai_preview_suffix')}`;
            } else {
                 fakeReply = t('ai_reject', {input: userMsg.content});
            }
            
            setMessages(prev => [...prev, { role: 'assistant', content: fakeReply }]);
            setIsSending(false);
        }, 800);
    };

    const presetQuestions = [
        t('ai_preset_today_class'),
        t('ai_preset_exam'),
        t('ai_preset_report'),
        t('ai_preset_homework'),
        t('ai_preset_score')
    ];

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, idx) => ( <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[70%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${msg.role === 'user' ? 'bg-black text-white rounded-br-none' : 'bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-none'}`}>{msg.content}</div></div> ))}
                {isSending && <div className="text-gray-400 text-xs ml-4 animate-pulse">{t('ai_thinking')}</div>}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="bg-gray-50 border-t border-gray-200">
                <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar">
                    {presetQuestions.map((q, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => handleSend(q)}
                            className="whitespace-nowrap px-4 py-2 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-all shadow-sm"
                        >
                            {q}
                        </button>
                    ))}
                </div>
                <div className="p-4 pt-0 flex gap-3">
                    <input type="text" placeholder={t('ai_input_placeholder')} className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
                    <button onClick={() => handleSend()} disabled={isSending || !input.trim()} className="bg-black text-white p-3 rounded-xl hover:bg-gray-800 transition-colors disabled:bg-gray-300"><Send size={18} /></button>
                </div>
            </div>
        </div>
    );
  };

  const TimetableView = ({ timetable, setTimetable, periodTimes, setPeriodTimes }) => {
      const periods = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'B', 'C'];
      // 依據語言動態生成星期
      const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(k => t(k));
      
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
          <div className="h-full flex flex-col">
              <div className="flex-1 overflow-auto rounded-xl border border-gray-200 shadow-sm bg-white">
                <div className="min-w-[800px]">
                    <div className="grid grid-cols-[60px_100px_repeat(7,1fr)] text-center text-sm font-bold bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                        <div className="p-3 border-r border-gray-200 text-gray-500">{t('period')}</div>
                        <div className="p-3 border-r border-gray-200 text-gray-500">{t('time')}</div>
                        {days.map(d => <div key={d} className="p-3 border-r border-gray-200 last:border-0 text-gray-700">{d}</div>)}
                    </div>
                    {periods.map(p => (
                        <div key={p} className="grid grid-cols-[60px_100px_repeat(7,1fr)] text-center text-sm h-16 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                            <div className="flex items-center justify-center bg-gray-50 text-gray-500 font-bold border-r border-gray-200">{p}</div>
                            
                            <div onClick={() => handleTimeClick(p)} className={`flex flex-col items-center justify-center border-r border-gray-200 p-1 h-full text-xs text-gray-500 ${isEditing ? 'cursor-pointer hover:bg-indigo-50' : ''}`}>
                                {(() => {
                                    const tVal = periodTimes[p] || "";
                                    if (tVal.includes('-')) {
                                        const [start, end] = tVal.split('-');
                                        return (<><div>{start}</div><div className="text-gray-300">|</div><div>{end}</div></>);
                                    }
                                    return tVal || (isEditing ? <span className="text-indigo-300">{t('setting_hint')}</span> : "");
                                })()}
                            </div>

                            {days.map((_, dayIdx) => {
                                const key = `${dayIdx + 1}-${p}`;
                                const subject = timetable[key];
                                return (
                                    <div key={key} onClick={() => handleCellClick(dayIdx, p)} className={`flex items-center justify-center p-1 border-r border-gray-100 last:border-0 ${isEditing ? 'cursor-pointer hover:bg-indigo-50' : ''}`}>
                                        {subject ? (
                                            <div className="bg-indigo-50 text-indigo-700 rounded-lg px-2 py-1 w-full h-full flex items-center justify-center text-xs font-bold break-all leading-tight border border-indigo-100 shadow-sm">{subject}</div>
                                        ) : (
                                            isEditing && <div className="text-indigo-100 text-lg opacity-0 hover:opacity-100 transition-opacity">+</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                  <button onClick={() => setIsEditing(!isEditing)} className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2 ${isEditing ? 'bg-black text-white hover:bg-gray-800' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                      {isEditing ? <> <Check size={16} /> {t('finish_edit')} </> : <> <Edit2 size={16} /> {t('edit_timetable')} </>}
                  </button>
              </div>

              {editModal.isOpen && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
                      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">
                          <h3 className="font-bold text-lg mb-4 text-gray-800">{editModal.type === 'time' ? t('edit_modal_title_time') : t('edit_modal_title_course')}</h3>
                          {editModal.type === 'time' ? (
                              <div className="flex items-center gap-2 mb-6">
                                  <input type="time" className="border border-gray-300 rounded-lg p-2 text-sm w-full" value={timeEdit.start} onChange={e => setTimeEdit({...timeEdit, start: e.target.value})} />
                                  <span>-</span>
                                  <input type="time" className="border border-gray-300 rounded-lg p-2 text-sm w-full" value={timeEdit.end} onChange={e => setTimeEdit({...timeEdit, end: e.target.value})} />
                              </div>
                          ) : (
                              <input autoFocus className="w-full border border-gray-300 rounded-xl p-3 mb-5 text-sm focus:border-black outline-none" value={editModal.value} onChange={e => setEditModal({...editModal, value: e.target.value})} placeholder={t('course_name_placeholder')} />
                          )}
                          <div className="flex gap-3">
                              <button onClick={() => setEditModal({...editModal, isOpen: false})} className="flex-1 py-2.5 bg-gray-100 rounded-xl text-sm font-bold text-gray-600">{t('cancel')}</button>
                              <button onClick={saveEdit} className="flex-1 py-2.5 bg-black text-white rounded-xl text-sm font-bold">{t('confirm')}</button>
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
                      alert(t('focus_end') + " " + t('record_saved', {subject: subjectToSave}));
                      const todayStr = getLocalDateString(currentDate);
                      setStudyLogs(prev => [...prev, { id: Date.now(), date: todayStr, subject: subjectToSave, duration: 25 }]);
                      
                      if (isCreatingSubject && customSubject) {
                          setPomodoroSubjects(prev => [...prev, customSubject]);
                          setIsCreatingSubject(false);
                          setTargetSubject(customSubject);
                          setCustomSubject("");
                      }
                  } else {
                      alert(t('focus_end'));
                  }
              } else {
                  alert(t('break_end'));
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
          <div className="h-full flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex flex-col items-center justify-center space-y-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <div className="flex bg-gray-100 p-1.5 rounded-full">
                      <button onClick={() => switchMode('work')} className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${mode === 'work' ? 'bg-white shadow text-red-500' : 'text-gray-500'}`}>{t('focus_mode')}</button>
                      <button onClick={() => switchMode('break')} className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${mode === 'break' ? 'bg-white shadow text-green-500' : 'text-gray-500'}`}>{t('break_mode')}</button>
                  </div>

                  {mode === 'work' && (
                      <div className="w-full max-w-xs">
                          {isCreatingSubject ? (
                              <div className="flex gap-2 items-center">
                                  <input autoFocus placeholder={t('input_subject')} className="w-full border-b-2 border-indigo-500 outline-none text-center pb-2 bg-transparent text-lg" value={customSubject} onChange={(e) => setCustomSubject(e.target.value)} />
                                  <button onClick={handleConfirmSubject} className="text-green-500 hover:text-green-600 bg-green-50 p-2 rounded-full"><Check size={20}/></button>
                                  <button onClick={() => setIsCreatingSubject(false)} className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full"><X size={20}/></button>
                              </div>
                          ) : (
                              <select className="bg-gray-50 border border-gray-200 text-gray-700 text-lg rounded-xl p-3 w-full outline-none focus:border-black text-center cursor-pointer" value={targetSubject} onChange={handleSubjectChange}>
                                  <option value="">{t('select_subject')}</option>
                                  {pomodoroSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                                  <option value="NEW_CUSTOM">{t('new_custom_subject')}</option>
                              </select>
                          )}
                      </div>
                  )}

                  <div className={`w-72 h-72 rounded-full border-[12px] flex items-center justify-center shadow-xl transition-all duration-500 ${mode === 'work' ? 'border-red-50 bg-white' : 'border-green-50 bg-white'}`}>
                      <span className={`text-7xl font-mono font-bold tracking-tighter ${mode === 'work' ? 'text-red-500' : 'text-green-500'}`}>{formatTime(timeLeft)}</span>
                  </div>

                  <div className="flex gap-6">
                      <button onClick={toggleTimer} className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 transition-transform shadow-xl hover:shadow-2xl">{isActive ? <span className="text-3xl">⏸</span> : <span className="text-3xl ml-1">▶</span>}</button>
                      <button onClick={resetTimer} className="w-20 h-20 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-50 shadow-md hover:shadow-lg transition-all"><RotateCw size={28} /></button>
                  </div>
              </div>

              <div className="w-full md:w-80 bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2"><BarChart2 size={20} className="text-blue-500"/> {t('weekly_stats')}</h3>
                      <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">{t('unit_hours')}</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {subjectStats.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-300 text-sm italic border-2 border-dashed border-gray-100 rounded-xl min-h-[200px]">
                            <Clock size={40} className="mb-2 opacity-20"/>
                            {t('no_study_records')}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {subjectStats.map((stat, i) => (
                                <div key={stat.subject} className="flex flex-col gap-1">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-gray-700">{stat.subject}</span>
                                        <span className="text-xs text-gray-500 font-mono font-bold">{stat.hours}hr</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${Math.max((parseFloat(stat.hours) / maxSubjectHours) * 100, 5)}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                  </div>
              </div>
          </div>
      );
  };

  const GpaView = ({ gpaCourses, setGpaCourses, courseCriteria, setCourseCriteria }) => {
      const calculatedGPA = useMemo(() => {
          let totalPoints = 0; let totalCredits = 0;
          gpaCourses.forEach(c => { 
              const credit = parseFloat(c.credit); 
              let score = parseFloat(c.score);
              if (isNaN(score)) {
                  const criteria = courseCriteria[c.name];
                  if (criteria) {
                      let tempScore = 0;
                      criteria.forEach(item => {
                          const w = parseFloat(item.weight) || 0;
                          const s = parseFloat(item.score) || 0;
                          tempScore += s * (w/100);
                      });
                      score = tempScore;
                  }
              }

              if (!isNaN(credit) && !isNaN(score)) { 
                  totalPoints += scoreToPoint(score) * credit; 
                  totalCredits += credit; 
              } 
          });
          return totalCredits === 0 ? "0.00" : (totalPoints / totalCredits).toFixed(2);
      }, [gpaCourses, courseCriteria]);
      
      const [isAdding, setIsAdding] = useState(false);
      const [newCourse, setNewCourse] = useState({ name: '', credit: '', score: '', note: '' }); 
      
      const [calcModal, setCalcModal] = useState({ isOpen: false, courseId: null, courseName: '' });
      const [currentCriteria, setCurrentCriteria] = useState([]);

      const openCalculator = (course) => {
          setCalcModal({ isOpen: true, courseId: course.id, courseName: course.name });
          setCurrentCriteria(courseCriteria[course.name] || []);
      };

      const closeCalculator = () => {
          setCalcModal({ isOpen: false, courseId: null, courseName: '' });
          setCurrentCriteria([]);
      };

      const addCriteriaItem = () => {
          setCurrentCriteria([...currentCriteria, { id: Date.now(), name: '', weight: '', score: '' }]);
      };

      const updateCriteriaItem = (id, field, value) => {
          setCurrentCriteria(currentCriteria.map(c => c.id === id ? { ...c, [field]: value } : c));
      };

      const removeCriteriaItem = (id) => {
          setCurrentCriteria(currentCriteria.filter(c => c.id !== id));
      };

      const saveCriteria = () => {
          setCourseCriteria(prev => ({ ...prev, [calcModal.courseName]: currentCriteria }));
          
          let totalScore = 0;
          currentCriteria.forEach(c => {
              const w = parseFloat(c.weight) || 0;
              const s = parseFloat(c.score) || 0;
              totalScore += s * (w / 100);
          });
          
          setGpaCourses(prev => prev.map(c => c.id === calcModal.courseId ? { ...c, score: totalScore.toFixed(0) } : c));

          closeCalculator();
      };

      const currentTotalScore = useMemo(() => {
          let total = 0;
          currentCriteria.forEach(c => {
              const w = parseFloat(c.weight) || 0;
              const s = parseFloat(c.score) || 0;
              total += s * (w / 100);
          });
          return total.toFixed(1);
      }, [currentCriteria]);

      const currentTotalWeight = useMemo(() => {
          let total = 0;
          currentCriteria.forEach(c => total += (parseFloat(c.weight) || 0));
          return total;
      }, [currentCriteria]);


      const addNewCourse = () => {
        if (!newCourse.name) return; 
        setGpaCourses([...gpaCourses, { id: Date.now(), ...newCourse }]);
        setNewCourse({ name: '', credit: '', score: '', note: '' }); 
        setIsAdding(false); 
      };

      const removeGpaRow = (id) => setGpaCourses(gpaCourses.filter(c => c.id !== id));
      const updateGpaRow = (id, field, value) => { setGpaCourses(gpaCourses.map(c => c.id === id ? { ...c, [field]: value } : c)); };

      return (
          <div className="h-full flex flex-col space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg flex items-center justify-between">
                  <div>
                      <p className="text-blue-100 text-sm font-bold tracking-wider uppercase mb-1">{t('current_gpa')}</p>
                      <h2 className="text-6xl font-black tracking-tighter">{calculatedGPA}</h2>
                  </div>
                  <div className="text-right">
                      <div className="text-3xl font-bold opacity-90">{gpaCourses.length}</div>
                      <div className="text-xs text-blue-200">{t('total_courses')}</div>
                  </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
                  <div className="grid grid-cols-12 bg-gray-50 text-xs font-bold text-gray-500 p-3 border-b border-gray-200 uppercase tracking-wide">
                      <div className="col-span-4 pl-2">{t('course_name')}</div>
                      <div className="col-span-2 text-center">{t('credit')}</div>
                      <div className="col-span-2 text-center">{t('score')}</div>
                      <div className="col-span-2 text-center">{t('gpa_score')}</div>
                      <div className="col-span-2 text-center">{t('action')}</div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {gpaCourses.map(course => (
                        <div key={course.id} className="grid grid-cols-12 p-3 border-b border-gray-100 items-center gap-2 hover:bg-gray-50 transition-colors group">
                            <div className="col-span-4 flex items-center gap-2">
                                <input placeholder={t('course_name_placeholder')} className="w-full text-sm font-medium text-gray-800 border-none bg-transparent outline-none focus:ring-0 placeholder:text-gray-300" value={course.name} onChange={e => updateGpaRow(course.id, 'name', e.target.value)}/>
                            </div>
                            
                            <input placeholder="-" type="number" className="col-span-2 text-center text-sm bg-gray-50 border border-gray-200 rounded-md py-1 focus:border-blue-500 outline-none" value={course.credit} onChange={e => updateGpaRow(course.id, 'credit', e.target.value)}/>
                            
                            <input placeholder="-" type="number" className="col-span-2 text-center text-sm bg-gray-50 border border-gray-200 rounded-md py-1 font-bold text-blue-600 focus:border-blue-500 outline-none" value={course.score} onChange={e => updateGpaRow(course.id, 'score', e.target.value)}/>
                            
                            <div className="col-span-2 text-center text-sm font-mono text-gray-500">{scoreToPoint(course.score)}</div>
                            
                            <div className="col-span-2 flex justify-center gap-1">
                                <button 
                                    onClick={() => openCalculator(course)}
                                    className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded-md transition-all"
                                    title={t('calc_semester_score')}
                                >
                                    <PieChart size={16} />
                                </button>
                                <button onClick={() => removeGpaRow(course.id)} className="text-gray-300 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-gray-200 bg-gray-50/50">
                    <button onClick={() => setIsAdding(true)} className="w-full py-3 text-center text-sm text-white font-bold bg-black rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-sm"><Plus size={18} /> {t('add_course')}</button>
                  </div>
              </div>

              {isAdding && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
                      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">
                          <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg text-gray-800">{t('add_course')}</h3><button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button></div>
                          <div className="flex flex-col gap-4 mb-6">
                              <div>
                                  <label className="text-xs font-bold text-gray-500 mb-1 block">{t('course_name')}</label>
                                  <input className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-black transition-colors" placeholder={t('course_name')} value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})}/>
                              </div>
                              <div className="flex gap-4">
                                  <div className="flex-1">
                                      <label className="text-xs font-bold text-gray-500 mb-1 block">{t('credit')}</label>
                                      <input className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-black text-center" placeholder="3" type="number" value={newCourse.credit} onChange={e => setNewCourse({...newCourse, credit: e.target.value})}/>
                                  </div>
                                  <div className="flex-1">
                                      <label className="text-xs font-bold text-gray-500 mb-1 block">{t('score')}</label>
                                      <input className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-black text-center" placeholder="85" type="number" value={newCourse.score} onChange={e => setNewCourse({...newCourse, score: e.target.value})}/>
                                  </div>
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-gray-500 mb-1 block">{t('grade_note_optional')}</label>
                                  <input className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-black" placeholder={t('grade_note_placeholder')} value={newCourse.note} onChange={e => setNewCourse({...newCourse, note: e.target.value})}/>
                              </div>
                          </div>
                          <button onClick={addNewCourse} className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">{t('confirm')}</button>
                      </div>
                  </div>
              )}

              {calcModal.isOpen && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
                      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl flex flex-col h-[500px]">
                          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                              <div>
                                  <h3 className="font-bold text-lg text-gray-800">{calcModal.courseName}</h3>
                                  <span className="text-xs text-gray-500">{t('score_calculator')}</span>
                              </div>
                              <button onClick={closeCalculator} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto mb-4 pr-1">
                              <div className="space-y-3">
                                  {currentCriteria.map((item, idx) => (
                                      <div key={item.id} className="flex gap-2 items-center">
                                          <input 
                                              className="flex-1 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500" 
                                              placeholder={t('item_placeholder')}
                                              value={item.name}
                                              onChange={(e) => updateCriteriaItem(item.id, 'name', e.target.value)}
                                          />
                                          <div className="relative w-20">
                                              <input 
                                                  className="w-full border border-gray-200 rounded-lg p-2 text-sm text-center outline-none focus:border-blue-500 pr-5" 
                                                  placeholder={t('weight_placeholder')}
                                                  type="number"
                                                  value={item.weight}
                                                  onChange={(e) => updateCriteriaItem(item.id, 'weight', e.target.value)}
                                              />
                                              <span className="absolute right-2 top-2 text-xs text-gray-400">%</span>
                                          </div>
                                          <input 
                                              className="w-20 border border-gray-200 rounded-lg p-2 text-sm text-center outline-none focus:border-blue-500 font-bold text-blue-600" 
                                              placeholder={t('score_placeholder')}
                                              type="number"
                                              value={item.score}
                                              onChange={(e) => updateCriteriaItem(item.id, 'score', e.target.value)}
                                          />
                                          <button onClick={() => removeCriteriaItem(item.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16}/></button>
                                      </div>
                                  ))}
                                  <button onClick={addCriteriaItem} className="w-full border border-dashed border-gray-300 py-2.5 rounded-lg text-xs text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-all">{t('add_criteria_item')}</button>
                              </div>
                          </div>

                          <div className="border-t border-gray-100 pt-4 mt-auto">
                              <div className="flex justify-between items-center mb-4">
                                  <div className="text-xs text-gray-500">
                                      {t('total_weight')}: <span className={currentTotalWeight !== 100 ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>{currentTotalWeight}%</span>
                                      {currentTotalWeight !== 100 && ` ${t('not_100')}`}
                                  </div>
                                  <div className="text-right">
                                      <span className="text-xs text-gray-500 block">{t('estimated_score')}</span>
                                      <span className="text-3xl font-black text-blue-600">{currentTotalScore}</span>
                                  </div>
                              </div>
                              <button onClick={saveCriteria} className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">{t('save_and_apply')}</button>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const GradesView = ({ grades, setGrades, courseCriteria, setCourseCriteria }) => {
    const [viewMode, setViewMode] = useState('all'); // all, subjects, calculator
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newGradeEntry, setNewGradeEntry] = useState({ date: getLocalDateString(new Date()), subject: '', score: '', note: '' });
    
    // --- 成績計算機 State ---
    const [isCalcOpen, setIsCalcOpen] = useState(false);
    const [localCriteria, setLocalCriteria] = useState([]);
    const [currentCalcSubject, setCurrentCalcSubject] = useState(null); // 用於計算機模式

    const uniqueSubjects = useMemo(() => [...new Set(grades.map(g => g.subject))], [grades]);
    const saveNewGrade = () => { if (!newGradeEntry.subject) return; setGrades([...grades, { id: Date.now(), ...newGradeEntry }]); setIsAdding(false); };

    // --- 計算機相關函式 ---
    const openCalculator = (subject) => {
        setCurrentCalcSubject(subject);
        setLocalCriteria(courseCriteria[subject] || []);
        setIsCalcOpen(true);
    };

    const addCriteriaItem = () => {
        setLocalCriteria([...localCriteria, { id: Date.now(), name: '', weight: '', score: '' }]);
    };

    const updateCriteriaItem = (id, field, value) => {
        setLocalCriteria(localCriteria.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const removeCriteriaItem = (id) => {
        setLocalCriteria(localCriteria.filter(c => c.id !== id));
    };

    const saveCalculator = () => {
        setCourseCriteria(prev => ({
            ...prev,
            [currentCalcSubject]: localCriteria
        }));
        setIsCalcOpen(false);
    };

    const currentTotalScore = useMemo(() => {
        let total = 0;
        localCriteria.forEach(c => {
            const w = parseFloat(c.weight) || 0;
            const s = parseFloat(c.score) || 0;
            total += s * (w / 100);
        });
        return total.toFixed(1);
    }, [localCriteria]);

    const currentTotalWeight = useMemo(() => {
        let total = 0;
        localCriteria.forEach(c => total += (parseFloat(c.weight) || 0));
        return total;
    }, [localCriteria]);

    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <div className="flex bg-gray-100 p-1 rounded-xl">
                {['all:all_records', 'subjects:subject_categories', 'calculator:score_calculator'].map(m => {
                    const [mode, label] = m.split(':');
                    return ( 
                        <button 
                            key={mode} 
                            onClick={() => { setViewMode(mode); setSelectedSubject(null); }} 
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === mode || (mode==='subjects' && viewMode==='subject-detail') ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {t(label)}
                        </button> 
                    )
                })}
            </div>
            {viewMode !== 'calculator' && (
                <button onClick={()=>setIsAdding(true)} className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 flex items-center gap-2 transition-colors"><Plus size={16} /> {t('add_grade')}</button>
            )}
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2">
            {viewMode === 'all' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {grades.sort((a,b) => new Date(b.date) - new Date(a.date)).map(grade => (
                        <div key={grade.id} className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 hover:border-blue-300 transition-colors group relative">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-gray-300 hover:text-red-500"><Trash2 size={16}/></button>
                            </div>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">{grade.subject}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{grade.date}</p>
                                </div>
                                <div className="text-3xl font-black text-blue-600">{grade.score}</div>
                            </div>
                            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">{grade.note || t('no_note')}</div>
                        </div>
                    ))}
                </div>
            )}
            {viewMode === 'subjects' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{uniqueSubjects.map(subject => (
                    <div key={subject} onClick={() => { setSelectedSubject(subject); setViewMode('subject-detail'); }} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><BookOpen size={24} /></div>
                        <h4 className="font-bold text-gray-800 text-lg mb-1">{subject}</h4>
                        <span className="text-xs font-bold text-gray-400">{t('records_count', {count: grades.filter(g=>g.subject===subject).length})}</span>
                    </div>
                ))}</div>
            )}
            
            {/* 新增的計算機視圖模式 */}
            {viewMode === 'calculator' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uniqueSubjects.map(subject => {
                        // 計算目前的預估成績以顯示在卡片上
                        const criteria = courseCriteria[subject] || [];
                        let previewScore = 0;
                        let hasCriteria = criteria.length > 0;
                        if (hasCriteria) {
                            criteria.forEach(c => {
                                const w = parseFloat(c.weight) || 0;
                                const s = parseFloat(c.score) || 0;
                                previewScore += s * (w / 100);
                            });
                        }

                        return (
                            <div key={subject} onClick={() => openCalculator(subject)} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><PieChart size={24} /></div>
                                    {hasCriteria && <span className="text-2xl font-black text-indigo-600">{previewScore.toFixed(0)}</span>}
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">{subject}</h4>
                                <span className="text-xs font-bold text-gray-400 flex items-center gap-1 group-hover:text-indigo-500 transition-colors">
                                    {t('click_to_calc')} <ChevronRight size={12}/>
                                </span>
                            </div>
                        );
                    })}
                    {uniqueSubjects.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-400 text-sm">
                            {t('no_tasks')} (請先新增成績紀錄)
                        </div>
                    )}
                </div>
            )}

            {viewMode === 'subject-detail' && selectedSubject && (
                <div className="space-y-4 max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setViewMode('subjects')} className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors"><ArrowLeft size={20} /></button>
                            <h2 className="text-2xl font-bold text-gray-800">{selectedSubject}</h2>
                        </div>
                    </div>

                    {grades.filter(g => g.subject === selectedSubject).map(grade => (
                        <div key={grade.id} className="bg-white border-l-4 border-blue-500 shadow-sm rounded-r-xl p-5 flex justify-between items-center">
                            <div><span className="text-xs text-gray-400 font-mono block mb-1">{grade.date}</span><span className="text-base font-bold text-gray-800">{grade.note}</span></div>
                            <span className="text-2xl font-black text-gray-800">{grade.score}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {isAdding && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6"><span className="font-bold text-lg text-gray-800">{t('add_grade')}</span><button onClick={()=>setIsAdding(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button></div>
                    <div className="space-y-4">
                        <input type="date" value={newGradeEntry.date} onChange={e=>setNewGradeEntry({...newGradeEntry, date: e.target.value})} className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:border-black outline-none"/>
                        <div className="flex gap-3">
                            <input placeholder={t('subject_placeholder')} value={newGradeEntry.subject} onChange={e=>setNewGradeEntry({...newGradeEntry, subject: e.target.value})} className="flex-1 border border-gray-300 p-3 rounded-xl text-sm focus:border-black outline-none"/>
                            <input placeholder={t('score_placeholder')} type="number" value={newGradeEntry.score} onChange={e=>setNewGradeEntry({...newGradeEntry, score: e.target.value})} className="w-24 border border-gray-300 p-3 rounded-xl text-sm focus:border-black outline-none text-center"/>
                        </div>
                        <input placeholder={t('grade_note_placeholder')} value={newGradeEntry.note} onChange={e=>setNewGradeEntry({...newGradeEntry, note: e.target.value})} className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:border-black outline-none"/>
                        <button onClick={saveNewGrade} className="w-full bg-black text-white py-3.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors mt-2">{t('confirm')}</button>
                    </div>
                </div>
            </div>
        )}

        {/* 成績計算機 Modal */}
        {isCalcOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl flex flex-col h-[500px]">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">{currentCalcSubject}</h3>
                            <span className="text-xs text-gray-500">{t('score_calculator')}</span>
                        </div>
                        <button onClick={() => setIsCalcOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto mb-4 pr-1">
                        <div className="space-y-3">
                            {localCriteria.map((item, idx) => (
                                <div key={item.id} className="flex gap-2 items-center">
                                    <input 
                                        className="flex-1 border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500" 
                                        placeholder={t('item_placeholder')}
                                        value={item.name}
                                        onChange={(e) => updateCriteriaItem(item.id, 'name', e.target.value)}
                                    />
                                    <div className="relative w-20">
                                        <input 
                                            className="w-full border border-gray-200 rounded-lg p-2 text-sm text-center outline-none focus:border-blue-500 pr-5" 
                                            placeholder={t('weight_placeholder')}
                                            type="number"
                                            value={item.weight}
                                            onChange={(e) => updateCriteriaItem(item.id, 'weight', e.target.value)}
                                        />
                                        <span className="absolute right-2 top-2 text-xs text-gray-400">%</span>
                                    </div>
                                    <input 
                                        className="w-20 border border-gray-200 rounded-lg p-2 text-sm text-center outline-none focus:border-blue-500 font-bold text-blue-600" 
                                        placeholder={t('score_placeholder')}
                                        type="number"
                                        value={item.score}
                                        onChange={(e) => updateCriteriaItem(item.id, 'score', e.target.value)}
                                    />
                                    <button onClick={() => removeCriteriaItem(item.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16}/></button>
                                </div>
                            ))}
                            <button onClick={addCriteriaItem} className="w-full border border-dashed border-gray-300 py-2.5 rounded-lg text-xs text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-all">{t('add_criteria_item')}</button>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-auto">
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-xs text-gray-500">
                                {t('total_weight')}: <span className={currentTotalWeight !== 100 ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>{currentTotalWeight}%</span>
                                {currentTotalWeight !== 100 && ` ${t('not_100')}`}
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-gray-500 block">{t('estimated_score')}</span>
                                <span className="text-3xl font-black text-blue-600">{currentTotalScore}</span>
                            </div>
                        </div>
                        <button onClick={saveCalculator} className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                            <Save size={16}/> {t('save_criteria')}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  };

  // --- Missing Components Restoration: DashboardView & PlannerView ---

  const DashboardView = ({ tasks, currentDate, setCurrentDate }) => (
      <div className="h-full flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-80 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-fit">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Calendar size={20} className="text-red-500"/> {currentDate.getMonth()+1}月</h2>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
                {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(d => <div key={d}>{t(d)}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1 text-sm">
                  {Array.from({length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() === 0 ? 6 : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() - 1}).map((_, i) => (<div key={`empty-${i}`} className="aspect-square"></div>))}
                  {Array.from({length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()}).map((_, i) => {
                      const day = i + 1;
                      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                      const isSelected = day === currentDate.getDate();
                      const dayTasks = tasks.filter(t => new Date(t.date).toDateString() === dateObj.toDateString());
                      return (
                          <div key={i} onClick={() => setCurrentDate(dateObj)} className={`aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer relative transition-all ${isSelected ? 'bg-black text-white shadow-md' : 'bg-white hover:bg-gray-50 text-gray-700'}`}>
                              <span className="text-xs font-bold z-10">{day}</span>
                              <div className="flex gap-0.5 mt-1 h-1">{dayTasks.slice(0, 3).map((t, idx) => (<div key={idx} className={`w-1 h-1 rounded-full ${CATEGORIES[t.category.toUpperCase()]?.color || 'bg-gray-400'}`}></div>))}</div>
                          </div>
                      );
                  })}
              </div>
          </div>
          
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">{currentDate.getMonth()+1}/{currentDate.getDate()} 行程概覽</h3>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {tasks.filter(t => new Date(t.date).toDateString() === currentDate.toDateString()).length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300 text-sm italic">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3"><Sparkles size={24} className="opacity-20"/></div>
                        {t('no_tasks_today')}
                    </div>
                ) : (
                    tasks.filter(t => new Date(t.date).toDateString() === currentDate.toDateString()).map(task => (
                        <div key={task.id} className={`flex items-center p-4 bg-white rounded-xl shadow-sm border-l-4 ${CATEGORIES[task.category.toUpperCase()].border} border-t border-r border-b border-gray-100 hover:shadow-md transition-shadow`}>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold ${CATEGORIES[task.category.toUpperCase()].color}`}>{t('categories.' + task.category)}</span>
                                    <span className="font-bold text-gray-800">{task.subject}</span>
                                </div>
                                <p className="text-sm text-gray-500 pl-1">{task.note}</p>
                            </div>
                            {task.completed ? <div className="bg-green-50 text-green-600 p-1.5 rounded-full"><Check size={20} /></div> : <div className="w-5 h-5 rounded-full border-2 border-gray-200"></div>}
                        </div>
                    ))
                )}
              </div>
          </div>
      </div>
  );

  const PlannerView = ({ tasks, setTasks, weekDays }) => {
    const [newItem, setNewItem] = useState({ category: 'homework', subject: '', note: '' });
    
    const toggleTask = (id) => { setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)); };
    
    const handleAdd = (dateStr) => { 
        if (!newItem.subject) return; 
        setTasks([...tasks, { id: Date.now(), date: dateStr, ...newItem, completed: false }]); 
        setNewItem({ ...newItem, subject: '', note: '' }); 
    };

    const handleDelete = (taskId, taskSubject) => {
        if (window.confirm(t('confirm_delete_task', {subject: taskSubject}))) {
            setTasks(tasks.filter(t => t.id !== taskId));
        }
    };

    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 h-full overflow-y-auto xl:overflow-hidden">
            {weekDays.map((day, index) => {
            const dateStr = getLocalDateString(day);
            const dayTasks = tasks.filter(t => t.date === dateStr);
            const isToday = new Date().toDateString() === day.toDateString();
            const weekDayKey = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][index];
            
            return (
                <div key={dateStr} className={`flex flex-col rounded-xl border ${isToday ? 'border-blue-500 shadow-md ring-2 ring-blue-50' : 'border-gray-200 shadow-sm'} bg-white overflow-hidden h-fit xl:h-full transition-all`}>
                    <div className={`px-3 py-2 border-b ${isToday ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-700'} text-xs font-bold flex justify-between items-center`}>
                        <span>{t(weekDayKey)}</span>
                        <span className={isToday ? 'text-blue-100' : 'text-gray-400'}>{day.getMonth()+1}/{day.getDate()}</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-2 space-y-1.5 bg-gray-50/30 min-h-[100px] xl:min-h-0 custom-scrollbar">
                        {dayTasks.length === 0 && <div className="text-[10px] text-gray-300 text-center py-4 italic">{t('no_tasks')}</div>}
                        {dayTasks.map(task => (
                            <div key={task.id} className={`group relative bg-white p-2 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all ${task.completed ? 'opacity-60 grayscale' : ''}`}>
                                <div className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full ${CATEGORIES[task.category.toUpperCase()].color}`}></div>
                                <div className="flex items-start gap-2 pl-1.5">
                                    <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} className="mt-0.5 w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"/>
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-bold text-xs truncate ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.subject}</div>
                                        <div className="text-[10px] text-gray-500 truncate">{task.note}</div>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(task.id, task.subject)} className="absolute top-1 right-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                            </div>
                        ))}
                    </div>

                    <div className="p-2 bg-white border-t border-gray-100">
                        <div className="flex flex-col gap-1.5">
                            <div className="flex gap-1.5">
                                <select className="text-[10px] border border-gray-200 rounded p-1 bg-gray-50 outline-none flex-1 truncate" value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})}>{Object.values(CATEGORIES).map(c => <option key={c.id} value={c.id}>{t('categories.' + c.key)}</option>)}</select>
                                <input placeholder={t('subject_placeholder')} className="text-[10px] border border-gray-200 p-1 rounded w-16 outline-none focus:border-blue-500" onChange={e=>setNewItem({...newItem, subject: e.target.value})} value={newItem.subject} />
                            </div>
                            <div className="flex gap-1.5">
                                <input placeholder={t('note_placeholder')} className="text-[10px] border border-gray-200 p-1 rounded flex-1 outline-none focus:border-blue-500" onChange={e=>setNewItem({...newItem, note: e.target.value})} value={newItem.note} />
                                <button onClick={()=>handleAdd(dateStr)} className="p-1 bg-black text-white rounded hover:bg-gray-800 transition-colors flex items-center justify-center w-6"><Plus size={12}/></button>
                            </div>
                        </div>
                    </div>
                </div>
            );
            })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-6xl mx-auto h-full flex flex-col">
             {!isDataLoaded ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 animate-pulse flex-col gap-2">
                   <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                   <span className="text-sm font-bold">{t('loading')}</span>
                </div>
             ) : (
                <>
                  {activeTab === 'dashboard' && <DashboardView tasks={tasks} currentDate={currentDate} setCurrentDate={setCurrentDate} />}
                  {activeTab === 'planner' && <PlannerView tasks={tasks} setTasks={setTasks} weekDays={weekDays} />}
                  {activeTab === 'grades' && <GradesView grades={grades} setGrades={setGrades} courseCriteria={courseCriteria} setCourseCriteria={setCourseCriteria} />}
                  {activeTab === 'gpa' && <GpaView gpaCourses={gpaCourses} setGpaCourses={setGpaCourses} courseCriteria={courseCriteria} setCourseCriteria={setCourseCriteria} />}
                  {activeTab === 'timetable' && <TimetableView timetable={timetable} setTimetable={setTimetable} periodTimes={periodTimes} setPeriodTimes={setPeriodTimes} />}
                  {activeTab === 'pomodoro' && <PomodoroView studyLogs={studyLogs} setStudyLogs={setStudyLogs} currentDate={currentDate} pomodoroSubjects={pomodoroSubjects} setPomodoroSubjects={setPomodoroSubjects} />}
                  {activeTab === 'ai' && <AIChatView tasks={tasks} grades={grades} timetable={timetable} currentDate={currentDate} gpaCourses={gpaCourses} periodTimes={periodTimes} />}
                  {activeTab === 'links' && <LinksView links={links} setLinks={setLinks} />}
                </>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}