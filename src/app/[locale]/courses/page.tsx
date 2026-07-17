'use client';

import {useTranslations} from 'next-intl';
import {useState} from 'react';
import {Search, BookOpen, ChevronRight, Sparkles} from 'lucide-react';

const allCourses = [
  {id: 1, title_en: 'AI Chatbot Basics', title_so: 'Aasaaska AI Chatbot', level: 'beginner', desc_en: 'Learn how to build your first AI chatbot', desc_so: 'Baro sida loo dhiso chatbot-kii ugu horreeyay'},
  {id: 2, title_en: 'Prompt Engineering', title_so: 'Farshaxanka Prompt-ka', level: 'beginner', desc_en: 'Master the art of writing effective prompts', desc_so: 'Qabso farshaxanka qorista prompt-yada waxtarka leh'},
  {id: 3, title_en: 'AI Video Editing', title_so: 'Tafatirka Video-ga AI', level: 'intermediate', desc_en: 'Edit videos using AI tools like InVideo', desc_so: 'Ku tafatir video-yada adigoo isticmaalaya qalabka AI'},
  {id: 4, title_en: 'Dropshipping with AI', title_so: 'Dropshipping iyo AI', level: 'intermediate', desc_en: 'Start dropshipping business with AI automation', desc_so: 'Bilow ganacsi dropshipping ah oo AI ku shaqeeya'},
  {id: 5, title_en: 'AI Agents & Automation', title_so: 'Agents-ka AI & Otomaatigaynta', level: 'advanced', desc_en: 'Build autonomous AI agents for your business', desc_so: 'U dhis agents AI ah oo iskii u shaqeeya ganacsigaaga'},
  {id: 6, title_en: 'Multi-Agent Systems', title_so: 'Nidaamyada Agent-yada Badan', level: 'advanced', desc_en: 'Create complex multi-agent AI workflows', desc_so: 'Abuur nidaamyo AI oo agent-yo badan leh'},
];

export default function CoursesPage() {
  const t = useTranslations('courses');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = allCourses.filter(c => {
    if (filter !== 'all' && c.level !== filter) return false;
    if (search && !c.title_so.toLowerCase().includes(search.toLowerCase()) && !c.title_en.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold gradient-text mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-300">{t('subtitle')}</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('filter')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl glass text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'beginner', 'intermediate', 'advanced'].map((l) => (
              <button
                key={l}
                onClick={() => setFilter(l)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filter === l
                    ? 'bg-purple-600 text-white'
                    : 'glass text-gray-300 hover:bg-white/10'
                }`}
              >
                {t(l)}
              </button>
            ))}
          </div>
        </div>

        {/* AI Filter Badge */}
        <div className="flex items-center gap-2 text-sm text-purple-300 mb-6">
          <Sparkles className="w-4 h-4" />
          AI-powered recommendations — courses filtered for you
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <div key={course.id} className="glass rounded-2xl p-6 hover:scale-[1.02] transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  course.level === 'beginner' ? 'bg-green-500/20 text-green-300' :
                  course.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {t(course.level)}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{course.title_so}</h3>
              <p className="text-gray-400 text-sm mb-4">{course.desc_so}</p>
              <button className="flex items-center gap-1 text-purple-400 text-sm group-hover:text-purple-300 transition-colors">
                {t('enroll')} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-12">{t('coming')}</p>
        )}
      </div>
    </div>
  );
}
