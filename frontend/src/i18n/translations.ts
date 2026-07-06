// ── Awen i18n — Interface language translations ────────────────────────────
// Add new languages by adding a new key to each section.
// Backend stub: in future, AI responses will also be in the interface language.

export type AppLanguage =
  | "en" | "de" | "ru" | "kz" | "es" | "fr" | "tr" | "ar" | "zh";

export type LearningLanguage =
  | "de" | "en" | "fr" | "es" | "it" | "ja" | "zh" | "ar" | "ru";

export interface Translation {
  // Nav
  nav_speaking:     string;
  nav_listening:    string;
  nav_vocabulary:   string;
  nav_grammar:      string;
  nav_paragraph:    string;
  nav_translator:   string;
  nav_dashboard:    string;
  nav_progress:     string;
  nav_history:      string;
  nav_examination:  string;
  nav_achievements: string;
  nav_settings:     string;
  // Common
  save:             string;
  cancel:           string;
  test:             string;
  back:             string;
  next:             string;
  skip:             string;
  loading:          string;
  search:           string;
  add:              string;
  delete:           string;
  // Settings
  settings_title:   string;
  settings_api:     string;
  settings_mic:     string;
  settings_theme:   string;
  settings_level:   string;
  settings_lang:    string;
  settings_app_lang:    string;
  settings_learn_lang:  string;
  // Translator
  trans_title:      string;
  trans_placeholder:string;
  trans_lookup:     string;
  trans_meanings:   string;
  trans_synonyms:   string;
  trans_examples:   string;
  trans_add_vocab:  string;
  trans_added:      string;
  // Speaking
  speak_title:      string;
  speak_sub:        string;
  speak_hold:       string;
  speak_release:    string;
  speak_processing: string;
  // Welcome
  welcome_title:    string;
  welcome_sub:      string;
  welcome_start:    string;
}

