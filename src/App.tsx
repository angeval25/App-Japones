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
  { id: 5, category: 'n5_noun', kanji: '学生', kana: 'がくせい', romaji: 'gakusei', spanish: 'Estudiante', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400', kanjiBreakdown: [{char:'学', mean:'Estudio', reading:'gaku'},{char:'生', mean:'Vida', reading:'sei'}], kanaBreakdown: [{char:'가', sound:'ga'},{char:'く', sound:'ku'},{char:'せ', sound:'se'},{char:'い', sound:'i'}] },
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
  { id: 23, category: 'n5_noun', kanji: 'テレビ', kana: 'テレビ', romaji: 'terebi', spanish: 'Televisión', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', kanjiBreakdown: [], kanaBreakdown: [{char:'テ', sound:'te'},{char:'レ', sound:'re'},{char:'ビ', sound:'bi'}] },
  { id: 24, category: 'n5_noun', kanji: '車', kana: 'くるま', romaji: 'kuruma', spanish: 'Coche', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400', kanjiBreakdown: [{char:'車', mean:'Vehículo', reading:'kuruma'}], kanaBreakdown: [{char:'く', sound:'ku'},{char:'る', sound:'ru'},{char:'ま', sound:'ma'}] },
  { id: 25, category: 'n5_noun', kanji: '電車', kana: 'でんしゃ', romaji: 'densha', spanish: 'Tren', image: 'https://images.unsplash.com/photo-1474487022159-4a49a99d1dd8?w=400', kanjiBreakdown: [{char:'電', mean:'Electricidad', reading:'den'},{char:'車', mean:'Vehículo', reading:'sha'}], kanaBreakdown: [{char:'で', sound:'de'},{char:'ん', sound:'n'},{char:'しゃ', sound:'sha'}] },
  { id: 26, category: 'n5_noun', kanji: '飛行機', kana: 'ひこうき', romaji: 'hikouki', spanish: 'Avión', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109c713?w=400', kanjiBreakdown: [{char:'飛', mean:'Volar', reading:'hi'},{char:'行', mean:'Ir', reading:'kou'},{char:'機', mean:'Máquina', reading:'ki'}], kanaBreakdown: [{char:'ひ', sound:'hi'},{char:'こ', sound:'ko'},{char:'う', sound:'u'},{char:'き', sound:'ki'}] },
  { id: 27, category: 'n5_noun', kanji: '部屋', kana: 'へや', romaji: 'heya', spanish: 'Habitación', image: 'https://images.unsplash.com/photo-1522771739844-649f6d175d97?w=400', kanjiBreakdown: [{char:'部', mean:'Parte', reading:'he'},{char:'屋', mean:'Tienda/Techo', reading:'ya'}], kanaBreakdown: [{char:'へ', sound:'he'},{char:'や', sound:'ya'}] },
  { id: 28, category: 'n5_noun', kanji: '椅子', kana: 'いす', romaji: 'isu', spanish: 'Silla', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400', kanjiBreakdown: [{char:'椅', mean:'Silla', reading:'i'},{char:'子', mean:'Niño/Sufijo', reading:'su'}], kanaBreakdown: [{char:'い', sound:'i'},{char:'す', sound:'su'}] },
  { id: 29, category: 'n5_noun', kanji: '机', kana: 'つくえ', romaji: 'tsukue', spanish: 'Escritorio', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400', kanjiBreakdown: [{char:'机', mean:'Escritorio', reading:'tsukue'}], kanaBreakdown: [{char:'つ', sound:'tsu'},{char:'く', sound:'ku'},{char:'え', sound:'e'}] },
  { id: 30, category: 'n5_noun', kanji: '窓', kana: 'まど', romaji: 'mado', spanish: 'Ventana', image: 'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?w=400', kanjiBreakdown: [{char:'窓', mean:'Ventana', reading:'mado'}], kanaBreakdown: [{char:'ま', sound:'ma'},{char:'ど', sound:'do'}] },
  { id: 31, category: 'n5_noun', kanji: 'ドア', kana: 'ドア', romaji: 'doa', spanish: 'Puerta', image: 'https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?w=400', kanjiBreakdown: [], kanaBreakdown: [{char:'ド', sound:'do'},{char:'ア', sound:'a'}] },
  { id: 32, category: 'n5_noun', kanji: '料理', kana: 'りょうり', romaji: 'ryouri', spanish: 'Cocina', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400', kanjiBreakdown: [{char:'料', mean:'Ingrediente', reading:'ryou'},{char:'理', mean:'Lógica', reading:'ri'}], kanaBreakdown: [{char:'りょ', sound:'ryo'},{char:'う', sound:'u'},{char:'り', sound:'ri'}] },
  { id: 33, category: 'n5_noun', kanji: 'お茶', kana: 'おちゃ', romaji: 'ocha', spanish: 'Té', image: 'https://images.unsplash.com/photo-1544787210-282744863035?w=400', kanjiBreakdown: [{char:'茶', mean:'Té', reading:'cha'}], kanaBreakdown: [{char:'お', sound:'o'},{char:'ちゃ', sound:'cha'}] },
  { id: 34, category: 'n5_noun', kanji: 'お酒', kana: 'おさけ', romaji: 'osake', spanish: 'Sake/Alcohol', image: 'https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?w=400', kanjiBreakdown: [{char:'酒', mean:'Sake', reading:'sake'}], kanaBreakdown: [{char:'お', sound:'o'},{char:'さ', sound:'sa'},{char:'け', sound:'ke'}] },
  { id: 35, category: 'n5_noun', kanji: '卵', kana: 'たまご', romaji: 'tamago', spanish: 'Huevo', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400', kanjiBreakdown: [{char:'卵', mean:'Huevo', reading:'tamago'}], kanaBreakdown: [{char:'た', sound:'ta'},{char:'ま', sound:'ma'},{char:'ご', sound:'go'}] },
  { id: 36, category: 'n5_noun', kanji: '肉', kana: 'にく', romaji: 'niku', spanish: 'Carne', image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=400', kanjiBreakdown: [{char:'肉', mean:'Carne', reading:'niku'}], kanaBreakdown: [{char:'に', sound:'ni'},{char:'く', sound:'ku'}] },
  { id: 37, category: 'n5_noun', kanji: '魚', kana: 'さかな', romaji: 'sakana', spanish: 'Pescado', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', kanjiBreakdown: [{char:'魚', mean:'Pescado', reading:'sakana'}], kanaBreakdown: [{char:'さ', sound:'sa'},{char:'か', sound:'ka'},{char:'な', sound:'na'}] },
  { id: 38, category: 'n5_noun', kanji: '野菜', kana: 'やさい', romaji: 'yasai', spanish: 'Verdura', image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1233c?w=400', kanjiBreakdown: [{char:'野', mean:'Campo', reading:'ya'},{char:'菜', mean:'Vegetal', reading:'sai'}], kanaBreakdown: [{char:'や', sound:'ya'},{char:'さ', sound:'sa'},{char:'い', sound:'i'}] },
  { id: 39, category: 'n5_noun', kanji: '果物', kana: 'くだもの', romaji: 'kudamono', spanish: 'Fruta', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400', kanjiBreakdown: [{char:'果', mean:'Fruto', reading:'kuda'},{char:'物', mean:'Cosa', reading:'mono'}], kanaBreakdown: [{char:'く', sound:'ku'},{char:'だ', sound:'da'},{char:'も', sound:'mo'},{char:'の', sound:'no'}] },
  { id: 40, category: 'n5_noun', kanji: '砂糖', kana: 'さとう', romaji: 'satou', spanish: 'Azúcar', image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=400', kanjiBreakdown: [{char:'砂', mean:'Arena', reading:'sa'},{char:'糖', mean:'Azúcar', reading:'tou'}], kanaBreakdown: [{char:'さ', sound:'sa'},{char:'と', sound:'to'},{char:'う', sound:'u'}] },
  { id: 41, category: 'n5_noun', kanji: '塩', kana: 'しお', romaji: 'shio', spanish: 'Sal', image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400', kanjiBreakdown: [{char:'塩', mean:'Sal', reading:'shio'}], kanaBreakdown: [{char:'し', sound:'shi'},{char:'お', sound:'o'}] },
  { id: 42, category: 'n5_noun', kanji: '醤油', kana: 'しょうゆ', romaji: 'shouyu', spanish: 'Salsa de soja', image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400', kanjiBreakdown: [{char:'醤', mean:'Salsa', reading:'shou'},{char:'油', mean:'Aceite', reading:'yu'}], kanaBreakdown: [{char:'しょ', sound:'sho'},{char:'う', sound:'u'},{char:'ゆ', sound:'yu'}] },
  { id: 43, category: 'n5_noun', kanji: '箸', kana: 'はし', romaji: 'hashi', spanish: 'Palillos', image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400', kanjiBreakdown: [{char:'箸', mean:'Palillos', reading:'hashi'}], kanaBreakdown: [{char:'は', sound:'ha'},{char:'し', sound:'shi'}] },
  { id: 44, category: 'n5_noun', kanji: '茶碗', kana: 'ちゃわん', romaji: 'chawan', spanish: 'Cuenco', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400', kanjiBreakdown: [{char:'茶', mean:'Té', reading:'cha'},{char:'碗', mean:'Cuenco', reading:'wan'}], kanaBreakdown: [{char:'ちゃ', sound:'cha'},{char:'わ', sound:'wa'},{char:'ん', sound:'n'}] },
  { id: 45, category: 'n5_noun', kanji: 'コップ', kana: 'コップ', romaji: 'koppu', spanish: 'Vaso', image: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400', kanjiBreakdown: [], kanaBreakdown: [{char:'コ', sound:'ko'},{char:'ッ', sound:'(p)'},{char:'プ', sound:'pu'}] },
  { id: 46, category: 'n5_noun', kanji: '皿', kana: 'さら', romaji: 'sara', spanish: 'Plato', image: 'https://images.unsplash.com/photo-1577906030551-59758a512461?w=400', kanjiBreakdown: [{char:'皿', mean:'Plato', reading:'sara'}], kanaBreakdown: [{char:'さ', sound:'sa'},{char:'ら', sound:'ra'}] },
  { id: 47, category: 'n5_noun', kanji: 'ナイフ', kana: 'ナイフ', romaji: 'naifu', spanish: 'Cuchillo', image: 'https://images.unsplash.com/photo-1594051664297-66572a1bbd4e?w=400', kanjiBreakdown: [], kanaBreakdown: [{char:'ナ', sound:'na'},{char:'イ', sound:'i'},{char:'フ', sound:'fu'}] },
  { id: 48, category: 'n5_noun', kanji: 'フォーク', kana: 'フォーク', romaji: 'fooku', spanish: 'Tenedor', image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400', kanjiBreakdown: [], kanaBreakdown: [{char:'フォ', sound:'fo'},{char:'ー', sound:'(largo)'},{char:'ク', sound:'ku'}] },
  { id: 49, category: 'n5_noun', kanji: 'スプーン', kana: 'スプーン', romaji: 'supuun', spanish: 'Cuchara', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', kanjiBreakdown: [], kanaBreakdown: [{char:'ス', sound:'su'},{char:'プ', sound:'pu'},{char:'ー', sound:'(largo)'},{char:'ン', sound:'n'}] },
  { id: 50, category: 'n5_noun', kanji: '勉強', kana: 'べんきょう', romaji: 'benkyou', spanish: 'Estudio', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400', kanjiBreakdown: [{char:'勉', mean:'Esfuerzo', reading:'ben'},{char:'強', mean:'Fuerte', reading:'kyou'}], kanaBreakdown: [{char:'べ', sound:'be'},{char:'ん', sound:'n'},{char:'きょ', sound:'kyo'},{char:'う', sound:'u'}] },
  { id: 51, category: 'n5_noun', kanji: '仕事', kana: 'しごと', romaji: 'shigoto', spanish: 'Trabajo', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400', kanjiBreakdown: [{char:'仕', mean:'Servir', reading:'shi'},{char:'事', mean:'Cosa', reading:'goto'}], kanaBreakdown: [{char:'し', sound:'shi'},{char:'ご', sound:'go'},{char:'と', sound:'to'}] },
  { id: 52, category: 'n5_noun', kanji: '休み', kana: 'やすみ', romaji: 'yasumi', spanish: 'Descanso', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', kanjiBreakdown: [{char:'休', mean:'Descansar', reading:'yasu'}], kanaBreakdown: [{char:'や', sound:'ya'},{char:'す', sound:'su'},{char:'み', sound:'mi'}] },
  { id: 53, category: 'n5_noun', kanji: '旅行', kana: 'りょこう', romaji: 'ryokou', spanish: 'Viaje', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400', kanjiBreakdown: [{char:'旅', mean:'Viaje', reading:'ryo'},{char:'行', mean:'Ir', reading:'kou'}], kanaBreakdown: [{char:'りょ', sound:'ryo'},{char:'う', sound:'u'},{char:'こ', sound:'ko'},{char:'う', sound:'u'}] },
  { id: 54, category: 'n5_noun', kanji: '散歩', kana: 'さんぽ', romaji: 'sanpo', spanish: 'Paseo', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400', kanjiBreakdown: [{char:'散', mean:'Esparcir', reading:'san'},{char:'歩', mean:'Caminar', reading:'po'}], kanaBreakdown: [{char:'さ', sound:'sa'},{char:'ん', sound:'n'},{char:'ぽ', sound:'po'}] },
  { id: 55, category: 'n5_noun', kanji: '買い物', kana: 'かいもの', romaji: 'kaimono', spanish: 'Compras', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400', kanjiBreakdown: [{char:'買', mean:'Comprar', reading:'kai'},{char:'物', mean:'Cosa', reading:'mono'}], kanaBreakdown: [{char:'か', sound:'ka'},{char:'い', sound:'i'},{char:'も', sound:'mo'},{char:'の', sound:'no'}] },
  { id: 56, category: 'n5_noun', kanji: '映画', kana: 'えいが', romaji: 'eiga', spanish: 'Película', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400', kanjiBreakdown: [{char:'映', mean:'Reflejar', reading:'ei'},{char:'画', mean:'Imagen', reading:'ga'}], kanaBreakdown: [{char:'え', sound:'e'},{char:'い', sound:'i'},{char:'が', sound:'ga'}] },
  { id: 57, category: 'n5_noun', kanji: '音楽', kana: 'おんがく', romaji: 'ongaku', spanish: 'Música', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', kanjiBreakdown: [{char:'音', mean:'Sonido', reading:'on'},{char:'楽', mean:'Música/Placer', reading:'gaku'}], kanaBreakdown: [{char:'お', sound:'o'},{char:'ん', sound:'n'},{char:'が', sound:'ga'},{char:'く', sound:'ku'}] },
  { id: 58, category: 'n5_noun', kanji: '写真', kana: 'しゃしん', romaji: 'shashin', spanish: 'Foto', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', kanjiBreakdown: [{char:'写', mean:'Copiar', reading:'sha'},{char:'真', mean:'Verdad', reading:'shin'}], kanaBreakdown: [{char:'しゃ', sound:'sha'},{char:'し', sound:'si'},{char:'ん', sound:'n'}] },
  { id: 59, category: 'n5_noun', kanji: '手紙', kana: 'てがみ', romaji: 'tegami', spanish: 'Carta', image: 'https://images.unsplash.com/photo-1516414917003-4ecf47f0e70b?w=400', kanjiBreakdown: [{char:'手', mean:'Mano', reading:'te'},{char:'紙', mean:'Papel', reading:'gami'}], kanaBreakdown: [{char:'て', sound:'te'},{char:'が', sound:'ga'},{char:'み', sound:'mi'}] },
  { id: 60, category: 'n5_noun', kanji: '電話', kana: 'でんわ', romaji: 'denwa', spanish: 'Teléfono', image: 'https://images.unsplash.com/photo-1520923179274-136762a2b17e?w=400', kanjiBreakdown: [{char:'電', mean:'Electricidad', reading:'den'},{char:'話', mean:'Habla', reading:'wa'}], kanaBreakdown: [{char:'で', sound:'de'},{char:'ん', sound:'n'},{char:'わ', sound:'wa'}] },
  { id: 61, category: 'n5_noun', kanji: '郵便局', kana: 'ゆうびんきょく', romaji: 'yuubinkyoku', spanish: 'Oficina de correos', image: 'https://images.unsplash.com/photo-1566847438217-76e82d383f84?w=400', kanjiBreakdown: [{char:'郵', mean:'Correo', reading:'yuu'},{char:'便', mean:'Conveniente', reading:'bin'},{char:'局', mean:'Oficina', reading:'kyoku'}], kanaBreakdown: [{char:'ゆ', sound:'yu'},{char:'う', sound:'u'},{char:'び', sound:'bi'},{char:'ん', sound:'n'},{char:'きょ', sound:'kyo'},{char:'く', sound:'ku'}] },
  { id: 62, category: 'n5_noun', kanji: '銀行', kana: 'ぎんこう', romaji: 'ginkou', spanish: 'Banco', image: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=400', kanjiBreakdown: [{char:'銀', mean:'Plata', reading:'gin'},{char:'行', mean:'Ir', reading:'kou'}], kanaBreakdown: [{char:'ぎ', sound:'gi'},{char:'ん', sound:'n'},{char:'こ', sound:'ko'},{char:'う', sound:'u'}] },
  { id: 63, category: 'n5_noun', kanji: '病院', kana: 'びょういん', romaji: 'byouin', spanish: 'Hospital', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400', kanjiBreakdown: [{char:'病', mean:'Enfermedad', reading:'byou'},{char:'院', mean:'Institución', reading:'in'}], kanaBreakdown: [{char:'びょ', sound:'byo'},{char:'う', sound:'u'},{char:'い', sound:'in'},{char:'ん', sound:'n'}] },
  { id: 64, category: 'n5_noun', kanji: '公園', kana: 'こうえん', romaji: 'kouen', spanish: 'Parque', image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=400', kanjiBreakdown: [{char:'公', mean:'Público', reading:'kou'},{char:'園', mean:'Jardín', reading:'en'}], kanaBreakdown: [{char:'こ', sound:'ko'},{char:'う', sound:'u'},{char:'え', sound:'e'},{char:'ん', sound:'n'}] },
  { id: 65, category: 'n5_noun', kanji: '動物園', kana: 'どうぶつえん', romaji: 'doubutsuen', spanish: 'Zoo', image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=400', kanjiBreakdown: [{char:'動', mean:'Mover', reading:'dou'},{char:'物', mean:'Cosa', reading:'butsu'},{char:'園', mean:'Jardín', reading:'en'}], kanaBreakdown: [{char:'ど', sound:'do'},{char:'う', sound:'u'},{char:'ぶ', sound:'bu'},{char:'つ', sound:'tsu'},{char:'え', sound:'e'},{char:'ん', sound:'n'}] },
  { id: 66, category: 'n5_noun', kanji: '図書館', kana: 'としょかん', romaji: 'toshokan', spanish: 'Biblioteca', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400', kanjiBreakdown: [{char:'図', mean:'Mapa/Dibujo', reading:'to'},{char:'書', mean:'Escribir', reading:'sho'},{char:'館', mean:'Edificio', reading:'kan'}], kanaBreakdown: [{char:'と', sound:'to'},{char:'しょ', sound:'sho'},{char:'か', sound:'ka'},{char:'ん', sound:'n'}] },
  { id: 67, category: 'n5_noun', kanji: '映画館', kana: 'えいがかん', romaji: 'eigakan', spanish: 'Cine', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400', kanjiBreakdown: [{char:'映', mean:'Reflejar', reading:'ei'},{char:'画', mean:'Imagen', reading:'ga'},{char:'館', mean:'Edificio', reading:'kan'}], kanaBreakdown: [{char:'え', sound:'e'},{char:'い', sound:'i'},{char:'が', sound:'ga'},{char:'か', sound:'ka'},{char:'ん', sound:'n'}] },
  { id: 68, category: 'n5_noun', kanji: '喫茶店', kana: 'きっさてん', romaji: 'kissaten', spanish: 'Cafetería', image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400', kanjiBreakdown: [{char:'喫', mean:'Consumir', reading:'ki'},{char:'茶', mean:'Té', reading:'ssa'},{char:'店', mean:'Tienda', reading:'ten'}], kanaBreakdown: [{char:'き', sound:'ki'},{char:'っ', sound:'(s)'},{char:'さ', sound:'sa'},{char:'て', sound:'te'},{char:'ん', sound:'n'}] },
  { id: 69, category: 'n5_noun', kanji: 'レストラン', kana: 'レストラン', romaji: 'resutoran', spanish: 'Restaurante', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', kanjiBreakdown: [], kanaBreakdown: [{char:'レ', sound:'re'},{char:'ス', sound:'su'},{char:'ト', sound:'to'},{char:'ラ', sound:'ra'},{char:'ン', sound:'n'}] },
  { id: 70, category: 'n5_noun', kanji: 'ホテル', kana: 'ホテル', romaji: 'hoteru', spanish: 'Hotel', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', kanjiBreakdown: [], kanaBreakdown: [{char:'ホ', sound:'ho'},{char:'テ', sound:'te'},{char:'ル', sound:'ru'}] },
  { id: 71, category: 'n5_noun', kanji: '旅館', kana: 'りょかん', romaji: 'ryokan', spanish: 'Ryokan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400', kanjiBreakdown: [{char:'旅', mean:'Viaje', reading:'ryo'},{char:'館', mean:'Edificio', reading:'kan'}], kanaBreakdown: [{char:'りょ', sound:'ryo'},{char:'か', sound:'ka'},{char:'ん', sound:'n'}] },
  { id: 72, category: 'n5_noun', kanji: '空港', kana: 'くうこう', romaji: 'kuukou', spanish: 'Aeropuerto', image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=400', kanjiBreakdown: [{char:'空', mean:'Cielo', reading:'kuu'},{char:'港', mean:'Puerto', reading:'kou'}], kanaBreakdown: [{char:'く', sound:'ku'},{char:'う', sound:'u'},{char:'こ', sound:'ko'},{char:'う', sound:'u'}] },
  { id: 73, category: 'n5_noun', kanji: '駅', kana: 'えき', romaji: 'eki', spanish: 'Estación', image: 'https://images.unsplash.com/photo-1474487022159-4a49a99d1dd8?w=400', kanjiBreakdown: [{char:'駅', mean:'Estación', reading:'eki'}], kanaBreakdown: [{char:'え', sound:'e'},{char:'き', sound:'ki'}] }
];

const CATEGORIES = [
  { id: 'alfabeto', name: 'Alfabeto', icon: <BookOpen size={20} />, color: 'bg-red-500' },
  { id: 'all', name: 'Todo', icon: <LayoutGrid size={20} />, color: 'bg-slate-900' },
  { id: 'n5_noun', name: 'Nombres', icon: <Tag size={20} />, color: 'bg-emerald-500' },
  { id: 'n5_verb', name: 'Verbos', icon: <Rocket size={20} />, color: 'bg-blue-500' },
  { id: 'n5_adj', name: 'Adj.', icon: <Coffee size={20} />, color: 'bg-orange-500' },
];

const ALFABETO: Record<string, { char: string; romaji: string }[]> = {
  hiragana: [
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
    { char: 'ん', romaji: 'n' },
    // Dakuten (Tenten)
    { char: 'が', romaji: 'ga' }, { char: 'ぎ', romaji: 'gi' }, { char: 'ぐ', romaji: 'gu' }, { char: 'げ', romaji: 'ge' }, { char: 'ご', romaji: 'go' },
    { char: 'ざ', romaji: 'za' }, { char: 'じ', romaji: 'ji' }, { char: 'ず', romaji: 'zu' }, { char: 'ぜ', romaji: 'ze' }, { char: 'ぞ', romaji: 'zo' },
    { char: 'だ', romaji: 'da' }, { char: 'ぢ', romaji: 'ji' }, { char: 'づ', romaji: 'zu' }, { char: 'で', romaji: 'de' }, { char: 'ど', romaji: 'do' },
    { char: 'ば', romaji: 'ba' }, { char: 'び', romaji: 'bi' }, { char: 'ぶ', romaji: 'bu' }, { char: 'べ', romaji: 'be' }, { char: 'ぼ', romaji: 'bo' },
    // Handakuten (Maru)
    { char: 'ぱ', romaji: 'pa' }, { char: 'ぴ', romaji: 'pi' }, { char: 'ぷ', romaji: 'pu' }, { char: 'ぺ', romaji: 'pe' }, { char: 'ぽ', romaji: 'po' }
  ],
  katakana: [
    { char: 'ア', romaji: 'a' }, { char: 'イ', romaji: 'i' }, { char: 'ウ', romaji: 'u' }, { char: 'エ', romaji: 'e' }, { char: 'オ', romaji: 'o' },
    { char: 'カ', romaji: 'ka' }, { char: 'キ', romaji: 'ki' }, { char: 'ク', romaji: 'ku' }, { char: 'ケ', romaji: 'ke' }, { char: 'コ', romaji: 'ko' },
    { char: 'サ', romaji: 'sa' }, { char: 'シ', romaji: 'shi' }, { char: 'ス', romaji: 'su' }, { char: 'セ', romaji: 'se' }, { char: 'ソ', romaji: 'so' },
    { char: 'タ', romaji: 'ta' }, { char: 'チ', romaji: 'chi' }, { char: 'ツ', romaji: 'tsu' }, { char: 'テ', romaji: 'te' }, { char: 'ト', romaji: 'to' },
    { char: 'ナ', romaji: 'na' }, { char: 'ニ', romaji: 'ni' }, { char: 'ぬ', romaji: 'nu' }, { char: 'ネ', romaji: 'ne' }, { char: 'ノ', romaji: 'no' },
    { char: 'ハ', romaji: 'ha' }, { char: 'ヒ', romaji: 'hi' }, { char: 'フ', romaji: 'fu' }, { char: 'ヘ', romaji: 'he' }, { char: 'ホ', romaji: 'ho' },
    { char: 'マ', romaji: 'ma' }, { char: 'ミ', romaji: 'mi' }, { char: 'ム', romaji: 'mu' }, { char: 'メ', romaji: 'me' }, { char: 'モ', romaji: 'mo' },
    { char: 'ヤ', romaji: 'ya' }, { char: '', romaji: '' }, { char: 'ユ', romaji: 'yu' }, { char: '', romaji: '' }, { char: 'ヨ', romaji: 'yo' },
    { char: 'ラ', romaji: 'ra' }, { char: 'り', romaji: 'ri' }, { char: 'る', romaji: 'ru' }, { char: 'レ', romaji: 're' }, { char: 'ロ', romaji: 'ro' },
    { char: 'ワ', romaji: 'wa' }, { char: '', romaji: '' }, { char: '', romaji: '' }, { char: '', romaji: '' }, { char: 'ヲ', romaji: 'wo' },
    { char: 'ン', romaji: 'n' },
    // Dakuten (Tenten)
    { char: 'ガ', romaji: 'ga' }, { char: 'ギ', romaji: 'gi' }, { char: 'グ', romaji: 'gu' }, { char: 'ゲ', romaji: 'ge' }, { char: 'ゴ', romaji: 'go' },
    { char: 'ザ', romaji: 'za' }, { char: 'ジ', romaji: 'ji' }, { char: 'ズ', romaji: 'zu' }, { char: 'ゼ', romaji: 'ze' }, { char: 'ゾ', romaji: 'zo' },
    { char: 'ダ', romaji: 'da' }, { char: 'ヂ', romaji: 'ji' }, { char: 'ヅ', romaji: 'zu' }, { char: 'デ', romaji: 'de' }, { char: 'ド', romaji: 'do' },
    { char: 'バ', romaji: 'ba' }, { char: 'ビ', romaji: 'bi' }, { char: 'ブ', romaji: 'bu' }, { char: 'ベ', romaji: 'be' }, { char: 'ボ', romaji: 'bo' },
    // Handakuten (Maru)
    { char: 'パ', romaji: 'pa' }, { char: 'ピ', romaji: 'pi' }, { char: 'プ', romaji: 'pu' }, { char: 'ペ', romaji: 'pe' }, { char: 'ポ', romaji: 'po' }
  ]
};

export default function App() {
  const [view, setView] = useState('menu');
  const [selectedCat, setSelectedCat] = useState('all');
  const [alfabetoType, setAlfabetoType] = useState<'hiragana' | 'katakana'>('hiragana');
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
    if (catId === 'alfabeto') {
      setView('alfabeto');
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

  if (view === 'alfabeto') {
    const data = ALFABETO[alfabetoType];
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center font-sans">
        <header className="w-full max-w-md flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center">
            <button onClick={() => setView('menu')} className="text-xs font-black text-slate-400 uppercase flex items-center gap-1 hover:text-red-500 transition-colors">
              <ChevronLeft size={16} /> Menú
            </button>
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">ALFABETO</h2>
          </div>
          
          <div className="flex bg-slate-200 p-1 rounded-2xl">
            <button 
              onClick={() => setAlfabetoType('hiragana')}
              className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${alfabetoType === 'hiragana' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}
            >
              Hiragana
            </button>
            <button 
              onClick={() => setAlfabetoType('katakana')}
              className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${alfabetoType === 'katakana' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              Katakana
            </button>
          </div>
        </header>

        <div className="w-full max-w-md grid grid-cols-5 gap-2 pb-10">
          {data.map((h, i) => (
            <motion.button
              key={`${alfabetoType}-${i}`}
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
                  {cat.id !== 'alfabeto' && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${cat.color}`} style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400">{masteredCount}/{count}</span>
                    </div>
                  )}
                  {cat.id === 'alfabeto' && (
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Hiragana & Katakana</p>
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
            <div className="absolute inset-0 bg-white rounded-[3rem] p-5 shadow-2xl backface-hidden rotate-y-180 flex flex-col border-4 border-white cursor-pointer overflow-hidden">
              <div className="h-28 rounded-[2rem] overflow-hidden mb-3 shadow-inner border border-slate-100 shrink-0">
                <img src={currentWord.image} className="w-full h-full object-cover" alt="visual" referrerPolicy="no-referrer" />
              </div>
              <div className="text-center mb-3 shrink-0">
                <span className="text-red-500 font-black tracking-widest uppercase text-[9px]">{currentWord.romaji}</span>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">{currentWord.spanish}</h2>
              </div>

              <div className="flex flex-col gap-2 overflow-hidden">
                {/* Fonética Kana */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <Music size={12} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Fonética Kana</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentWord.kanaBreakdown.map((k, i) => (
                      <div key={i} className="flex flex-col items-center bg-white px-2 py-1 rounded-lg shadow-sm border border-slate-100 min-w-[32px]">
                        <span className="text-base font-black text-slate-800 font-jp leading-tight">{k.char}</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase">{k.sound}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Análisis Kanji */}
                {currentWord.kanjiBreakdown.length > 0 && (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                      <Languages size={12} />
                      <span className="text-[8px] font-black uppercase tracking-widest">Análisis Kanji</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {currentWord.kanjiBreakdown.map((k, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-slate-100">
                          <span className="text-base font-black text-red-600 bg-red-50 w-8 h-8 flex items-center justify-center rounded-lg font-jp shrink-0">{k.char}</span>
                          <div className="min-w-0">
                            <p className="text-[8px] font-black text-blue-500 uppercase leading-none mb-0.5 truncate">{k.reading}</p>
                            <p className="text-xs font-bold text-slate-700 truncate">{k.mean}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
