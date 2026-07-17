'use client';

import {useTranslations} from 'next-intl';
import {useState, useEffect} from 'react';
import {GraduationCap, Mail, User, LogIn, Clock, BookOpen, Star, Bell, CheckCircle, Award, LogOut, Save, Calendar} from 'lucide-react';

const lessons = [
  {day: 1, subject: 'math', title_so: 'Tirada & Tirsinta', title_en: 'Numbers & Counting', duration: 15, points: 10},
  {day: 2, subject: 'math', title_so: 'Isugeyn & Kala goyn', title_en: 'Addition & Subtraction', duration: 15, points: 10},
  {day: 3, subject: 'programming', title_so: 'Waa maxay Programming?', title_en: 'What is Programming?', duration: 15, points: 15},
  {day: 4, subject: 'math', title_so: 'Dhufasho & Qaybin', title_en: 'Multiplication & Division', duration: 15, points: 10},
  {day: 5, subject: 'science', title_so: 'Sayniska Nolosha', title_en: 'Life Science', duration: 15, points: 15},
  {day: 6, subject: 'programming', title_so: 'Scratch — Xarakat', title_en: 'Scratch — Motion', duration: 15, points: 15},
  {day: 7, subject: 'math', title_so: 'Joomatari — Qaababka', title_en: 'Geometry — Shapes', duration: 15, points: 10},
];

export default function FasalkaPage() {
  const t = useTranslations('fasalka');
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [completed, setCompleted] = useState<number[]>([]);
  const [points, setPoints] = useState(0);
  const [stars, setStars] = useState(0);
  const [studyTime, setStudyTime] = useState('19:00');
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('fasalka_data');
    if (saved) {
      const data = JSON.parse(saved);
      setLoggedIn(true);
      setName(data.name);
      setEmail(data.email);
      setCompleted(data.completed || []);
      setPoints(data.points || 0);
      setStars(data.stars || 0);
      setStudyTime(data.studyTime || '19:00');
    }
  }, []);

  const saveData = () => {
    localStorage.setItem('fasalka_data', JSON.stringify({name, email, completed, points, stars, studyTime}));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setLoggedIn(true);
      saveData();
    }
  };

  const completeLesson = (day: number, pts: number) => {
    if (!completed.includes(day)) {
      const newCompleted = [...completed, day];
      const newPoints = points + pts;
      const newStars = stars + 1;
      setCompleted(newCompleted);
      setPoints(newPoints);
      setStars(newStars);
      localStorage.setItem('fasalka_data', JSON.stringify({name, email, completed: newCompleted, points: newPoints, stars: newStars, studyTime}));
      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fasalka_data');
    setLoggedIn(false);
    setName('');
    setEmail('');
    setCompleted([]);
    setPoints(0);
    setStars(0);
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <GraduationCap className="w-20 h-20 text-purple-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold gradient-text mb-2">{t('login_title')}</h1>
            <p className="text-gray-400">{t('login_desc')}</p>
          </div>
          <form onSubmit={handleLogin} className="glass rounded-3xl p-8 space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <User className="w-4 h-4" /> {t('name')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Axmed"
                className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Mail className="w-4 h-4" /> {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. suxufi34@gmail.com"
                className="w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold hover:from-purple-500 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" /> {t('enter')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const progress = Math.round((completed.length / lessons.length) * 100);

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">{t('welcome_back')}, {name}! 👋</h1>
            <p className="text-sm text-gray-400">{email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" /> {t('logout')}
          </button>
        </div>

        {/* Notification */}
        {showNotif && (
          <div className="mb-4 glass rounded-xl p-4 flex items-center gap-3 border border-green-500/30 animate-pulse-glow">
            <Bell className="w-5 h-5 text-green-400" />
            <span className="text-sm text-green-300">✅ Cashar waa la dhammaystiray! +10 dhibcood!</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{points}</div>
            <div className="text-xs text-gray-400">{t('reward')}</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stars}</div>
            <div className="text-xs text-gray-400">⭐ Stars</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{completed.length}/{lessons.length}</div>
            <div className="text-xs text-gray-400">{t('completed')}</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{progress}%</div>
            <div className="text-xs text-gray-400">{t('progress')}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="glass rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">{t('progress')}</span>
            <span className="text-sm text-purple-400">{progress}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-gray-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-700 transition-all duration-500"
              style={{width: `${progress}%`}}
            />
          </div>
        </div>

        {/* Study Time Settings */}
        <div className="glass rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-300">{t('set_time')}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={studyTime}
                onChange={(e) => {
                  setStudyTime(e.target.value);
                  localStorage.setItem('fasalka_data', JSON.stringify({name, email, completed, points, stars, studyTime: e.target.value}));
                }}
                className="bg-transparent text-white border border-gray-600 rounded-lg px-3 py-1 text-sm"
              />
              <button
                onClick={() => {
                  setNotifEnabled(!notifEnabled);
                  if (!notifEnabled) {
                    setShowNotif(true);
                    setTimeout(() => setShowNotif(false), 2000);
                  }
                }}
                className={`p-2 rounded-lg transition-colors ${notifEnabled ? 'bg-purple-600 text-white' : 'glass text-gray-400'}`}
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Lessons */}
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" /> {t('today_lesson')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessons.map((lesson) => {
            const done = completed.includes(lesson.day);
            return (
              <div
                key={lesson.day}
                className={`glass rounded-2xl p-5 transition-all ${
                  done ? 'opacity-50 border-green-500/30' : 'hover:scale-[1.02]'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs text-gray-500">Day {lesson.day}</span>
                    <h3 className="font-semibold">{lesson.title_so}</h3>
                    <p className="text-xs text-gray-400">{lesson.duration} min</p>
                  </div>
                  {done ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <button
                      onClick={() => completeLesson(lesson.day, lesson.points)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 text-white text-sm font-semibold hover:from-purple-500 hover:to-purple-700 transition-all"
                    >
                      ✓
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rewards */}
        {stars >= 3 && (
          <div className="mt-8 glass rounded-2xl p-6 text-center animate-pulse-glow">
            <Award className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-yellow-400 mb-1">🎉 {t('reward')}!</h3>
            <div className="flex justify-center gap-1 mt-2 text-2xl">
              {Array.from({length: Math.min(stars, 7)}).map((_, i) => (
                <span key={i}>{['⭐', '🌟', '🎯', '🏆', '💎', '👑', '🎖️'][i]}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