export const TRANSLATIONS: Record<AppLanguage, Translation> = {
  en: {
    nav_speaking: "Speaking", nav_listening: "Listening", nav_vocabulary: "Vocabulary",
    nav_grammar: "Grammar", nav_paragraph: "Paragraph", nav_translator: "Translator",
    nav_dashboard: "Dashboard", nav_progress: "Progress", nav_history: "History",
    nav_examination: "Examination", nav_achievements: "Achievements", nav_settings: "Settings",
    save: "Save", cancel: "Cancel", test: "Test", back: "Back", next: "Next",
    skip: "Skip", loading: "Loading...", search: "Search", add: "Add", delete: "Delete",
    settings_title: "Settings", settings_api: "API Keys", settings_mic: "Microphone",
    settings_theme: "Theme", settings_level: "Your level", settings_lang: "Language",
    settings_app_lang: "App language", settings_learn_lang: "Learning language",
    trans_title: "Translator", trans_placeholder: "Type a word or sentence...",
    trans_lookup: "Look up", trans_meanings: "Meanings", trans_synonyms: "Synonyms",
    trans_examples: "Examples", trans_add_vocab: "Add to vocabulary", trans_added: "Added!",
    speak_title: "Speaking practice", speak_sub: "Hold to speak · release to get feedback",
    speak_hold: "Hold to speak", speak_release: "Release to send", speak_processing: "Processing...",
    welcome_title: "Welcome to Awen", welcome_sub: "Your AI-powered language tutor",
    welcome_start: "Get started",
  },
  de: {
    nav_speaking: "Sprechen", nav_listening: "Hören", nav_vocabulary: "Vokabular",
    nav_grammar: "Grammatik", nav_paragraph: "Absatz", nav_translator: "Übersetzer",
    nav_dashboard: "Übersicht", nav_progress: "Fortschritt", nav_history: "Verlauf",
    nav_examination: "Prüfung", nav_achievements: "Erfolge", nav_settings: "Einstellungen",
    save: "Speichern", cancel: "Abbrechen", test: "Testen", back: "Zurück", next: "Weiter",
    skip: "Überspringen", loading: "Laden...", search: "Suchen", add: "Hinzufügen", delete: "Löschen",
    settings_title: "Einstellungen", settings_api: "API-Schlüssel", settings_mic: "Mikrofon",
    settings_theme: "Design", settings_level: "Dein Niveau", settings_lang: "Sprache",
    settings_app_lang: "App-Sprache", settings_learn_lang: "Lernsprache",
    trans_title: "Übersetzer", trans_placeholder: "Wort oder Satz eingeben...",
    trans_lookup: "Nachschlagen", trans_meanings: "Bedeutungen", trans_synonyms: "Synonyme",
    trans_examples: "Beispiele", trans_add_vocab: "Zum Vokabular hinzufügen", trans_added: "Hinzugefügt!",
    speak_title: "Sprechübung", speak_sub: "Halten zum Sprechen · loslassen für Feedback",
    speak_hold: "Halten zum Sprechen", speak_release: "Loslassen zum Senden", speak_processing: "Verarbeitung...",
    welcome_title: "Willkommen bei Awen", welcome_sub: "Dein KI-Sprachtutor",
    welcome_start: "Loslegen",
  },
  ru: {
    nav_speaking: "Говорение", nav_listening: "Аудирование", nav_vocabulary: "Словарь",
    nav_grammar: "Грамматика", nav_paragraph: "Текст", nav_translator: "Переводчик",
    nav_dashboard: "Главная", nav_progress: "Прогресс", nav_history: "История",
    nav_examination: "Экзамен", nav_achievements: "Достижения", nav_settings: "Настройки",
    save: "Сохранить", cancel: "Отмена", test: "Тест", back: "Назад", next: "Далее",
    skip: "Пропустить", loading: "Загрузка...", search: "Поиск", add: "Добавить", delete: "Удалить",
    settings_title: "Настройки", settings_api: "API-ключи", settings_mic: "Микрофон",
    settings_theme: "Тема", settings_level: "Ваш уровень", settings_lang: "Язык",
    settings_app_lang: "Язык приложения", settings_learn_lang: "Язык обучения",
    trans_title: "Переводчик", trans_placeholder: "Введите слово или предложение...",
    trans_lookup: "Найти", trans_meanings: "Значения", trans_synonyms: "Синонимы",
    trans_examples: "Примеры", trans_add_vocab: "Добавить в словарь", trans_added: "Добавлено!",
    speak_title: "Практика речи", speak_sub: "Удерживайте для записи · отпустите для отправки",
    speak_hold: "Удерживайте для речи", speak_release: "Отпустите для отправки", speak_processing: "Обработка...",
    welcome_title: "Добро пожаловать в Awen", welcome_sub: "Ваш языковой ИИ-репетитор",
    welcome_start: "Начать",
  },
  kz: {
    nav_speaking: "Сөйлеу", nav_listening: "Тыңдау", nav_vocabulary: "Сөздік",
    nav_grammar: "Грамматика", nav_paragraph: "Мәтін", nav_translator: "Аудармашы",
    nav_dashboard: "Басты бет", nav_progress: "Прогресс", nav_history: "Тарих",
    nav_examination: "Емтихан", nav_achievements: "Жетістіктер", nav_settings: "Параметрлер",
    save: "Сақтау", cancel: "Болдырмау", test: "Тексеру", back: "Артқа", next: "Келесі",
    skip: "Өткізіп жіберу", loading: "Жүктелуде...", search: "Іздеу", add: "Қосу", delete: "Жою",
    settings_title: "Параметрлер", settings_api: "API кілттері", settings_mic: "Микрофон",
    settings_theme: "Тақырып", settings_level: "Деңгейіңіз", settings_lang: "Тіл",
    settings_app_lang: "Қолданба тілі", settings_learn_lang: "Үйрену тілі",
    trans_title: "Аудармашы", trans_placeholder: "Сөз немесе сөйлем енгізіңіз...",
    trans_lookup: "Іздеу", trans_meanings: "Мағыналар", trans_synonyms: "Синонимдер",
    trans_examples: "Мысалдар", trans_add_vocab: "Сөздікке қосу", trans_added: "Қосылды!",
    speak_title: "Сөйлеу жаттығуы", speak_sub: "Сөйлеу үшін ұстаңыз · жіберу үшін жіберіңіз",
    speak_hold: "Сөйлеу үшін ұстаңыз", speak_release: "Жіберу үшін жіберіңіз", speak_processing: "Өңдеу...",
    welcome_title: "Awen-ге қош келдіңіз", welcome_sub: "Сіздің AI тіл мұғаліміңіз",
    welcome_start: "Бастау",
  },
  es: {
    nav_speaking: "Hablar", nav_listening: "Escuchar", nav_vocabulary: "Vocabulario",
    nav_grammar: "Gramática", nav_paragraph: "Párrafo", nav_translator: "Traductor",
    nav_dashboard: "Inicio", nav_progress: "Progreso", nav_history: "Historial",
    nav_examination: "Examen", nav_achievements: "Logros", nav_settings: "Ajustes",
    save: "Guardar", cancel: "Cancelar", test: "Probar", back: "Atrás", next: "Siguiente",
    skip: "Omitir", loading: "Cargando...", search: "Buscar", add: "Añadir", delete: "Eliminar",
    settings_title: "Ajustes", settings_api: "Claves API", settings_mic: "Micrófono",
    settings_theme: "Tema", settings_level: "Tu nivel", settings_lang: "Idioma",
    settings_app_lang: "Idioma de la app", settings_learn_lang: "Idioma de aprendizaje",
    trans_title: "Traductor", trans_placeholder: "Escribe una palabra o frase...",
    trans_lookup: "Buscar", trans_meanings: "Significados", trans_synonyms: "Sinónimos",
    trans_examples: "Ejemplos", trans_add_vocab: "Añadir al vocabulario", trans_added: "¡Añadido!",
    speak_title: "Práctica de habla", speak_sub: "Mantén para hablar · suelta para obtener comentarios",
    speak_hold: "Mantén para hablar", speak_release: "Suelta para enviar", speak_processing: "Procesando...",
    welcome_title: "Bienvenido a Awen", welcome_sub: "Tu tutor de idiomas con IA",
    welcome_start: "Empezar",
  },
  fr: {
    nav_speaking: "Expression", nav_listening: "Écoute", nav_vocabulary: "Vocabulaire",
    nav_grammar: "Grammaire", nav_paragraph: "Paragraphe", nav_translator: "Traducteur",
    nav_dashboard: "Accueil", nav_progress: "Progrès", nav_history: "Historique",
    nav_examination: "Examen", nav_achievements: "Succès", nav_settings: "Paramètres",
    save: "Enregistrer", cancel: "Annuler", test: "Tester", back: "Retour", next: "Suivant",
    skip: "Ignorer", loading: "Chargement...", search: "Rechercher", add: "Ajouter", delete: "Supprimer",
    settings_title: "Paramètres", settings_api: "Clés API", settings_mic: "Microphone",
    settings_theme: "Thème", settings_level: "Votre niveau", settings_lang: "Langue",
    settings_app_lang: "Langue de l'app", settings_learn_lang: "Langue apprise",
    trans_title: "Traducteur", trans_placeholder: "Tapez un mot ou une phrase...",
    trans_lookup: "Rechercher", trans_meanings: "Significations", trans_synonyms: "Synonymes",
    trans_examples: "Exemples", trans_add_vocab: "Ajouter au vocabulaire", trans_added: "Ajouté!",
    speak_title: "Pratique orale", speak_sub: "Maintenez pour parler · relâchez pour le retour",
    speak_hold: "Maintenez pour parler", speak_release: "Relâchez pour envoyer", speak_processing: "Traitement...",
    welcome_title: "Bienvenue sur Awen", welcome_sub: "Votre tuteur de langue IA",
    welcome_start: "Commencer",
  },
  tr: {
    nav_speaking: "Konuşma", nav_listening: "Dinleme", nav_vocabulary: "Kelime",
    nav_grammar: "Dilbilgisi", nav_paragraph: "Paragraf", nav_translator: "Çevirmen",
    nav_dashboard: "Ana Sayfa", nav_progress: "İlerleme", nav_history: "Geçmiş",
    nav_examination: "Sınav", nav_achievements: "Başarılar", nav_settings: "Ayarlar",
    save: "Kaydet", cancel: "İptal", test: "Test", back: "Geri", next: "İleri",
    skip: "Atla", loading: "Yükleniyor...", search: "Ara", add: "Ekle", delete: "Sil",
    settings_title: "Ayarlar", settings_api: "API Anahtarları", settings_mic: "Mikrofon",
    settings_theme: "Tema", settings_level: "Seviyeniz", settings_lang: "Dil",
    settings_app_lang: "Uygulama dili", settings_learn_lang: "Öğrenme dili",
    trans_title: "Çevirmen", trans_placeholder: "Kelime veya cümle girin...",
    trans_lookup: "Ara", trans_meanings: "Anlamlar", trans_synonyms: "Eş anlamlılar",
    trans_examples: "Örnekler", trans_add_vocab: "Kelime listesine ekle", trans_added: "Eklendi!",
    speak_title: "Konuşma pratiği", speak_sub: "Konuşmak için basılı tut · geri bildirim için bırak",
    speak_hold: "Konuşmak için basılı tut", speak_release: "Göndermek için bırak", speak_processing: "İşleniyor...",
    welcome_title: "Awen'e Hoş Geldiniz", welcome_sub: "Yapay zeka dil öğretmeniniz",
    welcome_start: "Başla",
  },
  ar: {
    nav_speaking: "التحدث", nav_listening: "الاستماع", nav_vocabulary: "المفردات",
    nav_grammar: "القواعد", nav_paragraph: "الفقرة", nav_translator: "المترجم",
    nav_dashboard: "الرئيسية", nav_progress: "التقدم", nav_history: "السجل",
    nav_examination: "الامتحان", nav_achievements: "الإنجازات", nav_settings: "الإعدادات",
    save: "حفظ", cancel: "إلغاء", test: "اختبار", back: "رجوع", next: "التالي",
    skip: "تخطي", loading: "جارٍ التحميل...", search: "بحث", add: "إضافة", delete: "حذف",
    settings_title: "الإعدادات", settings_api: "مفاتيح API", settings_mic: "الميكروفون",
    settings_theme: "المظهر", settings_level: "مستواك", settings_lang: "اللغة",
    settings_app_lang: "لغة التطبيق", settings_learn_lang: "لغة التعلم",
    trans_title: "المترجم", trans_placeholder: "اكتب كلمة أو جملة...",
    trans_lookup: "بحث", trans_meanings: "المعاني", trans_synonyms: "المرادفات",
    trans_examples: "أمثلة", trans_add_vocab: "أضف إلى المفردات", trans_added: "تمت الإضافة!",
    speak_title: "ممارسة التحدث", speak_sub: "اضغط مع الاستمرار للتحدث · أفلت للحصول على تغذية راجعة",
    speak_hold: "اضغط مع الاستمرار للتحدث", speak_release: "أفلت للإرسال", speak_processing: "جارٍ المعالجة...",
    welcome_title: "مرحباً بك في Awen", welcome_sub: "معلم اللغة بالذكاء الاصطناعي",
    welcome_start: "ابدأ",
  },
  zh: {
    nav_speaking: "口语", nav_listening: "听力", nav_vocabulary: "词汇",
    nav_grammar: "语法", nav_paragraph: "段落", nav_translator: "翻译",
    nav_dashboard: "主页", nav_progress: "进度", nav_history: "历史",
    nav_examination: "考试", nav_achievements: "成就", nav_settings: "设置",
    save: "保存", cancel: "取消", test: "测试", back: "返回", next: "下一步",
    skip: "跳过", loading: "加载中...", search: "搜索", add: "添加", delete: "删除",
    settings_title: "设置", settings_api: "API密钥", settings_mic: "麦克风",
    settings_theme: "主题", settings_level: "您的级别", settings_lang: "语言",
    settings_app_lang: "应用语言", settings_learn_lang: "学习语言",
    trans_title: "翻译", trans_placeholder: "输入单词或句子...",
    trans_lookup: "查找", trans_meanings: "含义", trans_synonyms: "同义词",
    trans_examples: "例句", trans_add_vocab: "添加到词汇表", trans_added: "已添加!",
    speak_title: "口语练习", speak_sub: "按住说话 · 松开获得反馈",
    speak_hold: "按住说话", speak_release: "松开发送", speak_processing: "处理中...",
    welcome_title: "欢迎使用Awen", welcome_sub: "您的AI语言导师",
    welcome_start: "开始",
  },
};

