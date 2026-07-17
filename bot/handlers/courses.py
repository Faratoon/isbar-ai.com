"""
courses.py — Course & Learning handlers
"""
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
import json
import os
import config

def load_courses():
    try:
        with open(config.COURSES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return []

async def learn_ai_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    if query:
        await query.answer()
        msg = query
    else:
        msg = update.message

    courses = load_courses()
    keyboard = []
    for c in courses:
        keyboard.append([InlineKeyboardButton(
            f"{c['title_so']} ({c['level']})",
            callback_data=f"learn_{c['id']}"
        )])
    keyboard.append([InlineKeyboardButton("🔙 Back", callback_data="menu_main")])

    text = "**📚 Koorsooyinka AI**\n\n"
    for c in courses:
        text += f"• **{c['title_so']}** — {c['desc_so']}\n  ({c['lessons']} cashar, {c['duration']})\n\n"

    if query:
        await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
    else:
        await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")

async def support_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    keyboard = [[InlineKeyboardButton("📞 Contact Support", url=f"https://t.me/{config.SUPPORT_USERNAME.replace('@', '')}")],
                [InlineKeyboardButton("🔙 Back", callback_data="menu_main")]]
    await query.edit_message_text(
        f"**📞 Support**\n\n"
        f"Waxaad nala soo xiriiri kartaa:\n"
        f"• Telegram: {config.SUPPORT_USERNAME}\n"
        f"• Website: {config.WEBSITE_URL}\n\n"
        f"Waxaan u diyaar nahay inaan kaa caawinno!",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )

async def info_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    keyboard = [[InlineKeyboardButton("🔙 Back", callback_data="menu_main")]]
    await query.edit_message_text(
        "**Isbar AI Bot** 🤖\n\n"
        "Version: 1.0.0\n"
        "Language: Soomaali & English\n"
        "Platform: Telegram\n\n"
        "**Features:**\n"
        "• AI Chat (Nano, GPT, Flux, Sora)\n"
        "• Channel & Group Manager\n"
        "• Scheduled Posts\n"
        "• AI Courses\n"
        "• Voice Commands\n"
        "• Premium Features\n\n"
        "Made with ❤️ for Somali community",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )
