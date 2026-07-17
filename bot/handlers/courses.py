"""
courses.py — Course & Learning handlers
Uses real data from public/courses.json (4 courses, 69 lessons)
Auto-generates quiz from lesson titles
No more "Coming Soon" — everything works!
"""
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes, ConversationHandler
import json
import os
import random

COURSES_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "public", "courses.json")
QUIZ, = range(1)

def load_courses():
    try:
        with open(COURSES_PATH, "r", encoding="utf-8") as f:
            return json.load(f).get("courses", [])
    except:
        return []

def auto_generate_quiz(course):
    """Auto-generate quiz questions from lesson titles."""
    lessons = course.get("lessons", [])
    if not lessons:
        return []
    
    questions = []
    sample = random.sample(lessons, min(5, len(lessons)))
    
    for lesson in sample:
        title = lesson["title"]
        desc = lesson.get("description", "")
        # Generate 4 options from other lesson titles
        other_titles = [l["title"] for l in lessons if l["number"] != lesson["number"]]
        random.shuffle(other_titles)
        wrong = other_titles[:3]
        while len(wrong) < 3:
            wrong.append(f"Ma aha {title}")
        
        options = [title] + wrong
        random.shuffle(options)
        correct_idx = options.index(title)
        
        questions.append({
            "q": f"Casharkee ayaa la yiraahdaa '{title}'?",
            "options": options,
            "answer": correct_idx,
            "desc": desc[:100] if desc else ""
        })
    
    return questions

async def learn_ai_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    if query:
        await query.answer()
    courses = load_courses()
    keyboard = []
    for c in courses:
        emoji = "🎬" if c["type"] == "youtube" else "🎥" if c["type"] == "loom" else "📦" if c["type"] == "dropshipping" else "🔗"
        keyboard.append([InlineKeyboardButton(
            f"{emoji} {c['name']} ({c['total_lessons']} cashar)",
            callback_data=f"learn_{c['id']}"
        )])
    keyboard.append([InlineKeyboardButton("🌐 Bulshada & Links", callback_data="menu_support")])
    keyboard.append([InlineKeyboardButton("📝 Google Form Registration", url="https://forms.gle/YOUR_FORM_LINK")])
    keyboard.append([InlineKeyboardButton("🔙 Back", callback_data="menu_main")])

    text = "**📚 Koorsooyinka**\n\n"
    for c in courses:
        emoji = "🎬" if c["type"] == "youtube" else "🎥" if c["type"] == "loom" else "📦" if c["type"] == "dropshipping" else "🔗"
        text += f"{emoji} **{c['name']}** — {c['total_lessons']} cashar\n"

    if query:
        await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
    else:
        await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")

