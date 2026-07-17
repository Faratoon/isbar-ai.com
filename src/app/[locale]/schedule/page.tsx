'use client';

import {useTranslations} from 'next-intl';
import {useState} from 'react';
import {Calendar, Clock, Star, Sparkles, BookOpen, Code, FlaskConical, Trophy, Zap, ChevronRight, CheckCircle, Award} from 'lucide-react';

const lessons = {
  grade6: [
    {day: 1, subject: 'math', title_so: 'Tirada & Tirsinta', title_en: 'Numbers & Counting', duration: 15, points: 10},
    {day: 2, subject: 'math', title_so: 'Isugeyn & Kala goyn', title_en: 'Addition & Subtraction', duration: 15, points: 10},
    {day: 3, subject: 'programming', title_so: 'Waa maxay Programming?', title_en: 'What is Programming?', duration: 15, points: 15},
    {day: 4, subject: 'math', title_so: 'Dhufasho & Qaybin', title_en: 'Multiplication & Division', duration: 15, points: 10},
    {day: 5, subject: 'science', title_so: 'Sayniska Nolosha', title_en: 'Life Science', duration: 15, points: 15},
    {day: 6, subject: 'programming', title_so: 'Scratch — Xarakat', title_en: 'Scratch — Motion', duration: 15, points: 15},
    {day: 7, subject: 'math', title_so: 'Joomatari — Qaababka', title_en: 'Geometry — Shapes', duration: 15, points: 10},
  ],
  grade8: [
    {day: 1, subject: 'math', title_so: 'Algebra — Islaegta', title_en: 'Algebra — Equations', duration: 15, points: 10},
    {day: 2, subject: 'programming', title_so: 'Python — Variables', title_en: 'Python — Variables', duration: 15, points: 15},
    {day: 3, subject: 'math', title_so: 'Joomatari — Xaglaha', title_en: 'Geometry — Angles', duration: 15, points: 10},
    {day: 4, subject: 'science', title_so: 'Kimistariga — Elements', title_en: 'Chemistry — Elements', duration: 15, points: 15},
    {day: 5, subject: 'programming', title_so: 'Python — Loops', title_en: 'Python — Loops', duration: 15, points: 15},
    {day: 6, subject: 'math', title_so: 'Fibooska & Boqolleyda', title_en: 'Fractions & Percentages', duration: 15, points: 10},
    {day: 7, subject: 'science', title_so: 'Fiisigiska — Xoogga', title_en: 'Physics — Force', duration: 15, points: 15},
  ],
  highschool: [
    {day: 1, subject: 'math', title_so: 'Algebra — Functions', title_en: 'Algebra — Functions', duration: 15, points: 10},
    {day: 2, subject: 'programming', title_so: 'JavaScript — DOM', title_en: 'JavaScript — DOM', duration: 15, points: 15},
    {day: 3, subject: 'math', title_so: 'Trigonometry', title_en: 'Trigonometry', duration: 15, points: 10},
    {day: 4, subject: 'science', title_so: 'Fiisigiska — Dhaqdhaqaaqa', title_en: 'Physics — Motion', duration: 15, points: 15},
    {day: 5, subject: 'programming', title_so: 'React — Components', title_en: 'React — Components', duration: 15, points: 15},
    {day: 6, subject: 'math', title_so: 'Calculus — Limits', title_en: 'Calculus — Limits', duration: 15, points: 10},
    {day: 7, subject: 'science', title_so: 'Bayoloji — Unugyada', title_en: 'Biology — Cells', duration: 15, points: 15},
  ],
};

const subjectIcons: Record<string, any> = {
  math: BookOpen,
  programming: Code,
  science: FlaskConical,
};

const subjectColors: Record<string, string> = {
  math: 'from-blue-500 to-blue-700',
  programming: 'from-green-500 to-green-700',
  science: 'from-yellow-500 to-yellow-700',
};

