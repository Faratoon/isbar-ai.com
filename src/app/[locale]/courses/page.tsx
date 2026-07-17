'use client';

import {useTranslations} from 'next-intl';
import {useState, useEffect} from 'react';
import {BookOpen, Video, ShoppingCart, Link2, ChevronDown, ChevronUp, ExternalLink, CheckCircle, Sparkles, MessageCircle, Send, Users, Globe, Hash, Star, Trophy, Award, Play, FileText, HelpCircle} from 'lucide-react';

interface Lesson {
  number: number;
  title: string;
  link: string;
  description: string;
}

interface Course {
  id: number;
  name: string;
  type: string;
  total_lessons: number;
  lessons: Lesson[];
}

const typeIcons: Record<string, any> = {
  youtube: Video,
  loom: Video,
  dropshipping: ShoppingCart,
  links: Link2,
};

const typeColors: Record<string, string> = {
  youtube: 'from-red-500 to-red-700',
  loom: 'from-purple-500 to-purple-700',
  dropshipping: 'from-green-500 to-green-700',
  links: 'from-blue-500 to-blue-700',
};

const typeEmojis: Record<string, string> = {
  youtube: '🎬',
  loom: '🎥',
  dropshipping: '📦',
  links: '🔗',
};

const communityLinks = [
  {icon: MessageCircle, label: 'WhatsApp Quiz & Support', link: 'https://chat.whatsapp.com/BRk1xgsg4ohKAaWN7oDRIe', color: 'from-green-500 to-emerald-600'},
  {icon: Send, label: 'Telegram Updates & Files', link: 'https://t.me/+eJxxMKtunMcwODhk', color: 'from-blue-500 to-blue-600'},
  {icon: Hash, label: 'Free AI Tools & Tips', link: 'https://t.me/Farsamada', color: 'from-cyan-500 to-cyan-600'},
  {icon: Users, label: 'AI & Chatbot Learning', link: 'https://chat.whatsapp.com/KzkcjwraeYhCsUXaexgNyM', color: 'from-purple-500 to-purple-600'},
  {icon: Video, label: 'AI Video Editing Group', link: 'https://chat.whatsapp.com/G9phNqLyJ3L2RV4lprLUb7', color: 'from-pink-500 to-pink-600'},
  {icon: Globe, label: 'YouTube Channel', link: 'https://m.youtube.com/user/MrFaraton', color: 'from-red-500 to-red-600'},
  {icon: Globe, label: 'Facebook Community', link: 'https://www.facebook.com/soomaalipodcast', color: 'from-blue-600 to-blue-800'},
  {icon: FileText, label: 'Substack Blog', link: 'https://mfaratoon.substack.com/', color: 'from-orange-500 to-orange-600'},
];