export const APP_LANGUAGES: { code: AppLanguage; label: string; native: string }[] = [
  { code: "en", label: "English",    native: "English" },
  { code: "de", label: "German",     native: "Deutsch" },
  { code: "ru", label: "Russian",    native: "Русский" },
  { code: "kz", label: "Kazakh",     native: "Қазақша" },
  { code: "es", label: "Spanish",    native: "Español" },
  { code: "fr", label: "French",     native: "Français" },
  { code: "tr", label: "Turkish",    native: "Türkçe" },
  { code: "ar", label: "Arabic",     native: "العربية" },
  { code: "zh", label: "Chinese",    native: "中文" },
];

export const LEARNING_LANGUAGES: { code: LearningLanguage; label: string; flag: string }[] = [
  { code: "de", label: "German",     flag: "🇩🇪" },
  { code: "en", label: "English",    flag: "🇬🇧" },
  { code: "fr", label: "French",     flag: "🇫🇷" },
  { code: "es", label: "Spanish",    flag: "🇪🇸" },
  { code: "it", label: "Italian",    flag: "🇮🇹" },
  { code: "ja", label: "Japanese",   flag: "🇯🇵" },
  { code: "zh", label: "Chinese",    flag: "🇨🇳" },
  { code: "ar", label: "Arabic",     flag: "🇸🇦" },
  { code: "ru", label: "Russian",    flag: "🇷🇺" },
];

export function t(lang: AppLanguage, key: keyof Translation): string {
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS["en"][key];
}