export default function SchedulePage() {
  const t = useTranslations('schedule');
  const [grade, setGrade] = useState<'grade6' | 'grade8' | 'highschool'>('grade6');
  const [completed, setCompleted] = useState<number[]>([]);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [stars, setStars] = useState(0);

  const currentLessons = lessons[grade];

  const completeLesson = (day: number, pts: number) => {
    if (!completed.includes(day)) {
      setCompleted([...completed, day]);
      setPoints(points + pts);
      setStars(stars + 1);
      if (completed.length % 7 === 0) setStreak(streak + 1);
    }
  };

  const gradeNames = {grade6: t('grade6'), grade8: t('grade8'), highschool: t('highschool')};

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Calendar className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold gradient-text mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-300">{t('subtitle')}</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
          <div className="glass rounded-xl p-4 text-center">
            <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-yellow-400">{points}</div>
            <div className="text-xs text-gray-400">{t('points')}</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <Zap className="w-6 h-6 text-orange-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-orange-400">{streak}</div>
            <div className="text-xs text-gray-400">{t('streak')}</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <Star className="w-6 h-6 text-purple-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-purple-400">{stars}</div>
            <div className="text-xs text-gray-400">{t('stars')}</div>
          </div>
        </div>

        {/* Grade Selector */}
        <div className="flex justify-center gap-3 mb-8">
          {(['grade6', 'grade8', 'highschool'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGrade(g)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                grade === g
                  ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg shadow-purple-500/25'
                  : 'glass text-gray-300 hover:bg-white/10'
              }`}
            >
              {gradeNames[g]}
            </button>
          ))}
        </div>

        {/* Subject Legend */}
        <div className="flex justify-center gap-6 mb-8 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" /> {t('math')}
          </div>
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-green-400" /> {t('programming')}
          </div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-yellow-400" /> {t('science')}
          </div>
        </div>

        {/* Lesson Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentLessons.map((lesson) => {
            const Icon = subjectIcons[lesson.subject];
            const done = completed.includes(lesson.day);
            return (
              <div
                key={lesson.day}
                className={`glass rounded-2xl p-5 transition-all duration-300 ${
                  done ? 'opacity-60 border-green-500/30' : 'hover:scale-[1.02]'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subjectColors[lesson.subject]} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {done ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <span className="text-xs text-gray-500">Day {lesson.day}</span>
                  )}
                </div>
                <h3 className="font-semibold mb-1">{lesson.title_so}</h3>
                <p className="text-xs text-gray-400 mb-3">{lesson.title_en}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" /> {lesson.duration} min
                  </div>
                  <div className="flex items-center gap-1 text-xs text-purple-400">
                    <Sparkles className="w-3 h-3" /> +{lesson.points} pts
                  </div>
                </div>
                {!done && (
                  <button
                    onClick={() => completeLesson(lesson.day, lesson.points)}
                    className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 text-white text-sm font-semibold hover:from-purple-500 hover:to-purple-700 transition-all flex items-center justify-center gap-1"
                  >
                    {t('start_lesson')} <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Rewards */}
        {stars >= 3 && (
          <div className="mt-8 glass rounded-2xl p-6 text-center animate-pulse-glow">
            <Award className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-yellow-400 mb-1">🎉 Abaalmarin! / Reward!</h3>
            <p className="text-gray-300">
              {stars >= 7 ? '🌟 Heer sare! Waxaad tahay xiddig! / You are a star!' : 
               stars >= 5 ? '⭐ Waa ku fiican tahay! / Great job!' : 
               '💪 Si wanaagsan u socotaa! / Keep going!'}
            </p>
            <div className="flex justify-center gap-1 mt-2 text-2xl">
              {Array.from({length: Math.min(stars, 7)}).map((_, i) => (
                <span key={i}>{['⭐', '🌟', '🎯', '🏆', '💎', '👑', '🎖️'][i] || '⭐'}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