export default function CoursesPage() {
  const t = useTranslations('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [points, setPoints] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/courses.json')
      .then(r => r.json())
      .then(d => setCourses(d.courses))
      .catch(() => {});
    const saved = localStorage.getItem('course_progress');
    if (saved) {
      const data = JSON.parse(saved);
      setCompleted(data.completed || []);
      setPoints(data.points || 0);
    }
  }, []);

  const completeLesson = (key: string) => {
    if (!completed.includes(key)) {
      const newCompleted = [...completed, key];
      const newPoints = points + 5;
      setCompleted(newCompleted);
      setPoints(newPoints);
      localStorage.setItem('course_progress', JSON.stringify({completed: newCompleted, points: newPoints}));
    }
  };

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalLessons = courses.reduce((sum, c) => sum + c.total_lessons, 0);

  return (
    <div className="min-h-screen pt-20 px-3 sm:px-4 max-w-6xl mx-auto pb-20">
      {/* Welcome Banner */}
      {showWelcome && (
        <div className="mb-6 rounded-2xl p-4 sm:p-6 relative overflow-hidden" style={{background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(219,39,119,0.1))', border: '1px solid rgba(124,58,237,0.2)'}}>
          <button onClick={() => setShowWelcome(false)} className="absolute top-2 right-2 text-gray-500 hover:text-white text-sm">✕</button>
          <div className="flex items-start gap-3">
            <span className="text-3xl">👋</span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Ku soo dhawoow Isbar AI Academy!</h2>
              <p className="text-sm text-gray-400">Baro AI-ga Af-Soomaali — chatbot, video editing, dropshipping &amp; more</p>
              <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-500">
                <span className="px-2 py-1 rounded-full" style={{background: 'rgba(124,58,237,0.1)'}}>📚 {courses.length} Koorso</span>
                <span className="px-2 py-1 rounded-full" style={{background: 'rgba(124,58,237,0.1)'}}>🎯 {totalLessons} Cashar</span>
                <span className="px-2 py-1 rounded-full" style={{background: 'rgba(124,58,237,0.1)'}}>⭐ {points} Dhibcood</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">📚 Koorsooyinka AI</h1>
        <p className="text-sm sm:text-base text-gray-400">Baro AI tillaabo-tillaabo — dhammaan casharada oo leh links &amp; quizzes</p>
        {/* Progress */}
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <span className="text-purple-400">✅ {completed.length}/{totalLessons} dhammaystiray</span>
          <span className="text-yellow-400">⭐ {points} dhibcood</span>
        </div>
        {/* Progress bar */}
        <div className="max-w-md mx-auto mt-3 h-2 rounded-full bg-gray-800 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500" style={{width: `${totalLessons > 0 ? (completed.length / totalLessons) * 100 : 0}%`}} />
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Raadi koorso..."
          className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none"
          style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}
        />
      </div>

      {/* Course Cards */}
      <div className="space-y-4">
        {filtered.map((course) => {
          const Icon = typeIcons[course.type] || BookOpen;
          const isOpen = expanded === course.id;
          const doneCount = course.lessons.filter(l => completed.includes(`${course.id}-${l.number}`)).length;

          return (
            <div key={course.id} className="rounded-2xl overflow-hidden transition-all" style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'}}>
              {/* Course Header */}
              <button
                onClick={() => setExpanded(isOpen ? null : course.id)}
                className="w-full p-4 sm:p-5 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${typeColors[course.type]} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                    {typeEmojis[course.type]} {course.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{course.total_lessons} cashar</span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className="text-xs text-purple-400">{doneCount}/{course.total_lessons}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {doneCount === course.total_lessons && <Trophy className="w-4 h-4 text-yellow-400" />}
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {/* Lessons */}
              {isOpen && (
                <div className="border-t border-gray-800">
                  {course.lessons.map((lesson) => {
                    const key = `${course.id}-${lesson.number}`;
                    const done = completed.includes(key);
                    return (
                      <div key={lesson.number} className="p-3 sm:p-4 border-b border-gray-800/50 last:border-b-0 hover:bg-white/5 transition-colors">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => completeLesson(key)}
                            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                              done ? 'bg-green-500 border-green-500' : 'border-gray-600 hover:border-purple-400'
                            }`}
                          >
                            {done && <CheckCircle className="w-4 h-4 text-white" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-xs text-gray-500">#{lesson.number}</span>
                                <h4 className="text-sm font-medium text-gray-200 mt-0.5">{lesson.title}</h4>
                              </div>
                              <a
                                href={lesson.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 px-3 py-1 rounded-lg text-xs font-medium text-white transition-all hover:scale-105"
                                style={{background: 'linear-gradient(135deg, #7c3aed, #a78bfa)'}}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="w-3 h-3 inline mr-1" />
                                Daawasho
                              </a>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{lesson.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rewards */}
      {points >= 20 && (
        <div className="mt-8 rounded-2xl p-4 sm:p-6 text-center animate-pulse-glow" style={{background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)'}}>
          <Award className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-yellow-400 mb-1">🎉 Abaalmarin!</h3>
          <p className="text-sm text-gray-300">Waxaad tahay xiddig! {points} dhibcood ayaad heshay!</p>
          <div className="flex justify-center gap-1 mt-2 text-xl">
            {Array.from({length: Math.min(Math.floor(points / 20), 10)}).map((_, i) => (
              <span key={i}>{['⭐', '🌟', '🎯', '🏆', '💎', '👑', '🎖️', '🌈', '🔥', '💫'][i % 10]}</span>
            ))}
          </div>
        </div>
      )}

      {/* Community Links */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-center mb-6 gradient-text">🌐 Bulshada &amp; Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {communityLinks.map((link, i) => (
            <a
              key={i}
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 sm:p-4 rounded-xl transition-all hover:scale-[1.02]"
              style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'}}
            >
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center shrink-0`}>
                <link.icon className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">{link.label}</p>
                <p className="text-xs text-gray-500 truncate">{link.link.replace(/https?:\/\//, '')}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Quiz Section */}
      <div className="mt-8 rounded-2xl p-4 sm:p-6" style={{background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)'}}>
        <div className="flex items-center gap-3 mb-3">
          <HelpCircle className="w-6 h-6 text-purple-400" />
          <h3 className="text-base font-semibold text-white">🧪 Quiz &amp; Imtixaan</h3>
        </div>
        <p className="text-sm text-gray-400 mb-3">Ka qayb gal quizzes-ka WhatsApp group-ka si aad u hesho shahaado!</p>
        <a
          href="https://chat.whatsapp.com/BRk1xgsg4ohKAaWN7oDRIe"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-all hover:scale-105"
          style={{background: 'linear-gradient(135deg, #7c3aed, #a78bfa)'}}
        >
          <MessageCircle className="w-4 h-4" />
          Ku soo biir WhatsApp Quiz Group
        </a>
      </div>
    </div>
  );
}
