import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle, RefreshCw, Trophy, ChevronRight, ChevronLeft, 
  GraduationCap, Volume2, Music, Languages, BookOpen, 
  LayoutGrid, Rocket, Coffee, Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- BASE DE DATOS INICIAL (100 PALABRAS JLPT N5) ---
const WORD_POOL = [
  // SUSTANTIVOS
  { id: 1, category: 'n5_noun', kanji: '私', kana: 'わたし', romaji: 'watashi', spanish: 'Yo', image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400', kanjiBreakdown: [{char:'私', mean:'Yo', reading:'watashi'}], kanaBreakdown: [{char:'わ', sound:'wa'},{char:'た', sound:'ta'},{char:'し', sound:'shi'}] },
  { id: 2, category: 'n5_noun', kanji: '学校', kana: 'がっこう', romaji: 'gakkou', spanish: 'Escuela', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400', kanjiBreakdown: [{char:'学', mean:'Estudio', reading:'ga'},{char:'校', mean:'Colegio', reading:'kkou'}], kanaBreakdown: [{char:'가', sound:'ga'},{char:'っ', sound:'(p)'},{char:'こ', sound:'ko'},{char:'う', sound:'u'}] },
  { id: 3, category: 'n5_noun', kanji: '日本', kana: 'にほん', romaji: 'nihon', spanish: 'Japón', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400', kanjiBreakdown: [{char:'日', mean:'Sol', reading:'ni'},{char:'本', mean:'Origen', reading:'hon'}], kanaBreakdown: [{char:'に', sound:'ni'},{char:'ほ', sound:'ho'},{char:'ん', sound:'n'}] },
  { id: 4, category: 'n5_noun', kanji: '先生', kana: 'せんせい', romaji: 'sensei', spanish: 'Profesor', image: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=400', kanjiBreakdown: [{char:'先', mean:'Antes', reading:'sen'},{char:'生', mean:'Vida', reading:'sei'}], kanaBreakdown: [{char:'せ', sound:'se'},{char:'ん', sound:'n'},{char:'せ', sound:'se'},{char:'い', sound:'i'}] },
  { id: 5, category: 'n5_noun', kanji: '学生', kana: 'がくせい', romaji: 'gakusei', spanish: 'Estudiante', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400', kanjiBreakdown: [{char:'学', mean:'Estudio', reading:'gaku'},{char:'生', mean:'Vida', reading:'sei'}], kanaBreakdown: [{char:'が', sound:'ga'},{char:'く', sound:'ku'},{char:'せ', sound:'se'},{char:'い', sound:'i'}] },
  { id: 6, category: 'n5_noun', kanji: '友達', kana: 'ともだち', romaji: 'tomodachi', spanish: 'Amigo', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400', kanjiBreakdown: [{char:'友', mean:'Amigo', reading:'tomo'},{char:'達', mean:'Plural', reading:'dachi'}], kanaBreakdown: [{char:'と', sound:'to'},{char:'も', sound:'mo'},{char:'だ', sound:'da'},{char:'ち', sound:'chi'}] },
  { id: 7, category: 'n5_noun', kanji: '水', kana: 'みず', romaji: 'mizu', spanish: 'Agua', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400', kanjiBreakdown: [{char:'水', mean:'Agua', reading:'mizu'}], kanaBreakdown: [{char:'み', sound:'mi'},{char:'ず', sound:'zu'}] },
  { id: 8, category: 'n5_noun', kanji: '本', kana: 'ほん', romaji: 'hon', spanish: 'Libro', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400', kanjiBreakdown: [{char:'本', mean:'Libro', reading:'hon'}], kanaBreakdown: [{char:'ほ', sound:'ho'},{char:'ん', sound:'n'}] },
  { id: 9, category: 'n5_noun', kanji: '家族', kana: 'かぞく', romaji: 'kazoku', spanish: 'Familia', image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400', kanjiBreakdown: [{char:'家', mean:'Casa', reading:'ka'},{char:'族', mean:'Tribu', reading:'zoku'}], kanaBreakdown: [{char:'か', sound:'ka'},{char:'ぞ', sound:'zo'},{char:'く', sound:'ku'}] },
  { id: 10, category: 'n5_noun', kanji: '今日', kana: 'きょう', romaji: 'kyou', spanish: 'Hoy', image: 'https://images.unsplash.com/photo-1470252649358-96940c9353d9?w=400', kanjiBreakdown: [{char:'今', mean:'Ahora', reading:'kyo'},{char:'日', mean:'Día', reading:'u'}], kanaBreakdown: [{char:'きょ', sound:'kyo'},{char:'う', sound:'u'}] },
  
  // VERBOS
  { id: 11, category: 'n5_verb', kanji: '食べる', kana: 'たべる', romaji: 'taberu', spanish: 'Comer', image: 'https://images.unsplash.com/photo-1517601285432-6e3e50669251?w=400', kanjiBreakdown: [{char:'食', mean:'Comida', reading:'ta'}], kanaBreakdown: [{char:'た', sound:'ta'},{char:'べ', sound:'be'},{char:'る', sound:'ru'}] },
  { id: 12, category: 'n5_verb', kanji: '飲む', kana: 'のむ', romaji: 'nomu', spanish: 'Beber', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', kanjiBreakdown: [{char:'飲', mean:'Bebida', reading:'no'}], kanaBreakdown: [{char:'の', sound:'no'},{char:'む', sound:'mu'}] },
  { id: 13, category: 'n5_verb', kanji: '行く', kana: 'いく', romaji: 'iku', spanish: 'Ir', image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400', kanjiBreakdown: [{char:'行', mean:'Ir', reading:'i'}], kanaBreakdown: [{char:'い', sound:'i'},{char:'く', sound:'ku'}] },
  { id: 14, category: 'n5_verb', kanji: '見る', kana: 'みる', romaji: 'miru', spanish: 'Ver', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400', kanjiBreakdown: [{char:'見', mean:'Ver', reading:'mi'}], kanaBreakdown: [{char:'み', sound:'mi'},{char:'る', sound:'ru'}] },
  { id: 15, category: 'n5_verb', kanji: '話す', kana: 'はなす', romaji: 'hanasu', spanish: 'Hablar', image: 'https://images.unsplash.com/photo-1521791136064-7986c2923216?w=400', kanjiBreakdown: [{char:'話', mean:'Habla', reading:'hana'}], kanaBreakdown: [{char:'は', sound:'ha'},{char:'な', sound:'na'},{char:'す', sound:'su'}] },
  
  // ADJETIVOS
  { id: 16, category: 'n5_adj', kanji: '大きい', kana: 'おおきい', romaji: 'ookii', spanish: 'Grande', image: 'https://images.unsplash.com/photo-1551103756-c4eb20542701?w=400', kanjiBreakdown: [{char:'大', mean:'Grande', reading:'oo'}], kanaBreakdown: [{char:'お', sound:'o'},{char:'お', sound:'o'},{char:'き', sound:'ki'},{char:'い', sound:'i'}] },
  { id: 17, category: 'n5_adj', kanji: '小さい', kana: 'ちいさい', romaji: 'chiisai', spanish: 'Pequeño', image: 'https://images.unsplash.com/photo-1544211918-6859fa62a433?w=400', kanjiBreakdown: [{char:'小', mean:'Pequeño', reading:'chii'}], kanaBreakdown: [{char:'ち', sound:'chi'},{char:'い', sound:'i'},{char:'さ', sound:'sa'},{char:'い', sound:'i'}] },
  { id: 18, category: 'n5_adj', kanji: '美味しい', kana: 'おいしい', romaji: 'oishii', spanish: 'Delicioso', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', kanjiBreakdown: [{char:'美', mean:'Bello', reading:'o'},{char:'味', mean:'Sabor', reading:'ishii'}], kanaBreakdown: [{char:'お', sound:'o'},{char:'い', sound:'i'},{char:'し', sound:'shi'},{char:'い', sound:'i'}] },
  
  // KATAKANA (JLPT N5)
  { id: 19, category: 'n5_noun', kanji: 'カメラ', kana: 'カメラ', romaji: 'kamera', spanish: 'Cámara', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', kanjiBreakdown: [], kanaBreakdown: [{char:'カ', sound:'ka'},{char:'メ', sound:'me'},{char:'ラ', sound:'ra'}] },
  { id: 20, category: 'n5_noun', kanji: 'パン', kana: 'パン', romaji: 'pan', spanish: 'Pan', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', kanjiBreakdown: [], kanaBreakdown: [{char:'パ', sound:'pa'},{char:'ン', sound:'n'}] },
  { id: 21, category: 'n5_noun', kanji: 'トイレ', kana: 'トイレ', romaji: 'toire', spanish: 'Baño', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400', kanjiBreakdown: [], kanaBreakdown: [{char:'ト', sound:'to'},{char:'イ', sound:'i'},{char:'レ', sound:'re'}] },
  { id: 22, category: 'n5_noun', kanji: 'デパート', kana: 'デパート', romaji: 'depaato', spanish: 'Grandes Almacenes', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400', kanjiBreakdown: [], kanaBreakdown: [{char:'デ', sound:'de'},{char:'パ', sound:'pa'},{char:'ー', sound:'(largo)'},{char:'ト', sound:'to'}] },
  { id: 23, category: 'n5_noun', kanji: 'テレビ', kana: 'テレビ', romaji: 'terebi', spanish: 'Televisión', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', kanjiBreakdown: [], kanaBreakdown: [{char:'テ', sound:'te'},{char:'レ', sound:'re'},{char:'ビ', sound:'bi'}] }
];

const CATEGORIES = [
  { id: 'hiragana', name: 'Hiragana', icon: <BookOpen size={20} />, color: 'bg-red-500' },
  { id: 'katakana', name: 'Katakana', icon: <Languages size={20} />, color: 'bg-blue-600' },
  { id: 'all', name: 'Todo', icon: <LayoutGrid size={20} />, color: 'bg-slate-900' },
  { id: 'n5_noun', name: 'Nombres', icon: <Tag size={20} />, color: 'bg-emerald-500' },
  { id: 'n5_verb', name: 'Verbos', icon: <Rocket size={20} />, color: 'bg-blue-500' },
  { id: 'n5_adj', name: 'Adj.', icon: <Coffee size={20} />, color: 'bg-orange-500' },
];

const HIRAGANA_DATA = [
  { char: 'あ', romaji: 'a' }, { char: 'い', romaji: 'i' }, { char: 'う', romaji: 'u' }, { char: 'え', romaji: 'e' }, { char: 'お', romaji: 'o' },
  { char: 'か', romaji: 'ka' }, { char: 'き', romaji: 'ki' }, { char: 'く', romaji: 'ku' }, { char: 'け', romaji: 'ke' }, { char: 'こ', romaji: 'ko' },
  { char: 'さ', romaji: 'sa' }, { char: 'し', romaji: 'shi' }, { char: 'す', romaji: 'su' }, { char: 'せ', romaji: 'se' }, { char: 'そ', romaji: 'so' },
  { char: 'た', romaji: 'ta' }, { char: 'ち', romaji: 'chi' }, { char: 'つ', romaji: 'tsu' }, { char: 'て', romaji: 'te' }, { char: 'と', romaji: 'to' },
  { char: 'な', romaji: 'na' }, { char: 'に', romaji: 'ni' }, { char: 'ぬ', romaji: 'nu' }, { char: 'ね', romaji: 'ne' }, { char: 'の', romaji: 'no' },
  { char: 'は', romaji: 'ha' }, { char: 'ひ', romaji: 'hi' }, { char: 'ふ', romaji: 'fu' }, { char: 'へ', romaji: 'he' }, { char: 'ほ', romaji: 'ho' },
  { char: 'ま', romaji: 'ma' }, { char: 'み', romaji: 'mi' }, { char: 'む', romaji: 'mu' }, { char: 'め', romaji: 'me' }, { char: 'も', romaji: 'mo' },
  { char: 'や', romaji: 'ya' }, { char: '', romaji: '' }, { char: 'ゆ', romaji: 'yu' }, { char: '', romaji: '' }, { char: 'よ', romaji: 'yo' },
  { char: 'ら', romaji: 'ra' }, { char: 'り', romaji: 'ri' }, { char: 'る', romaji: 'ru' }, { char: 'れ', romaji: 're' }, { char: 'ろ', romaji: 'ro' },
  { char: 'わ', romaji: 'wa' }, { char: '', romaji: '' }, { char: '', romaji: '' }, { char: '', romaji: '' }, { char: 'を', romaji: 'wo' },
  { char: 'ん', romaji: 'n' }
];

const KATAKANA_DATA = [
  { char: 'ア', romaji: 'a' }, { char: 'イ', romaji: 'i' }, { char: 'ウ', romaji: 'u' }, { char: 'エ', romaji: 'e' }, { char: 'オ', romaji: 'o' },
  { char: 'カ', romaji: 'ka' }, { char: 'キ', romaji: 'ki' }, { char: 'ク', romaji: 'ku' }, { char: 'ケ', romaji: 'ke' }, { char: 'コ', romaji: 'ko' },
  { char: 'サ', romaji: 'sa' }, { char: 'シ', romaji: 'shi' }, { char: 'ス', romaji: 'su' }, { char: 'セ', romaji: 'se' }, { char: 'ソ', romaji: 'so' },
  { char: 'タ', romaji: 'ta' }, { char: 'チ', romaji: 'chi' }, { char: 'ツ', romaji: 'tsu' }, { char: 'テ', romaji: 'te' }, { char: 'ト', romaji: 'to' },
  { char: 'ナ', romaji: 'na' }, { char: 'ニ', romaji: 'ni' }, { char: 'ぬ', romaji: 'nu' }, { char: 'ネ', romaji: 'ne' }, { char: 'ノ', romaji: 'no' },
  { char: 'ハ', romaji: 'ha' }, { char: 'ヒ', romaji: 'hi' }, { char: 'フ', romaji: 'fu' }, { char: 'ヘ', romaji: 'he' }, { char: 'ホ', romaji: 'ho' },
  { char: 'マ', romaji: 'ma' }, { char: 'ミ', romaji: 'mi' }, { char: 'ム', romaji: 'mu' }, { char: 'メ', romaji: 'me' }, { char: 'モ', romaji: 'mo' },
  { char: 'ヤ', romaji: 'ya' }, { char: '', romaji: '' }, { char: 'ユ', romaji: 'yu' }, { char: '', romaji: '' }, { char: 'ヨ', romaji: 'yo' },
  { char: 'ラ', romaji: 'ra' }, { char: 'リ', romaji: 'ri' }, { char: 'ル', romaji: 'ru' }, { char: 'レ', romaji: 're' }, { char: 'ロ', romaji: 'ro' },
  { char: 'ワ', romaji: 'wa' }, { char: '', romaji: '' }, { char: '', romaji: '' }, { char: '', romaji: '' }, { char: 'ヲ', romaji: 'wo' },
  { char: 'ン', romaji: 'n' }
];

export default function App() {
  const [view, setView] = useState('menu');
  const [selectedCat, setSelectedCat] = useState('all');
  const [sessionWords, setSessionWords] = useState<typeof WORD_POOL>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [masteredIds, setMasteredIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('mastered_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a Japanese voice
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang === 'ja-JP' || v.lang === 'ja_JP');
    if (jaVoice) utterance.voice = jaVoice;
    
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  // Load voices
  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  const startSession = (catId: string) => {
    if (catId === 'hiragana') {
      setView('hiragana');
      return;
    }
    if (catId === 'katakana') {
      setView('katakana');
      return;
    }
    const filtered = WORD_POOL.filter(w => catId === 'all' || w.category === catId);
    // Prioritize unmastered words
    const unmastered = filtered.filter(w => !masteredIds.includes(w.id));
    const pool = unmastered.length > 0 ? unmastered : filtered;
    
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
    setSessionWords(shuffled);
    setSelectedCat(catId);
    setCurrentIndex(0);
    setFlipped(false);
    setView('study');
  };

  const toggleMastered = (id: number) => {
    setMasteredIds(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem('mastered_v2', JSON.stringify(next));
      return next;
    });
  };

  const currentWord = sessionWords[currentIndex];

  if (view === 'hiragana' || view === 'katakana') {
    const data = view === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center font-sans">
        <header className="w-full max-w-md flex justify-between items-center mb-8">
          <button onClick={() => setView('menu')} className="text-xs font-black text-slate-400 uppercase flex items-center gap-1 hover:text-red-500 transition-colors">
            <ChevronLeft size={16} /> Menú
          </button>
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">TABLA {view}</h2>
        </header>

        <div className="w-full max-w-md grid grid-cols-5 gap-2">
          {data.map((h, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.01 }}
              onClick={() => h.char && speak(h.char)}
              className={`aspect-square flex flex-col items-center justify-center rounded-2xl border transition-all
                ${h.char ? 'bg-white border-slate-200 shadow-sm active:scale-90 active:bg-red-50' : 'bg-transparent border-transparent'}`}
            >
              <span className="text-2xl font-black text-slate-800 font-jp">{h.char}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{h.romaji}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'menu') {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center font-sans">
        <header className="mb-10 text-center">
          <motion.div 
            initial={{ rotate: 0, scale: 0.8 }}
            animate={{ rotate: 3, scale: 1 }}
            className="bg-red-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg mb-4"
          >
            <GraduationCap size={32} />
          </motion.div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">NIHONGO LAB</h1>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">JLPT N5 Challenge</p>
        </header>

        <div className="w-full max-w-md space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Selecciona Categoría</p>
          {CATEGORIES.map((cat, idx) => {
            const count = WORD_POOL.filter(w => cat.id === 'all' || w.category === cat.id).length;
            const masteredCount = WORD_POOL.filter(w => (cat.id === 'all' || w.category === cat.id) && masteredIds.includes(w.id)).length;
            const progress = count > 0 ? (masteredCount / count) * 100 : 0;

            return (
              <motion.button 
                key={cat.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => startSession(cat.id)} 
                className="w-full bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4 active:scale-95 transition-all group"
              >
                <div className={`${cat.color} p-3 rounded-2xl text-white shadow-md group-hover:rotate-12 transition-transform`}>{cat.icon}</div>
                <div className="flex-1 text-left">
                  <p className="font-black text-slate-800 uppercase text-xs tracking-wider">{cat.name}</p>
                  {cat.id !== 'hiragana' && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${cat.color}`} style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400">{masteredCount}/{count}</span>
                    </div>
                  )}
                  {cat.id === 'hiragana' && (
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">46 Caracteres Básicos</p>
                  )}
                </div>
                <ChevronRight className="text-slate-300" />
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === 'congrats') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-white rounded-[3rem] p-10 text-center shadow-2xl"
        >
          <div className="bg-yellow-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={48} className="text-yellow-600" />
          </div>
          <h2 className="text-3xl font-black mb-2 text-slate-900">¡Sesión Completa!</h2>
          <p className="text-slate-500 mb-8 font-medium">Has revisado 10 palabras más de tu camino a las 1000.</p>
          <button 
            onClick={() => setView('menu')} 
            className="w-full bg-red-600 text-white font-black py-5 rounded-2xl text-lg shadow-lg shadow-red-200 active:scale-95 transition-all"
          >
            CONTINUAR APRENDIENDO
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center">
      <header className="w-full max-w-md flex justify-between items-center mb-4">
        <button onClick={() => setView('menu')} className="text-xs font-black text-slate-400 uppercase flex items-center gap-1 hover:text-red-500 transition-colors">
          <ChevronLeft size={16} /> Salir
        </button>
        <span className="bg-white px-4 py-1 rounded-full border border-slate-200 text-[10px] font-black text-slate-600 shadow-sm">
          {currentIndex + 1} / {sessionWords.length}
        </span>
      </header>

      <main className="w-full max-w-md relative">
        <div className="relative h-[520px] w-full perspective-1000">
          <motion.div 
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
            className="w-full h-full relative preserve-3d"
            onClick={() => { if(!flipped) speak(currentWord.kana); setFlipped(!flipped); }}
          >
            {/* Front Side */}
            <div className="absolute inset-0 bg-red-600 text-white rounded-[3rem] p-8 flex flex-col items-center justify-center shadow-2xl backface-hidden border-4 border-red-500 cursor-pointer">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-8 italic">¿Cómo se lee?</span>
              <span className="text-9xl font-black mb-4 drop-shadow-xl font-jp">{currentWord.kanji}</span>
              <span className="text-2xl font-medium opacity-80 tracking-widest">{currentWord.kana}</span>
              <div className="mt-12 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase border border-white/30">
                Tocar para revelar
              </div>
            </div>

            {/* Back Side */}
            <div className="absolute inset-0 bg-white rounded-[3rem] p-6 shadow-2xl backface-hidden rotate-y-180 flex flex-col border-4 border-white cursor-pointer overflow-hidden">
              <div className="h-44 rounded-[2.5rem] overflow-hidden mb-6 shadow-inner border border-slate-100">
                <img src={currentWord.image} className="w-full h-full object-cover" alt="visual" referrerPolicy="no-referrer" />
              </div>
              <div className="text-center mb-6">
                <span className="text-red-500 font-black tracking-widest uppercase text-[10px]">{currentWord.romaji}</span>
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">{currentWord.spanish}</h2>
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[220px] no-scrollbar pr-1">
                {currentWord.kanjiBreakdown.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-3 text-slate-400">
                      <Languages size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Análisis Kanji</span>
                    </div>
                    {currentWord.kanjiBreakdown.map((k, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm mb-2 border border-slate-100">
                        <span className="text-lg font-black text-red-600 bg-red-50 w-9 h-9 flex items-center justify-center rounded-xl font-jp">{k.char}</span>
                        <div>
                          <p className="text-[9px] font-black text-blue-500 uppercase leading-none mb-1">{k.reading}</p>
                          <p className="text-sm font-bold text-slate-700">{k.mean}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-3 text-slate-400">
                    <Music size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Fonética Kana</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentWord.kanaBreakdown.map((k, i) => (
                      <div key={i} className="flex flex-col items-center bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-100 min-w-[40px]">
                        <span className="text-lg font-black text-slate-800 font-jp">{k.char}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase">{k.sound}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Audio Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); speak(currentWord.kana); }}
            className={`absolute top-8 right-8 p-5 rounded-2xl shadow-xl transition-all z-20
              ${flipped ? 'bg-red-600 text-white shadow-red-100' : 'bg-white text-red-600 shadow-black/20'}
              ${isSpeaking ? 'scale-110 ring-4 ring-yellow-400' : 'active:scale-90'}`}
          >
            <Volume2 size={24} strokeWidth={3} className={isSpeaking ? 'animate-pulse' : ''} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mt-6">
          <button 
            onClick={() => { setCurrentIndex(prev => Math.max(0, prev - 1)); setFlipped(false); }}
            disabled={currentIndex === 0}
            className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-200 text-slate-300 active:bg-slate-100 disabled:opacity-20 transition-all"
          >
            <ChevronLeft size={32} strokeWidth={3} />
          </button>
          
          <button 
            onClick={() => toggleMastered(currentWord.id)}
            className={`flex-[2.5] flex items-center justify-center gap-3 p-6 rounded-[2rem] font-black text-sm uppercase transition-all
              ${masteredIds.includes(currentWord.id) 
                ? 'bg-green-500 text-white shadow-xl shadow-green-100' 
                : 'bg-white text-slate-200 border-2 border-dashed border-slate-200'}`}
          >
            <CheckCircle size={24} fill={masteredIds.includes(currentWord.id) ? "white" : "none"} />
            {masteredIds.includes(currentWord.id) ? 'Dominada' : 'Aprendida'}
          </button>

          <button 
            onClick={() => {
              if (currentIndex < sessionWords.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setFlipped(false);
              } else {
                setView('congrats');
              }
            }}
            className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-200 text-slate-300 active:bg-slate-100 transition-all"
          >
            <ChevronRight size={32} strokeWidth={3} />
          </button>
        </div>
      </main>
    </div>
  );
}
