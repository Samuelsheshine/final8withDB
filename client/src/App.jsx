import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Check, Edit2, RotateCw, X, BookOpen, ArrowLeft, Sparkles, Clock, Calendar, Calculator, Trash2, Send, Link as LinkIcon, ExternalLink, BarChart2, Cloud, Settings, PieChart, Globe, Save, AlertCircle, History, Archive, Moon, Sun, Upload, Download, Key, Bot, Menu } from 'lucide-react';

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
    saved: '已儲存 (本機)',
    save_error: '儲存失敗',
    idle: '準備就緒',
    week: '週',
    mon: '週一', tue: '週二', wed: '週三', thu: '週四', fri: '週五', sat: '週六', sun: '週日',
    week_prefix: '第', week_suffix: '週',
    semester_week: '學期第',
    pre_semester: '開學前',
    semester_ended: '學期已結束',
    archived_msg: '已自動歸檔上學期成績',
    
    // 設定
    settings: '設定',
    semester_settings: '學期設定',
    language_settings: '語言 / Language',
    theme_settings: '外觀 / Theme',
    theme_light: '淺色模式',
    theme_dark: '深色模式',
    semester_start: '學期開始日 (第一週週一)',
    semester_total_weeks: '學期總週數',
    custom: '自訂',
    save_settings: '儲存設定',
    export_data: '匯出備份 (JSON)',
    import_data: '匯入備份',
    data_management: '資料管理',
    confirm_import: '匯入將會覆蓋現有資料，確定要繼續嗎？',

    // 側邊欄 & 功能標題
    timetable: '課表',
    planner: '聯絡簿',
    grades: '成績紀錄',
    gpa: '課程 & GPA',
    dashboard: '行事曆',
    ai_assistant: 'AI 助理',
    pomodoro: '番茄鐘',
    links: '常用連結',
    user_name: 'User',
    user_role: 'Local Account',

    // 聯絡簿
    no_tasks: '無待辦',
    no_tasks_today: '今日無行程',
    completed: '完成',
    confirm_delete_task: '確定要刪除「{subject}」嗎？',
    subject_placeholder: '科目...',
    note_placeholder: '備註...',
    import_ics: '匯入 .ics',
    ics_format_hint: '支援標準 iCalendar (.ics) 格式 (自動歸類為其他)',
    import_success: '成功匯入 {count} 筆事項',
    import_error: '匯入失敗，請檢查檔案格式 (.ics)',
    
    // Categories
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
    clear_timetable: '清空課表',
    confirm_clear_timetable: '確定要清空所有課表嗎？此動作無法復原。',

    // 成績 & GPA
    all_records: '本週紀錄',
    subject_categories: '科目分類',
    gpa_history: 'GPA 紀錄',
    add_grade: '新增紀錄',
    add_course: '新增課程',
    course_name: '科目名稱',
    credit: '學分',
    score: '學期成績',
    gpa_score: 'GPA',
    action: '評分項目',
    grade_note_placeholder: '備註 (例如：期中考)',
    grade_note_optional: '備註 (選填)',
    total_courses: '總課程數',
    current_gpa: '目前 GPA (4.3)',
    records_count: '{count} 筆細項',
    no_note: '無備註',
    calc_semester_score: '管理評分細項',
    select_semester: '選擇學期',
    no_archived_data: '尚無歷史紀錄',
    
    // 成績計算機
    score_calculator: '評分細項管理',
    item_placeholder: '項目 (如: 期中考)',
    weight_placeholder: '30',
    score_placeholder: '得分',
    date_placeholder: '日期',
    add_criteria_item: '+ 新增評分項目',
    total_weight: '總權重',
    not_100: '(未滿100%)',
    estimated_score: '計算後總成績',
    save_and_apply: '儲存並更新課程成績',
    save_criteria: '儲存評分標準',
    click_to_calc: '點擊管理細項',
    no_criteria_records: '本週無成績紀錄',

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
    ai_welcome: '嗨！我是 StudyHub 助理。請先設定 API Key，並選擇適合的模型 (若遇到錯誤，請嘗試切換模型)。',
    ai_thinking: '思考中...',
    ai_input_placeholder: '詢問關於您的課表、成績...',
    ai_preset_today_class: '今天有什麼課？',
    ai_preset_exam: '什麼時候有考試？',
    ai_preset_report: '什麼時候有報告？',
    ai_preset_homework: '什麼時候有作業？',
    ai_preset_score: '我的成績如何？',
    ai_key_placeholder: '輸入 Google AI Studio API Key',
    ai_key_save: '儲存 Key',
    ai_key_missing: '請先輸入 API Key 才能使用 AI 功能',
    ai_error: 'API 錯誤',
    ai_model_select: '模型:',
    
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
    saved: 'Saved (Local)',
    save_error: 'Error',
    idle: 'Ready',
    week: 'Week',
    mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
    week_prefix: 'Week ', week_suffix: '',
    semester_week: 'Sem. Week ',
    pre_semester: 'Pre-semester',
    semester_ended: 'Semester Ended',
    archived_msg: 'Archived previous semester',
    
    settings: 'Settings',
    semester_settings: 'Semester Settings',
    language_settings: 'Language',
    theme_settings: 'Appearance',
    theme_light: 'Light Mode',
    theme_dark: 'Dark Mode',
    semester_start: 'Semester Start Date (First Monday)',
    semester_total_weeks: 'Total Weeks',
    custom: 'Custom',
    save_settings: 'Save Settings',
    export_data: 'Export Backup (JSON)',
    import_data: 'Import Backup',
    data_management: 'Data Management',
    confirm_import: 'Importing will overwrite existing data. Continue?',

    timetable: 'Timetable',
    planner: 'Planner',
    grades: 'Grades',
    gpa: 'Courses & GPA',
    dashboard: 'Dashboard',
    ai_assistant: 'AI Assistant',
    pomodoro: 'Pomodoro',
    links: 'Links',
    user_name: 'User',
    user_role: 'Local Account',

    no_tasks: 'No Tasks',
    no_tasks_today: 'No schedule today',
    completed: 'Done',
    confirm_delete_task: 'Delete "{subject}"?',
    subject_placeholder: 'Subject...',
    note_placeholder: 'Note...',
    import_ics: 'Import .ics',
    ics_format_hint: 'Standard iCalendar (.ics) format (Categorized as Other)',
    import_success: 'Successfully imported {count} items',
    import_error: 'Import failed. Check file format (.ics)',
    
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
    clear_timetable: 'Clear All',
    confirm_clear_timetable: 'Are you sure you want to clear the entire timetable? This cannot be undone.',

    all_records: 'Weekly Log',
    subject_categories: 'By Subject',
    gpa_history: 'GPA Records',
    add_grade: 'Add Grade',
    add_course: 'Add Course',
    course_name: 'Course Name',
    credit: 'Credit',
    score: 'Sem. Score',
    gpa_score: 'GPA',
    action: 'Items',
    grade_note_placeholder: 'Note (e.g., Midterm)',
    grade_note_optional: 'Note (Optional)',
    total_courses: 'Total Courses',
    current_gpa: 'Current GPA (4.3)',
    records_count: '{count} items',
    no_note: 'No note',
    calc_semester_score: 'Manage Items',
    select_semester: 'Select Semester',
    no_archived_data: 'No history',

    score_calculator: 'Grading Items',
    item_placeholder: 'Item (e.g., Midterm)',
    weight_placeholder: '30',
    score_placeholder: 'Score',
    date_placeholder: 'Date',
    add_criteria_item: '+ Add Item',
    total_weight: 'Total Weight',
    not_100: '(< 100%)',
    estimated_score: 'Calc. Score',
    save_and_apply: 'Save & Update',
    save_criteria: 'Save Criteria',
    click_to_calc: 'Manage Items',
    no_criteria_records: 'No records this week',

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

    ai_welcome: 'Hi! I am StudyHub Assistant. Please set your API Key first. If you encounter errors, try switching models.',
    ai_thinking: 'Thinking...',
    ai_input_placeholder: 'Ask about schedule, grades...',
    ai_preset_today_class: 'Classes today?',
    ai_preset_exam: 'When is the exam?',
    ai_preset_report: 'When is the report due?',
    ai_preset_homework: 'Any homework?',
    ai_preset_score: 'How are my grades?',
    ai_key_placeholder: 'Enter Google AI Studio API Key',
    ai_key_save: 'Save Key',
    ai_key_missing: 'Please enter API Key to use AI features',
    ai_error: 'API Error',
    ai_model_select: 'Model:',
    
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
    saved: '保存完了 (ローカル)',
    save_error: '保存失敗',
    idle: '準備完了',
    week: '週',
    mon: '月', tue: '火', wed: '水', thu: '木', fri: '金', sat: '土', sun: '日',
    week_prefix: '第', week_suffix: '週',
    semester_week: '学期第',
    pre_semester: '学期前',
    semester_ended: '学期終了',
    archived_msg: '前学期の成績を保存しました',
    
    settings: '設定',
    semester_settings: '学期設定',
    language_settings: '言語 / Language',
    theme_settings: '外観 / Theme',
    theme_light: 'ライト',
    theme_dark: 'ダーク',
    semester_start: '学期開始日 (最初の月曜日)',
    semester_total_weeks: '総週数',
    custom: 'カスタム',
    save_settings: '設定を保存',
    export_data: 'バックアップをエクスポート',
    import_data: 'バックアップをインポート',
    data_management: 'データ管理',
    confirm_import: '既存のデータが上書きされます。よろしいですか？',

    timetable: '時間割',
    planner: '連絡帳',
    grades: '成績記録',
    gpa: '履修 & GPA',
    dashboard: 'カレンダー',
    ai_assistant: 'AI アシスタント',
    pomodoro: 'ポモドーロ',
    links: 'リンク集',
    user_name: 'User',
    user_role: 'Local Account',

    no_tasks: 'なし',
    no_tasks_today: '今日の予定はありません',
    completed: '完了',
    confirm_delete_task: '「{subject}」を削除しますか？',
    subject_placeholder: '科目...',
    note_placeholder: 'メモ...',
    import_ics: '.icsインポート',
    ics_format_hint: '標準iCalendar(.ics)形式 (その他に分類されます)',
    import_success: '{count} 件をインポートしました',
    import_error: 'インポート失敗。形式を確認してください (.ics)',
    
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
    clear_timetable: '時間割をクリア',
    confirm_clear_timetable: 'すべての時間割を削除しますか？この操作は取り消せません。',

    all_records: '今週の記録',
    subject_categories: '科目別',
    gpa_history: 'GPA 履歴',
    add_grade: '記録追加',
    add_course: '科目追加',
    course_name: '科目名',
    credit: '単位',
    score: '學期成績',
    gpa_score: 'GPA',
    action: '詳細項目',
    grade_note_placeholder: 'メモ (例: 中間テスト)',
    grade_note_optional: 'メモ (任意)',
    total_courses: '科目数',
    current_gpa: '現在 GPA (4.3)',
    records_count: '{count} 項目',
    no_note: 'メモなし',
    calc_semester_score: '項目管理',
    select_semester: '学期を選択',
    no_archived_data: '履歴なし',

    score_calculator: '評価項目管理',
    item_placeholder: '項目 (例: 中間)',
    weight_placeholder: '30',
    score_placeholder: '点数',
    date_placeholder: '日付',
    add_criteria_item: '+ 項目を追加',
    total_weight: '総比重',
    not_100: '(100%未満)',
    estimated_score: '計算成績',
    save_and_apply: '保存して更新',
    save_criteria: '基準を保存',
    click_to_calc: '詳細を管理',
    no_criteria_records: '今週の成績記録はありません',

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

    ai_welcome: 'こんにちは！StudyHub アシスタントです。まずAPIキーを設定してください。エラーが発生した場合は、モデルを切り替えてみてください。',
    ai_thinking: '考え中...',
    ai_input_placeholder: '時間割や成績について聞く...',
    ai_preset_today_class: '今日の授業は？',
    ai_preset_exam: '試験はいつ？',
    ai_preset_report: 'レポートの締切は？',
    ai_preset_homework: '宿題はある？',
    ai_preset_score: '成績はどう？',
    ai_key_placeholder: 'Google AI Studio API Keyを入力',
    ai_key_save: 'キーを保存',
    ai_key_missing: 'AI機能を使用するにはAPIキーを入力してください',
    ai_error: 'API エラー',
    ai_model_select: 'モデル:',
    
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
// 為深色模式新增 dark:text-xxx 類別
const CATEGORIES = {
  EXAM: { id: 'exam', key: 'exam', color: 'bg-red-500', border: 'border-l-4 border-red-500', text: 'text-red-700 dark:text-red-400' },
  REPORT: { id: 'report', key: 'report', color: 'bg-green-500', border: 'border-l-4 border-green-500', text: 'text-green-700 dark:text-green-400' },
  HOMEWORK: { id: 'homework', key: 'homework', color: 'bg-purple-500', border: 'border-l-4 border-purple-500', text: 'text-purple-700 dark:text-purple-400' },
  CANCEL: { id: 'cancel', key: 'cancel', color: 'bg-yellow-400', border: 'border-l-4 border-yellow-400', text: 'text-yellow-700 dark:text-yellow-400' },
  OTHER: { id: 'other', key: 'other', color: 'bg-blue-400', border: 'border-l-4 border-blue-400', text: 'text-blue-700 dark:text-blue-400' }
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

// 輔助函式：依據民國年與月份計算學期名稱
const getSemesterName = (date) => {
    const year = date.getFullYear();
    const rocYear = year - 1911;
    const month = date.getMonth(); // 0-11

    // 8 (Sept) to 0 (Jan) -> Fall Semester of (ROC-1)
    if (month >= 8) { // 9月-12月
        return `${rocYear - 1} 上學期`; 
    } else if (month === 0) { // 1月
        return `${rocYear - 2} 上學期`; // 跨年了，所以減2才對回到該學年
    } else if (month >= 1 && month <= 6) { // 2月-7月
        return `${rocYear - 2} 下學期`;
    } else { // 8月 (暑假/開學前)
        return `${rocYear - 1} 上學期`; // 視為新學期開始
    }
};

// 定義導航項目，供 Sidebar 和 MobileNav 使用
const NAV_ITEMS = [
    { id: 'timetable', labelKey: 'timetable', icon: RotateCw },
    { id: 'planner', labelKey: 'planner', icon: BookOpen },
    { id: 'gpa', labelKey: 'gpa', icon: Calculator },
    { id: 'grades', labelKey: 'grades', icon: Edit2 },
    { id: 'dashboard', labelKey: 'dashboard', icon: Calendar },
    { id: 'ai', labelKey: 'ai_assistant', icon: Sparkles, special: true },
    { id: 'pomodoro', labelKey: 'pomodoro', icon: Clock },
    { id: 'links', labelKey: 'links', icon: LinkIcon },
];

export default function StudyHubApp() {
  const [activeTab, setActiveTab] = useState('timetable'); 
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [language, setLanguage] = useState('zh-TW'); 
  const [apiKey, setApiKey] = useState(() => {
      try {
          return localStorage.getItem('google_ai_key') || '';
      } catch (e) {
          return '';
      }
  });
  
  // 初始化主題 (安全地讀取 localStorage)
  const [theme, setTheme] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem('theme') || 'light';
      }
    } catch (e) {
      console.warn("LocalStorage not available for theme, defaulting to light.");
    }
    return 'light';
  });

  // 處理主題切換
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
    
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // 忽略錯誤 (例如無痕模式)
    }
  }, [theme]);

  // 儲存 API Key
  const handleSaveApiKey = (key) => {
      setApiKey(key);
      localStorage.setItem('google_ai_key', key);
  };

  const t = (key, params = {}) => {
    let text = TRANSLATIONS[language][key] || key;
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    return text;
  };

  // 學期設定
  const [semesterStart, setSemesterStart] = useState(new Date(new Date().getFullYear(), 8, 1)); 
  const [semesterWeeks, setSemesterWeeks] = useState(18); 
  
  // --- 資料庫同步狀態 ---
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); 
  const saveTimeoutRef = useRef(null);

  // --- 資料狀態 ---
  const [tasks, setTasks] = useState([
    { id: 1, date: getLocalDateString(new Date()), category: 'exam', subject: 'Calculus Example', note: 'Ch1-3', completed: false },
  ]);

  const [grades, setGrades] = useState([]); 

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
  
  // 新增：歷史學期存檔
  const [archivedSemesters, setArchivedSemesters] = useState([]);

  // --- 純前端 LocalStorage 邏輯 (無後端) ---

  useEffect(() => {
    // 讀取 LocalStorage
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
            if (data.language) setLanguage(data.language); 
            if (data.archivedSemesters) setArchivedSemesters(data.archivedSemesters);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data from localStorage:", error);
      } finally {
        setIsDataLoaded(true);
      }
    };
    fetchData();
  }, []);

  // --- 初始化範例資料邏輯 ---
  useEffect(() => {
    if (!isDataLoaded) return;

    // 檢查是否已有 112-2 下學期的範例資料，若無則加入
    const exampleSemesterName = "112 下學期";
    const hasExample = archivedSemesters.some(s => s.name === exampleSemesterName);

    if (!hasExample) {
        const exampleArchive = {
            id: Date.now() + 999, // 避免 ID 衝突
            name: exampleSemesterName,
            courses: [
                { id: 2001, name: "微積分(二)", credit: "3", score: "88" },
                { id: 2002, name: "普通物理", credit: "3", score: "92" },
                { id: 2003, name: "程式設計", credit: "3", score: "95" },
                { id: 2004, name: "體育", credit: "0", score: "85" }, // 0 學分不計入 GPA
                { id: 2005, name: "國文", credit: "2", score: "82" }
            ],
            // 預設空的評分標準，但允許使用者點擊編輯後新增
            criteria: {},
            archivedDate: new Date().toISOString()
        };
        setArchivedSemesters(prev => [...prev, exampleArchive]);
    }
  }, [isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    setSaveStatus('saving');

    saveTimeoutRef.current = setTimeout(async () => {
      const payload = {
          tasks, grades, timetable, periodTimes, gpaCourses, links, studyLogs, pomodoroSubjects,
          currentDate: currentDate.toISOString(),
          semesterStart: semesterStart.toISOString(),
          semesterWeeks,
          courseCriteria,
          language,
          archivedSemesters
      };

      // 僅儲存到 LocalStorage
      try {
        localStorage.setItem('studyhub_data', JSON.stringify(payload));
        await new Promise(r => setTimeout(r, 300));
        setSaveStatus('saved'); 
      } catch (e) {
        console.error("Save error:", e);
        setSaveStatus('error');
      }
    }, 1500); // 增加延遲避免頻繁請求

    return () => clearTimeout(saveTimeoutRef.current);
  }, [tasks, grades, timetable, periodTimes, gpaCourses, links, studyLogs, pomodoroSubjects, currentDate, semesterStart, semesterWeeks, courseCriteria, language, archivedSemesters, isDataLoaded]);


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

  // --- 自動歸檔邏輯 ---
  useEffect(() => {
      if (!isDataLoaded) return;

      // 檢查是否超過學期週數
      if (currentWeekNum > semesterWeeks && gpaCourses.length > 0) {
          const semesterName = getSemesterName(semesterStart);
          
          // 檢查是否已經歸檔過該學期名稱
          const isArchived = archivedSemesters.some(s => s.name === semesterName);
          
          if (!isArchived) {
              // 執行歸檔
              const newArchive = {
                  id: Date.now(),
                  name: semesterName,
                  courses: gpaCourses,
                  criteria: courseCriteria,
                  archivedDate: new Date().toISOString()
              };
              
              setArchivedSemesters(prev => [...prev, newArchive]);
              setGpaCourses([]); // 清空當前
              setCourseCriteria({}); // 清空細項
              
              alert(`${t('semester_ended')}: ${semesterName}\n${t('archived_msg')}`);
          }
      }
  }, [currentWeekNum, semesterWeeks, gpaCourses, courseCriteria, archivedSemesters, semesterStart, isDataLoaded]);


  // --- 新版網頁介面元件 ---

  const Sidebar = () => (
    <aside className="hidden md:flex w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 flex-col transition-all duration-300 z-20">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-xl font-black text-gray-800 dark:text-gray-100 flex items-center gap-2 tracking-tight">
          <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center">
            <span className="font-serif italic">S</span>
          </div>
          StudyHub
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
              ${activeTab === item.id 
                ? (item.special ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'bg-black dark:bg-gray-100 text-white dark:text-gray-900 shadow-md shadow-gray-200 dark:shadow-none') 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}
            `}
          >
            <item.icon size={18} />
            <span>{t(item.labelKey)}</span>
            {item.special && <span className="ml-auto text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white">BETA</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex items-center gap-3 border border-gray-100 dark:border-gray-700">
           <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
             U
           </div>
           <div>
             <div className="text-xs font-bold text-gray-900 dark:text-gray-100">{t('user_name')}</div>
             <div className="text-[10px] text-gray-500 dark:text-gray-400">{t('user_role')}</div>
           </div>
        </div>
      </div>
    </aside>
  );

  const MobileNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-between px-2 py-2 z-50 safe-area-pb overflow-x-auto no-scrollbar">
        {NAV_ITEMS.map(item => (
            <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center min-w-[64px] p-2 rounded-xl transition-all ${activeTab === item.id ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}
            >
                <item.icon size={20} className={activeTab === item.id && item.special ? 'text-indigo-600 dark:text-indigo-400' : ''} />
                <span className={`text-[10px] mt-1 font-bold truncate max-w-[60px] ${activeTab === item.id ? 'opacity-100' : 'opacity-70'}`}>
                    {t(item.labelKey)}
                </span>
            </button>
        ))}
    </div>
  );

  const TopBar = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [tempStart, setTempStart] = useState(getLocalDateString(semesterStart));
    const [tempWeeks, setTempWeeks] = useState(semesterWeeks);
    const fileImportRef = useRef(null);

    const handleSaveSettings = () => {
        setSemesterStart(new Date(tempStart));
        setSemesterWeeks(parseInt(tempWeeks));
        setIsSettingsOpen(false);
    };

    // 匯出功能
    const exportData = () => {
        const payload = {
            tasks, grades, timetable, periodTimes, gpaCourses, links, studyLogs, pomodoroSubjects,
            currentDate: currentDate.toISOString(),
            semesterStart: semesterStart.toISOString(),
            semesterWeeks,
            courseCriteria,
            language,
            archivedSemesters
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "studyhub_backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    // 匯入功能
    const importData = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!window.confirm(t('confirm_import'))) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data) {
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
                    if (data.language) setLanguage(data.language); 
                    if (data.archivedSemesters) setArchivedSemesters(data.archivedSemesters);
                    
                    // 立即儲存
                    localStorage.setItem('studyhub_data', JSON.stringify(data));
                    alert('匯入成功！');
                    window.location.reload(); // 重新整理以確保狀態一致
                }
            } catch (err) {
                console.error(err);
                alert('匯入失敗：檔案格式錯誤');
            }
        };
        reader.readAsText(file);
    };

    const todayDateString = new Intl.DateTimeFormat(language === 'en' ? 'en-US' : (language === 'ja' ? 'ja-JP' : 'zh-TW'), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    }).format(new Date());

    return (
        <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-10 sticky top-0 transition-colors">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                <button onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() - 7);
                setCurrentDate(newDate);
                }} className="p-1.5 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-md text-gray-500 dark:text-gray-400 transition-all">
                <ChevronLeft size={16} />
                </button>
                
                {/* 日期選擇器區域 */}
                <div className="flex flex-col items-center px-3 min-w-[120px] relative group cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded transition-colors" title="點擊選擇日期">
                    <input 
                        type="date" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        value={getLocalDateString(currentDate)}
                        onChange={(e) => {
                            if (e.target.value) {
                                const parts = e.target.value.split('-');
                                const newDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                                setCurrentDate(newDate);
                            }
                        }}
                        onClick={(e) => {
                            try {
                                if (typeof e.target.showPicker === 'function') {
                                    e.target.showPicker();
                                }
                            } catch (error) {
                                console.log('Browser does not support showPicker', error);
                            }
                        }}
                    />
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {weekDays[0].getMonth()+1}/{weekDays[0].getDate()} - {weekDays[6].getMonth()+1}/{weekDays[6].getDate()}
                    </span>
                    
                    {currentWeekNum <= 0 && (
                        <span className="text-[10px] font-bold px-2 rounded-full mt-0.5 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                            {t('pre_semester')}
                        </span>
                    )}
                    {currentWeekNum > 0 && currentWeekNum <= semesterWeeks ? (
                        <span className="text-[10px] font-bold px-2 rounded-full mt-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            {t('semester_week')} {currentWeekNum} {t('week_suffix')}
                        </span>
                    ) : currentWeekNum > semesterWeeks && (
                        <span className="text-[10px] font-bold px-2 rounded-full mt-0.5 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400">
                            {t('semester_ended')}
                        </span>
                    )}
                </div>

                <button onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() + 7);
                setCurrentDate(newDate);
                }} className="p-1.5 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-md text-gray-500 dark:text-gray-400 transition-all">
                <ChevronRight size={16} />
                </button>
            </div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 font-bold text-gray-700 dark:text-gray-200 text-sm hidden lg:block">
            <button 
                onClick={() => setCurrentDate(new Date())}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1.5 rounded-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                title="點擊回到今天"
            >
                {todayDateString}
            </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
            {/* 主題切換按鈕 */}
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-gray-400 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
                title={theme === 'dark' ? t('theme_light') : t('theme_dark')}
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button 
                onClick={() => {
                    setTempStart(getLocalDateString(semesterStart));
                    setTempWeeks(semesterWeeks);
                    setIsSettingsOpen(true);
                }}
                className="p-2 text-gray-400 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
                title={t('settings')}
            >
                <Settings size={20} />
            </button>

            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border
                ${saveStatus === 'saving' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800' : 
                saveStatus === 'saved' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800' : 
                saveStatus === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-gray-700'}`}>
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
            <div className="fixed inset-0 bg-black/20 dark:bg-black/50 z-50 flex items-start justify-end p-4 animate-in fade-in">
                <div className="bg-white dark:bg-gray-900 w-80 rounded-2xl p-5 shadow-2xl mt-16 border border-gray-200 dark:border-gray-800 mr-2">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2"><Settings size={16}/> {t('settings')}</h3>
                        <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"><X size={18}/></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 block flex items-center gap-1"><Globe size={12}/> {t('language_settings')}</label>
                            <div className="flex gap-2">
                                {[{code: 'zh-TW', label: '繁體中文'}, {code: 'en', label: 'English'}, {code: 'ja', label: '日本語'}].map(lang => (
                                    <button 
                                        key={lang.code}
                                        onClick={() => setLanguage(lang.code)}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${language === lang.code ? 'bg-black dark:bg-gray-100 text-white dark:text-gray-900 border-black dark:border-gray-100' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'}`}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 block flex items-center gap-1">
                                {theme === 'dark' ? <Moon size={12}/> : <Sun size={12}/>} {t('theme_settings')}
                            </label>
                            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                                <button 
                                    onClick={() => setTheme('light')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${theme === 'light' ? 'bg-white text-black shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
                                >
                                    <Sun size={14}/> {t('theme_light')}
                                </button>
                                <button 
                                    onClick={() => setTheme('dark')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${theme === 'dark' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
                                >
                                    <Moon size={14}/> {t('theme_dark')}
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 block">{t('data_management')}</label>
                            <div className="flex gap-2">
                                <button onClick={exportData} className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
                                    <Download size={14}/> {t('export_data')}
                                </button>
                                <button onClick={() => fileImportRef.current.click()} className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
                                    <Upload size={14}/> {t('import_data')}
                                </button>
                                <input type="file" ref={fileImportRef} accept=".json" className="hidden" onChange={importData} />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 block">{t('semester_start')}</label>
                            <input 
                                type="date" 
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-2.5 text-sm outline-none focus:border-black dark:focus:border-gray-500 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                value={tempStart}
                                onChange={(e) => setTempStart(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 block">{t('semester_total_weeks')}</label>
                            <div className="flex gap-2">
                                {[16, 18].map(w => (
                                    <button 
                                        key={w}
                                        onClick={() => setTempWeeks(w)}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${parseInt(tempWeeks) === w ? 'bg-black dark:bg-gray-100 text-white dark:text-gray-900 border-black dark:border-gray-100' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'}`}
                                    >
                                        {w}{t('week')}
                                    </button>
                                ))}
                                <input 
                                    type="number" 
                                    className="w-16 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-sm text-center outline-none focus:border-black dark:focus:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                    value={tempWeeks}
                                    onChange={(e) => setTempWeeks(e.target.value)}
                                    placeholder={t('custom')}
                                />
                            </div>
                        </div>
                        <div className="pt-2">
                            <button 
                                onClick={handleSaveSettings}
                                className="w-full bg-black dark:bg-gray-100 text-white dark:text-gray-900 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
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

  // --- Views (LinksView, AIChatView, TimetableView, PomodoroView, GpaView, GradesView, DashboardView, PlannerView 保持不變) ---
  
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {links.map(link => (
                      <div key={link.id} className="relative group h-32 md:h-40">
                          <button 
                              onClick={(e) => {
                                  e.stopPropagation();
                                  confirmDelete(link.id, link.title);
                              }}
                              className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100"
                          >
                              <X size={14} />
                          </button>
                          
                          <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 md:gap-3 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer no-underline text-gray-700 dark:text-gray-200 h-full"
                          >
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                                  <LinkIcon size={20} className="md:w-6 md:h-6" />
                              </div>
                              <span className="font-bold text-xs md:text-sm text-center line-clamp-1 w-full px-1">{link.title}</span>
                              <div className="flex items-center text-[10px] text-gray-400 gap-1 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex">
                                  <span>{t('open_link')}</span> <ExternalLink size={10} />
                              </div>
                          </a>
                      </div>
                  ))}
                  
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all h-32 md:h-40"
                  >
                      <Plus size={24} />
                      <span className="text-xs font-bold">{t('add_link')}</span>
                  </button>
              </div>

              {isAdding && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
                      <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-2xl p-5 shadow-xl border border-gray-200 dark:border-gray-700">
                          <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">{t('add_link')}</h3>
                          <input placeholder={t('link_name_placeholder')} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-3 mb-3 text-sm focus:border-black dark:focus:border-gray-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={newLink.title} onChange={e => setNewLink({...newLink, title: e.target.value})} />
                          <input placeholder={t('link_url_placeholder')} className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-3 mb-5 text-sm focus:border-black dark:focus:border-gray-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} />
                          <div className="flex gap-3">
                              <button onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">{t('cancel')}</button>
                              <button onClick={addLink} className="flex-1 py-3 bg-black dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">{t('confirm')}</button>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  const AIChatView = ({ tasks, grades, timetable, currentDate, gpaCourses, periodTimes, apiKey, handleSaveApiKey }) => {
    const [messages, setMessages] = useState([]);
    const [tempKey, setTempKey] = useState(apiKey || '');
    const [aiModel, setAiModel] = useState(() => {
        // Check the stored model against a list of supported models. If the stored value
        // is not in the supported list (or absent), fall back to the default model.
        const stored = localStorage.getItem('google_ai_model');
        const supported = ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-flash-latest'];
        if (stored && supported.includes(stored)) {
            return stored;
        }
        // Reset to default and update localStorage when an unsupported value is found.
        localStorage.setItem('google_ai_model', 'gemini-2.5-pro');
        return 'gemini-2.5-pro';
    });

    const handleModelChange = (e) => {
        const newModel = e.target.value;
        setAiModel(newModel);
        localStorage.setItem('google_ai_model', newModel);
    };
    
    useEffect(() => {
        setMessages([{ role: 'assistant', content: t('ai_welcome') }]);
    }, [language]); 

    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    
    useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

    const getSystemContext = () => {
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

        const todaysTasks = tasks.filter(task => task.date === getLocalDateString(currentDate))
            .map(task => `[${t('categories.' + task.category) || t('categories.other')}] ${task.subject}: ${task.note}`)
            .join('\n');

        const allTasks = tasks.map(task => `(${task.date}) [${t('categories.' + task.category) || t('categories.other')}] ${task.subject}: ${task.note}`).join('\n');
        const allGrades = grades.map(g => `[${g.subject}] ${g.score} (${g.note})`).join('\n');

        return `System Prompt: You are a helpful student assistant. Answer questions based on the student's data provided below.
        
Current Date: ${getLocalDateString(currentDate)}

Today's Schedule:
${todaysClasses || 'No classes'}

Today's Tasks:
${todaysTasks || 'No tasks'}

All Tasks:
${allTasks}

All Grades:
${allGrades}

Please answer in the language: ${language === 'en' ? 'English' : (language === 'ja' ? 'Japanese' : 'Traditional Chinese')}.
Keep your response concise and helpful.`;
    };

    const handleSend = async (text = null) => {
        const content = typeof text === 'string' ? text : input;
        if (!content.trim() || isSending) return;
        
        if (!apiKey) {
            setMessages(prev => [...prev, { role: 'user', content: content }, { role: 'assistant', content: t('ai_key_missing') }]);
            setInput('');
            return;
        }

        const userMsg = { role: 'user', content: content };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages); 
        if (typeof text !== 'string') setInput(''); 
        setIsSending(true);

        try {
            const systemContext = getSystemContext();
            const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/${aiModel}:generateContent?key=${apiKey}`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: systemContext + "\n\nUser Question: " + content,
            },
          ],
        },
      ],
    }),
  }
);


            // 嘗試解析 JSON，無論狀態碼為何
            const data = await response.json();

            if (!response.ok) {
                // 如果 API 回傳錯誤狀態，拋出詳細錯誤訊息
                const errorMsg = data.error?.message || `API Error: ${response.status} ${response.statusText}`;
                throw new Error(errorMsg);
            }

            // 檢查是否因為安全性篩選而沒有候選回應
            if (!data.candidates || data.candidates.length === 0) {
                 if (data.promptFeedback && data.promptFeedback.blockReason) {
                     throw new Error(`AI 無法回應此問題 (原因: ${data.promptFeedback.blockReason})`);
                 }
                 throw new Error("AI 沒有回傳任何內容，請稍後再試。");
            }

            const reply = data.candidates[0].content.parts[0].text;
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${t('ai_error')}: ${error.message}` }]);
        } finally {
            setIsSending(false);
        }
    };

    const presetQuestions = [
        t('ai_preset_today_class'),
        t('ai_preset_exam'),
        t('ai_preset_report'),
        t('ai_preset_homework'),
        t('ai_preset_score')
    ];

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* API Key 設定區 */}
            {!apiKey ? (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
                    <div className="flex gap-2 flex-col md:flex-row">
                        <div className="relative flex-1">
                            <Key className="absolute left-3 top-2.5 text-gray-400" size={16} />
                            <input 
                                type="password" 
                                placeholder={t('ai_key_placeholder')}
                                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                value={tempKey}
                                onChange={(e) => setTempKey(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => handleSaveApiKey(tempKey)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors w-full md:w-auto"
                        >
                            {t('ai_key_save')}
                        </button>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800 dark:hover:text-blue-300">
                            Get API Key from Google AI Studio
                        </a>
                    </p>
                </div>
            ) : (
                <div className="p-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center px-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Bot size={14} />
                        <span className="font-bold hidden md:inline">{t('ai_model_select')}</span>
                        <select 
                            value={aiModel} 
                            onChange={handleModelChange}
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs outline-none focus:border-blue-500 text-gray-700 dark:text-gray-200 cursor-pointer max-w-[150px] truncate"
                        >
                            <option value="gemini-2.5-pro">Gemini 2.5 Pro (推薦)</option>
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                            <option value="gemini-flash-latest">Gemini Flash Latest</option>
                        </select>
                    </div>
                    <button onClick={() => { setApiKey(''); localStorage.removeItem('google_ai_key'); }} className="text-xs text-red-400 hover:text-red-600 underline">Key</button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {messages.map((msg, idx) => ( <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-3 md:p-4 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${msg.role === 'user' ? 'bg-black dark:bg-gray-100 text-white dark:text-gray-900 rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-none'}`}>{msg.content}</div></div> ))}
                {isSending && <div className="text-gray-400 text-xs ml-4 animate-pulse">{t('ai_thinking')}</div>}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar">
                    {presetQuestions.map((q, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => handleSend(q)}
                            className="whitespace-nowrap px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 transition-all shadow-sm"
                        >
                            {q}
                        </button>
                    ))}
                </div>
                <div className="p-4 pt-0 flex gap-3">
                    <input type="text" placeholder={t('ai_input_placeholder')} className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-black dark:focus:border-gray-400 focus:ring-1 focus:ring-black dark:focus:ring-gray-400 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
                    <button onClick={() => handleSend()} disabled={isSending || !input.trim()} className="bg-black dark:bg-gray-100 text-white dark:text-gray-900 p-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600"><Send size={18} /></button>
                </div>
            </div>
        </div>
    );
  };

  const TimetableView = ({ timetable, setTimetable, periodTimes, setPeriodTimes }) => {
      const periods = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'B', 'C'];
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

      const deleteSubject = () => {
          const { key } = editModal;
          const newTimetable = { ...timetable };
          delete newTimetable[key];
          setTimetable(newTimetable);
          setEditModal({ ...editModal, isOpen: false });
      };

      const handleClearTimetable = () => {
          if (window.confirm(t('confirm_clear_timetable'))) {
              setTimetable({});
          }
      };

      return (
          <div className="h-full flex flex-col">
              <div className="flex-1 overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                <div className="min-w-[800px]">
                    <div className="grid grid-cols-[60px_100px_repeat(7,1fr)] text-center text-sm font-bold bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                        <div className="p-3 border-r border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">{t('period')}</div>
                        <div className="p-3 border-r border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">{t('time')}</div>
                        {days.map(d => <div key={d} className="p-3 border-r border-gray-200 dark:border-gray-700 last:border-0 text-gray-700 dark:text-gray-200">{d}</div>)}
                    </div>
                    {periods.map(p => (
                        <div key={p} className="grid grid-cols-[60px_100px_repeat(7,1fr)] text-center text-sm h-16 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-bold border-r border-gray-200 dark:border-gray-700">{p}</div>
                            
                            <div onClick={() => handleTimeClick(p)} className={`flex flex-col items-center justify-center border-r border-gray-200 dark:border-gray-700 p-1 h-full text-xs text-gray-500 dark:text-gray-400 ${isEditing ? 'cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20' : ''}`}>
                                {(() => {
                                    const tVal = periodTimes[p] || "";
                                    if (tVal.includes('-')) {
                                        const [start, end] = tVal.split('-');
                                        return (<><div>{start}</div><div className="text-gray-300 dark:text-gray-600">|</div><div>{end}</div></>);
                                    }
                                    return tVal || (isEditing ? <span className="text-indigo-300 dark:text-indigo-400">{t('setting_hint')}</span> : "");
                                })()}
                            </div>

                            {days.map((_, dayIdx) => {
                                const key = `${dayIdx + 1}-${p}`;
                                const subject = timetable[key];
                                return (
                                    <div key={key} onClick={() => handleCellClick(dayIdx, p)} className={`flex items-center justify-center p-1 border-r border-gray-100 dark:border-gray-700 last:border-0 ${isEditing ? 'cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20' : ''}`}>
                                        {subject ? (
                                            <div className="bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-lg px-2 py-1 w-full h-full flex items-center justify-center text-xs font-bold break-all leading-tight border border-indigo-100 dark:border-indigo-800 shadow-sm">{subject}</div>
                                        ) : (
                                            isEditing && <div className="text-indigo-100 dark:text-indigo-800 text-lg opacity-0 hover:opacity-100 transition-opacity">+</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
              </div>
              
              <div className="mt-4 flex justify-end gap-3 flex-wrap">
                  {isEditing && (
                    <button 
                        onClick={handleClearTimetable} 
                        className="px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                    >
                        <Trash2 size={16} /> {t('clear_timetable')}
                    </button>
                  )}
                  
                  <button onClick={() => setIsEditing(!isEditing)} className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2 ${isEditing ? 'bg-black dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                      {isEditing ? <> <Check size={16} /> {t('finish_edit')} </> : <> <Edit2 size={16} /> {t('edit_timetable')} </>}
                  </button>
              </div>

              {editModal.isOpen && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
                      <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                          <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">{editModal.type === 'time' ? t('edit_modal_title_time') : t('edit_modal_title_course')}</h3>
                          {editModal.type === 'time' ? (
                              <div className="flex items-center gap-2 mb-6">
                                  <input type="time" className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-sm w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={timeEdit.start} onChange={e => setTimeEdit({...timeEdit, start: e.target.value})} />
                                  <span className="text-gray-500 dark:text-gray-400">-</span>
                                  <input type="time" className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-sm w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={timeEdit.end} onChange={e => setTimeEdit({...timeEdit, end: e.target.value})} />
                              </div>
                          ) : (
                              <input autoFocus className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-3 mb-5 text-sm focus:border-black dark:focus:border-gray-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={editModal.value} onChange={e => setEditModal({...editModal, value: e.target.value})} placeholder={t('course_name_placeholder')} />
                          )}
                          <div className="flex gap-3">
                              {/* 只有在編輯課程且該格子已經有課程時，才顯示刪除按鈕 */}
                              {editModal.type === 'subject' && timetable[editModal.key] && (
                                <button onClick={deleteSubject} className="flex-1 py-2.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-1">
                                    <Trash2 size={16} /> {t('delete')}
                                </button>
                              )}
                              <button onClick={() => setEditModal({...editModal, isOpen: false})} className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">{t('cancel')}</button>
                              <button onClick={saveEdit} className="flex-1 py-2.5 bg-black dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">{t('confirm')}</button>
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
          <div className="h-full flex flex-col md:flex-row gap-8 overflow-y-auto">
              <div className="flex-1 flex flex-col items-center justify-center space-y-8 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 min-h-[500px]">
                  <div className="flex bg-gray-100 dark:bg-gray-700 p-1.5 rounded-full">
                      <button onClick={() => switchMode('work')} className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${mode === 'work' ? 'bg-white dark:bg-gray-600 shadow text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-300'}`}>{t('focus_mode')}</button>
                      <button onClick={() => switchMode('break')} className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${mode === 'break' ? 'bg-white dark:bg-gray-600 shadow text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-300'}`}>{t('break_mode')}</button>
                  </div>

                  {mode === 'work' && (
                      <div className="w-full max-w-xs">
                          {isCreatingSubject ? (
                              <div className="flex gap-2 items-center">
                                  <input autoFocus placeholder={t('input_subject')} className="w-full border-b-2 border-indigo-500 dark:border-indigo-400 outline-none text-center pb-2 bg-transparent text-lg text-gray-800 dark:text-gray-100" value={customSubject} onChange={(e) => setCustomSubject(e.target.value)} />
                                  <button onClick={handleConfirmSubject} className="text-green-500 hover:text-green-600 bg-green-50 dark:bg-green-900/30 p-2 rounded-full"><Check size={20}/></button>
                                  <button onClick={() => setIsCreatingSubject(false)} className="text-gray-400 hover:text-gray-600 bg-gray-50 dark:bg-gray-700 p-2 rounded-full"><X size={20}/></button>
                              </div>
                          ) : (
                              <select className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-lg rounded-xl p-3 w-full outline-none focus:border-black dark:focus:border-gray-400 text-center cursor-pointer" value={targetSubject} onChange={handleSubjectChange}>
                                  <option value="">{t('select_subject')}</option>
                                  {pomodoroSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                                  <option value="NEW_CUSTOM">{t('new_custom_subject')}</option>
                              </select>
                          )}
                      </div>
                  )}

                  <div className={`w-64 h-64 md:w-72 md:h-72 rounded-full border-[12px] flex items-center justify-center shadow-xl transition-all duration-500 ${mode === 'work' ? 'border-red-50 dark:border-red-900/20 bg-white dark:bg-gray-800' : 'border-green-50 dark:border-green-900/20 bg-white dark:bg-gray-800'}`}>
                      <span className={`text-6xl md:text-7xl font-mono font-bold tracking-tighter ${mode === 'work' ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>{formatTime(timeLeft)}</span>
                  </div>

                  <div className="flex gap-6">
                      <button onClick={toggleTimer} className="w-20 h-20 rounded-full bg-black dark:bg-gray-100 text-white dark:text-gray-900 flex items-center justify-center hover:scale-105 transition-transform shadow-xl hover:shadow-2xl">{isActive ? <span className="text-3xl">⏸</span> : <span className="text-3xl ml-1">▶</span>}</button>
                      <button onClick={resetTimer} className="w-20 h-20 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 shadow-md hover:shadow-lg transition-all"><RotateCw size={28} /></button>
                  </div>
              </div>

              <div className="w-full md:w-80 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col min-h-[300px]">
                  <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2"><BarChart2 size={20} className="text-blue-500"/> {t('weekly_stats')}</h3>
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-mono bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">{t('unit_hours')}</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {subjectStats.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 text-sm italic border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl min-h-[200px]">
                            <Clock size={40} className="mb-2 opacity-20"/>
                            {t('no_study_records')}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {subjectStats.map((stat, i) => (
                                <div key={stat.subject} className="flex flex-col gap-1">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{stat.subject}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono font-bold">{stat.hours}hr</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
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
                  // 如果課程沒有直接輸入分數，則嘗試從細項計算
                  const criteria = courseCriteria[c.id]; // 改用 ID
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
          // 使用 ID 讀取，如果沒有，嘗試用 Name 讀取 (相容舊資料)
          setCurrentCriteria(courseCriteria[course.id] || courseCriteria[course.name] || []);
      };

      const closeCalculator = () => {
          setCalcModal({ isOpen: false, courseId: null, courseName: '' });
          setCurrentCriteria([]);
      };

      const addCriteriaItem = () => {
          // 新增日期欄位，預設今天
          setCurrentCriteria([...currentCriteria, { id: Date.now(), name: '', weight: '', score: '', date: getLocalDateString(new Date()) }]);
      };

      const updateCriteriaItem = (id, field, value) => {
          setCurrentCriteria(currentCriteria.map(c => c.id === id ? { ...c, [field]: value } : c));
      };

      const removeCriteriaItem = (id) => {
          setCurrentCriteria(currentCriteria.filter(c => c.id !== id));
      };

      const saveCriteria = () => {
          // 使用 ID 儲存
          setCourseCriteria(prev => ({ ...prev, [calcModal.courseId]: currentCriteria }));
          
          let totalScore = 0;
          currentCriteria.forEach(c => {
              const w = parseFloat(c.weight) || 0;
              const s = parseFloat(c.score) || 0;
              totalScore += s * (w / 100);
          });
          
          // 更新課程總分
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
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-lg flex items-center justify-between">
                  <div>
                      <p className="text-blue-100 text-sm font-bold tracking-wider uppercase mb-1">{t('current_gpa')}</p>
                      <h2 className="text-5xl md:text-6xl font-black tracking-tighter">{calculatedGPA}</h2>
                  </div>
                  <div className="text-right">
                      <div className="text-2xl md:text-3xl font-bold opacity-90">{gpaCourses.length}</div>
                      <div className="text-xs text-blue-200">{t('total_courses')}</div>
                  </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex-1 flex flex-col overflow-hidden">
                  {/* 使用 min-w 確保表格在手機上可左右滑動而不變形 */}
                  <div className="overflow-x-auto">
                    <div className="min-w-[500px]">
                        <div className="grid grid-cols-12 bg-gray-50 dark:bg-gray-900 text-xs font-bold text-gray-500 dark:text-gray-400 p-3 border-b border-gray-200 dark:border-gray-700 uppercase tracking-wide">
                            <div className="col-span-4 pl-2">{t('course_name')}</div>
                            <div className="col-span-2 text-center">{t('credit')}</div>
                            <div className="col-span-2 text-center">{t('score')}</div>
                            <div className="col-span-2 text-center">{t('gpa_score')}</div>
                            <div className="col-span-2 text-center">{t('action')}</div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto max-h-[400px]">
                            {gpaCourses.map(course => (
                                <div key={course.id} className="grid grid-cols-12 p-3 border-b border-gray-100 dark:border-gray-700 items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                    <div className="col-span-4 flex items-center gap-2">
                                        <input placeholder={t('course_name_placeholder')} className="w-full text-sm font-medium text-gray-800 dark:text-gray-100 border-none bg-transparent outline-none focus:ring-0 placeholder:text-gray-300 dark:placeholder:text-gray-600" value={course.name} onChange={e => updateGpaRow(course.id, 'name', e.target.value)}/>
                                    </div>
                                    
                                    <input placeholder="-" type="number" className="col-span-2 text-center text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-md py-1 focus:border-blue-500 dark:focus:border-blue-400 outline-none text-gray-900 dark:text-gray-100" value={course.credit} onChange={e => updateGpaRow(course.id, 'credit', e.target.value)}/>
                                    
                                    <input placeholder="-" type="number" className="col-span-2 text-center text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-md py-1 font-bold text-blue-600 dark:text-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none" value={course.score} onChange={e => updateGpaRow(course.id, 'score', e.target.value)} readOnly title="由細項計算"/>
                                    
                                    <div className="col-span-2 text-center text-sm font-mono text-gray-500 dark:text-gray-400">{scoreToPoint(course.score)}</div>
                                    
                                    <div className="col-span-2 flex justify-center gap-1">
                                        <button 
                                            onClick={() => openCalculator(course)}
                                            className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-all"
                                            title={t('calc_semester_score')}
                                        >
                                            <PieChart size={16} />
                                        </button>
                                        <button onClick={() => removeGpaRow(course.id)} className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-all md:opacity-0 md:group-hover:opacity-100"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <button onClick={() => setIsAdding(true)} className="w-full py-3 text-center text-sm text-white font-bold bg-black dark:bg-gray-100 dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-sm"><Plus size={18} /> {t('add_course')}</button>
                  </div>
              </div>

              {isAdding && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
                      <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{t('add_course')}</h3><button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X size={20} /></button></div>
                          <div className="flex flex-col gap-4 mb-6">
                              <div>
                                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">{t('course_name')}</label>
                                  <input className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-sm outline-none focus:border-black dark:focus:border-gray-500 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" placeholder={t('course_name')} value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})}/>
                              </div>
                              <div className="flex gap-4">
                                  <div className="flex-1">
                                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">{t('credit')}</label>
                                      <input className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-sm outline-none focus:border-black dark:focus:border-gray-500 text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" placeholder="3" type="number" value={newCourse.credit} onChange={e => setNewCourse({...newCourse, credit: e.target.value})}/>
                                  </div>
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">{t('grade_note_optional')}</label>
                                  <input className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-sm outline-none focus:border-black dark:focus:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" placeholder={t('grade_note_placeholder')} value={newCourse.note} onChange={e => setNewCourse({...newCourse, note: e.target.value})}/>
                              </div>
                          </div>
                          <button onClick={addNewCourse} className="w-full bg-black dark:bg-gray-100 text-white dark:text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">{t('confirm')}</button>
                      </div>
                  </div>
              )}

              {calcModal.isOpen && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
                      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl p-6 shadow-xl flex flex-col h-[600px] border border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                              <div>
                                  <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{calcModal.courseName}</h3>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">{t('score_calculator')}</span>
                              </div>
                              <button onClick={closeCalculator} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X size={20} /></button>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto mb-4 pr-1">
                              <div className="space-y-3">
                                  {currentCriteria.map((item, idx) => (
                                      <div key={item.id} className="flex flex-col gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                          <div className="flex gap-2">
                                              <input 
                                                  className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                                                  placeholder={t('item_placeholder')}
                                                  value={item.name}
                                                  onChange={(e) => updateCriteriaItem(item.id, 'name', e.target.value)}
                                              />
                                              <input 
                                                  type="date"
                                                  className="w-32 border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-xs outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700"
                                                  value={item.date || getLocalDateString(new Date())}
                                                  onChange={(e) => updateCriteriaItem(item.id, 'date', e.target.value)}
                                              />
                                          </div>
                                          <div className="flex gap-2 items-center">
                                              <div className="relative w-24">
                                                  <input 
                                                      className="w-full border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-sm text-center outline-none focus:border-blue-500 dark:focus:border-blue-400 pr-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                                                      placeholder={t('weight_placeholder')}
                                                      type="number"
                                                      value={item.weight}
                                                      onChange={(e) => updateCriteriaItem(item.id, 'weight', e.target.value)}
                                                  />
                                                  <span className="absolute right-2 top-2 text-xs text-gray-400">%</span>
                                              </div>
                                              <span className="text-gray-400 text-xs">x</span>
                                              <input 
                                                  className="w-20 border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-sm text-center outline-none focus:border-blue-500 dark:focus:border-blue-400 font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-700" 
                                                  placeholder={t('score_placeholder')}
                                                  type="number"
                                                  value={item.score}
                                                  onChange={(e) => updateCriteriaItem(item.id, 'score', e.target.value)}
                                              />
                                              <span className="text-gray-400 text-xs">= {((parseFloat(item.score)||0) * (parseFloat(item.weight)||0)/100).toFixed(1)}</span>
                                              <div className="flex-1"></div>
                                              <button onClick={() => removeCriteriaItem(item.id)} className="text-gray-300 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 bg-white dark:bg-gray-700 p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-red-200 dark:hover:border-red-900"><Trash2 size={16}/></button>
                                          </div>
                                      </div>
                                  ))}
                                  <button onClick={addCriteriaItem} className="w-full border border-dashed border-gray-300 dark:border-gray-600 py-2.5 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">{t('add_criteria_item')}</button>
                              </div>
                          </div>

                          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-auto">
                              <div className="flex justify-between items-center mb-4">
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {t('total_weight')}: <span className={currentTotalWeight !== 100 ? 'text-red-500 dark:text-red-400 font-bold' : 'text-green-600 dark:text-green-400 font-bold'}>{currentTotalWeight}%</span>
                                      {currentTotalWeight !== 100 && ` ${t('not_100')}`}
                                  </div>
                                  <div className="text-right">
                                      <span className="text-xs text-gray-500 dark:text-gray-400 block">{t('estimated_score')}</span>
                                      <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{currentTotalScore}</span>
                                  </div>
                              </div>
                              <button onClick={saveCriteria} className="w-full bg-black dark:bg-gray-100 text-white dark:text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">{t('save_and_apply')}</button>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  // --- 改寫後的 GradesView ---
  const GradesView = ({ gpaCourses, courseCriteria, currentDate, archivedSemesters, setArchivedSemesters }) => {
    const [viewMode, setViewMode] = useState('weekly'); // weekly, subjects, history
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [selectedHistorySemester, setSelectedHistorySemester] = useState(null);

    // --- 歷史紀錄評分細項管理 Modal State ---
    const [historyCalcModal, setHistoryCalcModal] = useState({ isOpen: false, courseId: null, courseName: '' });
    const [tempHistoryCriteria, setTempHistoryCriteria] = useState([]);

    // 取得本週日期範圍
    const startOfWeek = useMemo(() => {
        const d = new Date(currentDate);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(d.setDate(diff));
        monday.setHours(0,0,0,0);
        return monday;
    }, [currentDate]);

    const endOfWeek = useMemo(() => {
        const d = new Date(startOfWeek);
        d.setDate(d.getDate() + 6);
        d.setHours(23,59,59,999);
        return d;
    }, [startOfWeek]);

    // 扁平化所有細項並篩選本週
    const weeklyRecords = useMemo(() => {
        let allItems = [];
        gpaCourses.forEach(course => {
            const criteria = courseCriteria[course.id] || courseCriteria[course.name] || [];
            criteria.forEach(item => {
                if (item.date) {
                    const itemDate = new Date(item.date);
                    if (itemDate >= startOfWeek && itemDate <= endOfWeek) {
                        allItems.push({ ...item, courseName: course.name });
                    }
                }
            });
        });
        return allItems.sort((a,b) => new Date(b.date) - new Date(a.date));
    }, [gpaCourses, courseCriteria, startOfWeek, endOfWeek]);

    // 歷史學期計算
    const historyGPA = useMemo(() => {
        if (!selectedHistorySemester) return "0.00";
        const target = archivedSemesters.find(s => s.id === selectedHistorySemester);
        if (!target) return "0.00";
        
        let totalPoints = 0; let totalCredits = 0;
        target.courses.forEach(c => {
            const credit = parseFloat(c.credit);
            const score = parseFloat(c.score);
            if (!isNaN(credit) && !isNaN(score)) {
                totalPoints += scoreToPoint(score) * credit;
                totalCredits += credit;
            }
        });
        return totalCredits === 0 ? "0.00" : (totalPoints / totalCredits).toFixed(2);
    }, [selectedHistorySemester, archivedSemesters]);

    const updateArchivedCourse = (courseId, field, value) => {
        if (!selectedHistorySemester) return;
        setArchivedSemesters(prev => prev.map(semester => {
            if (semester.id === selectedHistorySemester) {
                return {
                    ...semester,
                    courses: semester.courses.map(c => c.id === courseId ? { ...c, [field]: value } : c)
                };
            }
            return semester;
        }));
    };

    // --- 歷史紀錄評分細項邏輯 ---
    const openHistoryCalculator = (course) => {
        if (!selectedHistorySemester) return;
        const semester = archivedSemesters.find(s => s.id === selectedHistorySemester);
        if (!semester) return;

        // 從 semester.criteria 中讀取該課程的細項
        const criteria = semester.criteria ? (semester.criteria[course.id] || semester.criteria[course.name] || []) : [];
        setTempHistoryCriteria(criteria);
        setHistoryCalcModal({ isOpen: true, courseId: course.id, courseName: course.name });
    };

    const closeHistoryCalculator = () => {
        setHistoryCalcModal({ isOpen: false, courseId: null, courseName: '' });
        setTempHistoryCriteria([]);
    };

    const addHistoryCriteriaItem = () => {
        setTempHistoryCriteria([...tempHistoryCriteria, { id: Date.now(), name: '', weight: '', score: '', date: getLocalDateString(new Date()) }]);
    };

    const updateHistoryCriteriaItem = (id, field, value) => {
        setTempHistoryCriteria(tempHistoryCriteria.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const removeHistoryCriteriaItem = (id) => {
        setTempHistoryCriteria(tempHistoryCriteria.filter(c => c.id !== id));
    };

    const saveHistoryCriteria = () => {
        if (!selectedHistorySemester) return;

        // 計算新總分
        let totalScore = 0;
        tempHistoryCriteria.forEach(c => {
            const w = parseFloat(c.weight) || 0;
            const s = parseFloat(c.score) || 0;
            totalScore += s * (w / 100);
        });

        // 更新 archivedSemesters
        setArchivedSemesters(prev => prev.map(semester => {
            if (semester.id === selectedHistorySemester) {
                return {
                    ...semester,
                    // 更新 criteria
                    criteria: {
                        ...semester.criteria,
                        [historyCalcModal.courseId]: tempHistoryCriteria
                    },
                    // 更新 courses 分數
                    courses: semester.courses.map(c => c.id === historyCalcModal.courseId ? { ...c, score: totalScore.toFixed(0) } : c)
                };
            }
            return semester;
        }));

        closeHistoryCalculator();
    };

    const tempHistoryTotalScore = useMemo(() => {
        let total = 0;
        tempHistoryCriteria.forEach(c => {
            const w = parseFloat(c.weight) || 0;
            const s = parseFloat(c.score) || 0;
            total += s * (w / 100);
        });
        return total.toFixed(1);
    }, [tempHistoryCriteria]);

    const tempHistoryTotalWeight = useMemo(() => {
        let total = 0;
        tempHistoryCriteria.forEach(c => total += (parseFloat(c.weight) || 0));
        return total;
    }, [tempHistoryCriteria]);


    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto no-scrollbar max-w-full">
                {['weekly:all_records', 'subjects:subject_categories', 'history:gpa_history'].map(m => {
                    const [mode, label] = m.split(':');
                    return ( 
                        <button 
                            key={mode} 
                            onClick={() => { setViewMode(mode); setSelectedSubjectId(null); setSelectedHistorySemester(null); }} 
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${viewMode === mode || (mode==='subjects' && selectedSubjectId) || (mode==='history' && selectedHistorySemester) ? 'bg-white dark:bg-gray-700 shadow text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                        >
                            {t(label)}
                        </button> 
                    )
                })}
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2">
            {viewMode === 'weekly' && (
                <div className="space-y-4">
                    {weeklyRecords.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-300 dark:text-gray-600 text-sm">
                            <Calendar size={48} className="mb-2 opacity-20" />
                            {t('no_criteria_records')}
                        </div>
                    ) : (
                        weeklyRecords.map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className="bg-white dark:bg-gray-800 border-l-4 border-blue-500 shadow-sm rounded-r-xl p-4 flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-gray-100">{item.courseName}</h4>
                                    <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        <span className="bg-gray-100 dark:bg-gray-700 px-1.5 rounded">{item.date}</span>
                                        <span>{item.name}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-gray-800 dark:text-gray-100">{item.score}</div>
                                    <div className="text-[10px] text-gray-400">權重: {item.weight}%</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {viewMode === 'subjects' && !selectedSubjectId && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gpaCourses.map(course => {
                        const count = (courseCriteria[course.id] || courseCriteria[course.name] || []).length;
                        return (
                            <div key={course.id} onClick={() => setSelectedSubjectId(course.id)} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4"><BookOpen size={24} /></div>
                                <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-1 line-clamp-1">{course.name}</h4>
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500">{t('records_count', {count})}</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedSubjectId && (
                <div className="space-y-4 max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSelectedSubjectId(null)} className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"><ArrowLeft size={20} /></button>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                {gpaCourses.find(c => c.id === selectedSubjectId)?.name}
                            </h2>
                        </div>
                    </div>

                    {(courseCriteria[selectedSubjectId] || []).sort((a,b) => new Date(b.date) - new Date(a.date)).map(item => (
                        <div key={item.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-xl p-4 flex justify-between items-center">
                            <div>
                                <span className="text-xs text-gray-400 font-mono block mb-1">{item.date}</span>
                                <span className="text-base font-bold text-gray-800 dark:text-gray-100">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">{item.weight}%</span>
                                <span className="text-2xl font-black text-gray-800 dark:text-gray-100">{item.score}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {viewMode === 'history' && !selectedHistorySemester && (
                <div className="space-y-4">
                    {archivedSemesters.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-300 dark:text-gray-600 text-sm">
                            <History size={48} className="mb-2 opacity-20" />
                            {t('no_archived_data')}
                        </div>
                    ) : (
                        archivedSemesters.map(semester => (
                            <div key={semester.id} onClick={() => setSelectedHistorySemester(semester.id)} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-1">{semester.name}</h4>
                                    <span className="text-xs text-gray-400">歸檔日: {new Date(semester.archivedDate).toLocaleDateString()}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 block mb-1">GPA</span>
                                    <span className="text-2xl font-black text-gray-800 dark:text-gray-100">
                                        {(semester.courses.reduce((acc, curr) => {
                                            const s = parseFloat(curr.score);
                                            const c = parseFloat(curr.credit);
                                            return (!isNaN(s) && !isNaN(c)) ? acc + scoreToPoint(s)*c : acc;
                                        }, 0) / (semester.courses.reduce((acc, curr) => acc + (parseFloat(curr.credit)||0), 0) || 1)).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {selectedHistorySemester && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSelectedHistorySemester(null)} className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"><ArrowLeft size={20} /></button>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                {archivedSemesters.find(s => s.id === selectedHistorySemester)?.name}
                            </h2>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
                        <div>
                            <p className="text-indigo-100 text-xs font-bold tracking-wider uppercase mb-1">歷史 GPA</p>
                            <h2 className="text-5xl font-black tracking-tighter">{historyGPA}</h2>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-12 bg-gray-50 dark:bg-gray-900 text-xs font-bold text-gray-500 dark:text-gray-400 p-3 border-b border-gray-200 dark:border-gray-700 uppercase tracking-wide">
                            <div className="col-span-6 pl-2">{t('course_name')}</div>
                            <div className="col-span-2 text-center">{t('credit')}</div>
                            <div className="col-span-2 text-center">{t('score')}</div>
                            <div className="col-span-2 text-center">{t('action')}</div>
                        </div>
                        {archivedSemesters.find(s => s.id === selectedHistorySemester)?.courses.map((course, idx) => (
                            <div key={course.id || idx} className="grid grid-cols-12 p-3 border-b border-gray-100 dark:border-gray-700 items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="col-span-6 font-medium text-sm text-gray-800 dark:text-gray-100 pl-2">
                                    {course.name}
                                </div>
                                <input 
                                    type="number" 
                                    className="col-span-2 text-center text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-md py-1 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none text-gray-900 dark:text-gray-100"
                                    value={course.credit}
                                    onChange={(e) => updateArchivedCourse(course.id, 'credit', e.target.value)}
                                />
                                <input 
                                    type="number" 
                                    className="col-span-2 text-center text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-md py-1 font-bold text-indigo-600 dark:text-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none"
                                    value={course.score}
                                    onChange={(e) => updateArchivedCourse(course.id, 'score', e.target.value)}
                                    readOnly // 設為唯讀，強制透過細項修改
                                    title="請點擊右側按鈕管理細項以修改分數"
                                />
                                <div className="col-span-2 flex justify-center">
                                    <button 
                                        onClick={() => openHistoryCalculator(course)}
                                        className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-all"
                                        title={t('calc_semester_score')}
                                    >
                                        <PieChart size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 歷史紀錄成績計算 Modal */}
            {historyCalcModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl p-6 shadow-xl flex flex-col h-[600px] border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{historyCalcModal.courseName}</h3>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{t('score_calculator')} (歷史紀錄)</span>
                            </div>
                            <button onClick={closeHistoryCalculator} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X size={20} /></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto mb-4 pr-1">
                            <div className="space-y-3">
                                {tempHistoryCriteria.map((item, idx) => (
                                    <div key={item.id} className="flex flex-col gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <div className="flex gap-2">
                                            <input 
                                                className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                                                placeholder={t('item_placeholder')}
                                                value={item.name}
                                                onChange={(e) => updateHistoryCriteriaItem(item.id, 'name', e.target.value)}
                                            />
                                            <input 
                                                type="date"
                                                className="w-32 border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-xs outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700"
                                                value={item.date || getLocalDateString(new Date())}
                                                onChange={(e) => updateHistoryCriteriaItem(item.id, 'date', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <div className="relative w-24">
                                                <input 
                                                    className="w-full border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-sm text-center outline-none focus:border-blue-500 dark:focus:border-blue-400 pr-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                                                    placeholder={t('weight_placeholder')}
                                                    type="number"
                                                    value={item.weight}
                                                    onChange={(e) => updateHistoryCriteriaItem(item.id, 'weight', e.target.value)}
                                                />
                                                <span className="absolute right-2 top-2 text-xs text-gray-400">%</span>
                                            </div>
                                            <span className="text-gray-400 text-xs">x</span>
                                            <input 
                                                className="w-20 border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-sm text-center outline-none focus:border-blue-500 dark:focus:border-blue-400 font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-700" 
                                                placeholder={t('score_placeholder')}
                                                type="number"
                                                value={item.score}
                                                onChange={(e) => updateHistoryCriteriaItem(item.id, 'score', e.target.value)}
                                            />
                                            <span className="text-gray-400 text-xs">= {((parseFloat(item.score)||0) * (parseFloat(item.weight)||0)/100).toFixed(1)}</span>
                                            <div className="flex-1"></div>
                                            <button onClick={() => removeHistoryCriteriaItem(item.id)} className="text-gray-300 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 bg-white dark:bg-gray-700 p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-red-200 dark:hover:border-red-900"><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addHistoryCriteriaItem} className="w-full border border-dashed border-gray-300 dark:border-gray-600 py-2.5 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">{t('add_criteria_item')}</button>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-auto">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {t('total_weight')}: <span className={tempHistoryTotalWeight !== 100 ? 'text-red-500 dark:text-red-400 font-bold' : 'text-green-600 dark:text-green-400 font-bold'}>{tempHistoryTotalWeight}%</span>
                                    {tempHistoryTotalWeight !== 100 && ` ${t('not_100')}`}
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 block">{t('estimated_score')}</span>
                                    <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{tempHistoryTotalScore}</span>
                                </div>
                            </div>
                            <button onClick={saveHistoryCriteria} className="w-full bg-black dark:bg-gray-100 text-white dark:text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">{t('save_and_apply')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    );
  };

  const DashboardView = ({ tasks, currentDate, setCurrentDate }) => (
      <div className="h-full flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-80 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm h-fit">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2"><Calendar size={20} className="text-red-500 dark:text-red-400"/> {currentDate.getMonth()+1}月</h2>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
                {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(d => <div key={d}>{t(d)}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1 text-sm">
                  {Array.from({length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() === 0 ? 6 : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() - 1}).map((_, i) => (<div key={`empty-${i}`} className="aspect-square"></div>))}
                  {Array.from({length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()}).map((_, i) => {
                      const day = i + 1;
                      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                      const isSelected = day === currentDate.getDate();
                      const dayTasks = tasks.filter(task => new Date(task.date).toDateString() === dateObj.toDateString());
                      return (
                          <div key={i} onClick={() => setCurrentDate(dateObj)} className={`aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer relative transition-all ${isSelected ? 'bg-black dark:bg-gray-100 text-white dark:text-gray-900 shadow-md' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>
                              <span className="text-xs font-bold z-10">{day}</span>
                              <div className="flex gap-0.5 mt-1 h-1">{dayTasks.slice(0, 3).map((task, idx) => (<div key={idx} className={`w-1 h-1 rounded-full ${CATEGORIES[task.category.toUpperCase()]?.color || 'bg-gray-400'}`}></div>))}</div>
                          </div>
                      );
                  })}
              </div>
          </div>
          
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">{currentDate.getMonth()+1}/{currentDate.getDate()} 行程概覽</h3>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {tasks.filter(task => new Date(task.date).toDateString() === currentDate.toDateString()).length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-500 text-sm italic">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3"><Sparkles size={24} className="opacity-20"/></div>
                        {t('no_tasks_today')}
                    </div>
                ) : (
                    tasks.filter(task => new Date(task.date).toDateString() === currentDate.toDateString()).map(task => (
                        <div key={task.id} className={`flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 ${CATEGORIES[task.category.toUpperCase()].border} border-t border-r border-b border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow`}>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold ${CATEGORIES[task.category.toUpperCase()].color}`}>{t('categories.' + task.category)}</span>
                                    <span className="font-bold text-gray-800 dark:text-gray-100">{task.subject}</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 pl-1">{task.note}</p>
                            </div>
                            {task.completed ? <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-1.5 rounded-full"><Check size={20} /></div> : <div className="w-5 h-5 rounded-full border-2 border-gray-200 dark:border-gray-600"></div>}
                        </div>
                    ))
                )}
              </div>
          </div>
      </div>
  );

  const PlannerView = ({ tasks, setTasks, weekDays }) => {
    const [newItem, setNewItem] = useState({ category: 'homework', subject: '', note: '' });
    const fileInputRef = useRef(null);
    
    const toggleTask = (id) => { setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task)); };
    
    const handleAdd = (dateStr) => { 
        if (!newItem.subject) return; 
        
        // 取得當前語言的類別名稱 (例如: "考試" 或 "Exam")
        const categoryName = t('categories.' + newItem.category);
        // 將類別名稱加到備註的最前面，中間加一個空格
        const finalNote = newItem.note ? `${categoryName} ${newItem.note}` : categoryName;

        setTasks([...tasks, { id: Date.now(), date: dateStr, ...newItem, note: finalNote, completed: false }]); 
        setNewItem({ ...newItem, subject: '', note: '' }); 
    };

    const handleDelete = (taskId, taskSubject) => {
        if (window.confirm(t('confirm_delete_task', {subject: taskSubject}))) {
            setTasks(tasks.filter(task => task.id !== taskId));
        }
    };

    const handleIcsImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target.result;
                const lines = text.split(/\r\n|\n/);
                const newTasks = [];
                let currentEvent = null;

                lines.forEach((line) => {
                    const trimmedLine = line.trim();
                    if (trimmedLine === 'BEGIN:VEVENT') {
                        currentEvent = {};
                    } else if (trimmedLine === 'END:VEVENT') {
                        if (currentEvent && currentEvent.date && currentEvent.subject) {
                            newTasks.push({
                                id: Date.now() + Math.random(),
                                date: currentEvent.date,
                                category: 'other', // 強制分類為其他
                                subject: currentEvent.subject,
                                note: currentEvent.note || '',
                                completed: false
                            });
                        }
                        currentEvent = null;
                    } else if (currentEvent) {
                        if (trimmedLine.startsWith('SUMMARY:')) {
                            currentEvent.subject = trimmedLine.substring(8);
                        } else if (trimmedLine.startsWith('DESCRIPTION:')) {
                            currentEvent.note = trimmedLine.substring(12);
                        } else if (trimmedLine.startsWith('DTSTART')) {
                            // 處理 DTSTART:20231101T... 或 DTSTART;VALUE=DATE:20231101
                            const parts = trimmedLine.split(':');
                            if (parts.length >= 2) {
                                const dateVal = parts[1];
                                // 基本解析 YYYYMMDD
                                if (dateVal.length >= 8) {
                                    const y = dateVal.substring(0, 4);
                                    const m = dateVal.substring(4, 6);
                                    const d = dateVal.substring(6, 8);
                                    currentEvent.date = `${y}-${m}-${d}`;
                                }
                            }
                        }
                    }
                });

                if (newTasks.length > 0) {
                    setTasks(prev => [...prev, ...newTasks]);
                    alert(t('import_success', { count: newTasks.length }));
                } else {
                    alert(t('import_error'));
                }
            } catch (err) {
                console.error(err);
                alert(t('import_error'));
            }
            // 重置 input 以便下次能選同一個檔案
            event.target.value = '';
        };
        reader.readAsText(file);
    };

    return (
      <div className="h-full flex flex-col">
        {/* ICS 匯入工具列 */}
        <div className="flex justify-end px-2 pb-2">
            <input 
                type="file" 
                ref={fileInputRef} 
                accept=".ics" 
                className="hidden" 
                onChange={handleIcsImport} 
            />
            <button 
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all"
                title={t('ics_format_hint')}
            >
                <Upload size={14} /> {t('import_ics')}
            </button>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 h-full overflow-y-auto xl:overflow-hidden">
            {weekDays.map((day, index) => {
            const dateStr = getLocalDateString(day);
            const dayTasks = tasks.filter(task => task.date === dateStr);
            const isToday = new Date().toDateString() === day.toDateString();
            const weekDayKey = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][index];
            
            return (
                <div key={dateStr} className={`flex flex-col rounded-xl border ${isToday ? 'border-blue-500 dark:border-blue-400 shadow-md ring-2 ring-blue-50 dark:ring-blue-900/20' : 'border-gray-200 dark:border-gray-700 shadow-sm'} bg-white dark:bg-gray-800 overflow-hidden h-fit xl:h-full transition-all`}>
                    <div className={`px-3 py-2 border-b ${isToday ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300'} border-gray-100 dark:border-gray-700 text-xs font-bold flex justify-between items-center`}>
                        <span>{t(weekDayKey)}</span>
                        <span className={isToday ? 'text-blue-100' : 'text-gray-400'}>{day.getMonth()+1}/{day.getDate()}</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-2 space-y-1.5 bg-gray-50/30 dark:bg-gray-900/30 min-h-[100px] xl:min-h-0 custom-scrollbar">
                        {dayTasks.length === 0 && <div className="text-[10px] text-gray-300 dark:text-gray-600 text-center py-4 italic">{t('no_tasks')}</div>}
                        {dayTasks.map(task => (
                            <div key={task.id} className={`group relative bg-white dark:bg-gray-700 p-2 rounded-lg border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all ${task.completed ? 'opacity-60 grayscale' : ''}`}>
                                <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${CATEGORIES[task.category.toUpperCase()].color}`}></div>
                                <div className="flex items-start gap-2 pl-2">
                                    <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} className="mt-0.5 w-3 h-3 rounded border-gray-300 dark:border-gray-500 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0 bg-white dark:bg-gray-600"/>
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-bold text-xs truncate ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>{task.subject}</div>
                                        <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate flex items-center gap-1 mt-0.5">
                                            <span className={`px-1.5 py-0.5 rounded text-white font-bold text-[9px] ${CATEGORIES[task.category.toUpperCase()]?.color}`}>
                                                {t('categories.' + task.category)}
                                            </span>
                                            <span className={task.completed ? 'line-through' : ''}>{task.note}</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(task.id, task.subject);
                                    }}
                                    className="absolute top-1 right-1 text-gray-300 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors hidden group-hover:block"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="p-2 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col gap-1.5">
                            <div className="flex gap-1.5">
                                <select className="text-[10px] border border-gray-200 dark:border-gray-600 rounded p-1 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 outline-none flex-1 truncate" value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})}>{Object.values(CATEGORIES).map(c => <option key={c.id} value={c.id}>{t('categories.' + c.key)}</option>)}</select>
                                <input placeholder={t('subject_placeholder')} className="text-[10px] border border-gray-200 dark:border-gray-600 p-1 rounded w-16 outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500" onChange={e=>setNewItem({...newItem, subject: e.target.value})} value={newItem.subject} />
                            </div>
                            <div className="flex gap-1.5">
                                <input placeholder={t('note_placeholder')} className="text-[10px] border border-gray-200 dark:border-gray-600 p-1 rounded flex-1 outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500" onChange={e=>setNewItem({...newItem, note: e.target.value})} value={newItem.note} />
                                <button onClick={()=>handleAdd(dateStr)} className="p-1 bg-black dark:bg-gray-100 text-white dark:text-gray-900 rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center w-6"><Plus size={12}/></button>
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
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-950 font-sans overflow-hidden transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 mb-20 md:mb-0 transition-all duration-300">
        <TopBar />
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-6xl mx-auto h-full flex flex-col">
             {!isDataLoaded ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 animate-pulse flex-col gap-2">
                   <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin"></div>
                   <span className="text-sm font-bold">{t('loading')}</span>
                </div>
             ) : (
                <>
                  {activeTab === 'dashboard' && <DashboardView tasks={tasks} currentDate={currentDate} setCurrentDate={setCurrentDate} />}
                  {activeTab === 'planner' && <PlannerView tasks={tasks} setTasks={setTasks} weekDays={weekDays} />}
                  {activeTab === 'grades' && <GradesView gpaCourses={gpaCourses} courseCriteria={courseCriteria} currentDate={currentDate} archivedSemesters={archivedSemesters} setArchivedSemesters={setArchivedSemesters} />}
                  {activeTab === 'gpa' && <GpaView gpaCourses={gpaCourses} setGpaCourses={setGpaCourses} courseCriteria={courseCriteria} setCourseCriteria={setCourseCriteria} />}
                  {activeTab === 'timetable' && <TimetableView timetable={timetable} setTimetable={setTimetable} periodTimes={periodTimes} setPeriodTimes={setPeriodTimes} />}
                  {activeTab === 'pomodoro' && <PomodoroView studyLogs={studyLogs} setStudyLogs={setStudyLogs} currentDate={currentDate} pomodoroSubjects={pomodoroSubjects} setPomodoroSubjects={setPomodoroSubjects} />}
                  {activeTab === 'ai' && <AIChatView tasks={tasks} grades={grades} timetable={timetable} currentDate={currentDate} gpaCourses={gpaCourses} periodTimes={periodTimes} apiKey={apiKey} handleSaveApiKey={handleSaveApiKey} />}
                  {activeTab === 'links' && <LinksView links={links} setLinks={setLinks} />}
                </>
             )}
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}