async def course_detail(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    course_id = int(query.data.replace("learn_", ""))
    courses = load_courses()
    course = next((c for c in courses if c["id"] == course_id), None)
    if not course:
        await query.edit_message_text("❌ Koorso ma helin.", parse_mode="Markdown")
        return

    emoji = "🎬" if course["type"] == "youtube" else "🎥" if course["type"] == "loom" else "📦" if course["type"] == "dropshipping" else "🔗"
    text = f"{emoji} **{course['name']}**\n"
    text += f"📚 {course['total_lessons']} cashar\n\n"

    keyboard = []
    for lesson in course["lessons"][:10]:  # Show first 10
        keyboard.append([InlineKeyboardButton(
            f"📖 #{lesson['number']} {lesson['title'][:30]}",
            url=lesson["link"]
        )])

    # If more lessons, add "View All" button
    if len(course["lessons"]) > 10:
        keyboard.append([InlineKeyboardButton("📋 Dhammaan Casharada", url=course["lessons"][0]["link"])])

    # Quiz button — auto-generated for ALL courses
    keyboard.append([InlineKeyboardButton("🧪 Qaado Quiz", callback_data=f"quiz_{course_id}")])

    # Knowledge base button
    keyboard.append([InlineKeyboardButton("📂 Knowledge Base", callback_data=f"kb_{course_id}")])

    keyboard.append([InlineKeyboardButton("🔙 Back", callback_data="menu_learn")])

    await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")

async def quiz_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    course_id = int(query.data.replace("quiz_", ""))
    courses = load_courses()
    course = next((c for c in courses if c["id"] == course_id), None)
    
    if not course:
        await query.edit_message_text("❌ Koorso ma helin.", parse_mode="Markdown")
        return

    questions = auto_generate_quiz(course)
    if not questions:
        await query.edit_message_text("❌ Quiz ma helin.", parse_mode="Markdown")
        return

    context.user_data["quiz"] = {"course_id": course_id, "q_index": 0, "score": 0, "questions": questions}
    await send_quiz_question(update, context)
    return QUIZ

async def send_quiz_question(update: Update, context: ContextTypes.DEFAULT_TYPE):
    quiz = context.user_data.get("quiz", {})
    questions = quiz.get("questions", [])
    idx = quiz.get("q_index", 0)

    if idx >= len(questions):
        score = quiz.get("score", 0)
        total = len(questions)
        emoji = "🌟" if score == total else "👍" if score >= total//2 else "💪"
        keyboard = [[InlineKeyboardButton("🔙 Back to Courses", callback_data="menu_learn")]]
        await update.callback_query.edit_message_text(
            f"{emoji} **Quiz dhammaystiray!**\n\n"
            f"✅ {score}/{total} sax ah\n\n"
            f"{'🎉 Waa ku fiican tahay!' if score == total else '👏 Si wanaagsan!'}",
            reply_markup=InlineKeyboardMarkup(keyboard),
            parse_mode="Markdown"
        )
        return

    q = questions[idx]
    keyboard = []
    for i, opt in enumerate(q["options"]):
        keyboard.append([InlineKeyboardButton(f"{['🇦','🇧','🇨','🇩'][i]} {opt}", callback_data=f"quiz_ans_{i}")])
    keyboard.append([InlineKeyboardButton("🔙 Back", callback_data="menu_learn")])

    await update.callback_query.edit_message_text(
        f"**🧪 Quiz** ({idx+1}/{len(questions)})\n\n"
        f"❓ {q['q']}",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )

async def quiz_answer(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    answer = int(query.data.replace("quiz_ans_", ""))
    quiz = context.user_data.get("quiz", {})
    questions = quiz.get("questions", [])
    idx = quiz.get("q_index", 0)

    if idx < len(questions):
        correct = questions[idx]["answer"]
        if answer == correct:
            quiz["score"] = quiz.get("score", 0) + 1
            await query.edit_message_text("✅ **Sax!** 🎉\n\n", parse_mode="Markdown")
        else:
            await query.edit_message_text(f"❌ **Khalad!**\n\nJawaabta saxda ah: {questions[idx]['options'][correct]}", parse_mode="Markdown")

        quiz["q_index"] = idx + 1
        context.user_data["quiz"] = quiz

    # Send next question
    await send_quiz_question(update, context)

async def knowledge_base_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show knowledge base for a course."""
    query = update.callback_query
    await query.answer()
    course_id = int(query.data.replace("kb_", ""))
    courses = load_courses()
    course = next((c for c in courses if c["id"] == course_id), None)
    
    if not course:
        await query.edit_message_text("❌ Koorso ma helin.", parse_mode="Markdown")
        return

    # Build knowledge base from lesson descriptions
    kb_text = f"**📂 Knowledge Base: {course['name']}**\n\n"
    for lesson in course["lessons"][:10]:
        desc = lesson.get("description", "Weli sharaxaad ma lahan.")
        kb_text += f"📖 **#{lesson['number']} {lesson['title']}**\n{desc}\n\n"

    keyboard = [[InlineKeyboardButton("🔙 Back", callback_data=f"learn_{course_id}")]]
    await query.edit_message_text(kb_text[:4000], reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")

async def support_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    keyboard = [
        [InlineKeyboardButton("💬 WhatsApp Quiz Group", url="https://chat.whatsapp.com/BRk1xgsg4ohKAaWN7oDRIe")],
        [InlineKeyboardButton("📢 Telegram Channel", url="https://t.me/+eJxxMKtunMcwODhk")],
        [InlineKeyboardButton("🎬 YouTube Channel", url="https://m.youtube.com/user/MrFaraton")],
        [InlineKeyboardButton("👥 Facebook Community", url="https://www.facebook.com/soomaalipodcast")],
        [InlineKeyboardButton("📝 Substack Blog", url="https://mfaratoon.substack.com/")],
        [InlineKeyboardButton("📞 Contact @Mfaratoon", url="https://t.me/Mfaratoon")],
        [InlineKeyboardButton("📝 Google Form Registration", url="https://forms.gle/YOUR_FORM_LINK")],
        [InlineKeyboardButton("🔙 Back", callback_data="menu_main")],
    ]
    await query.edit_message_text(
        "**🌐 Bulshada & Links**\n\n"
        "Ku soo biir bulshada Isbar AI:\n\n"
        "💬 **WhatsApp** — Quiz & Support\n"
        "📢 **Telegram** — Updates & Files\n"
        "🎬 **YouTube** — Casharada video\n"
        "👥 **Facebook** — Community\n"
        "📝 **Substack** — Blog & Articles\n"
        "📝 **Google Form** — Iska diiwaan geli\n\n"
        "📞 **Support:** @Mfaratoon",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )

async def info_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    keyboard = [
        [InlineKeyboardButton("🌐 Bulshada & Links", callback_data="menu_support")],
        [InlineKeyboardButton("⭐ Premium @Mfaratoon", url="https://t.me/Mfaratoon")],
        [InlineKeyboardButton("📝 Google Form", url="https://forms.gle/YOUR_FORM_LINK")],
        [InlineKeyboardButton("🔙 Back", callback_data="menu_main")],
    ]
    await query.edit_message_text(
        "**Isbar AI Bot** 🤖\n\n"
        "Version: 2.0.0\n"
        "Language: 🇸🇴 Soomaali\n\n"
        "**Features:**\n"
        "🤖 AI Chat (Nano, GPT, Flux, Sora)\n"
        "📚 4 Koorso oo dhammaystiran (69 cashar)\n"
        "🧪 Quiz & Imtixaan (auto-generated)\n"
        "📢 Channel & Group Manager\n"
        "📅 Jadwal Barasho\n"
        "📂 Knowledge Base\n"
        "👤 Fasalka Gaarka ah\n"
        "⭐ Premium Features\n\n"
        "Made with ❤️ for Somali community\n\n"
        "📞 @Mfaratoon",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )
