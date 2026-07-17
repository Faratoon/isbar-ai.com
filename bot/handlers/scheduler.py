"""
scheduler.py — Scheduled posts handler
"""
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import datetime

scheduler = AsyncIOScheduler()

SCHED_TEXT, SCHED_TIME = range(2)

async def schedule_menu(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    if query:
        await query.answer()
        msg = query
    else:
        msg = update.message

    scheduled = context.user_data.get("scheduled_posts", [])
    keyboard = [
        [InlineKeyboardButton("➕ New Post", callback_data="sched_new"),
         InlineKeyboardButton("📋 View All", callback_data="sched_list")],
        [InlineKeyboardButton("🔙 Back", callback_data="menu_main")],
    ]
    text = f"**📅 Schedule** ({len(scheduled)} posts)\n\n"
    if scheduled:
        for s in scheduled[-5:]:
            text += f"• {s.get('time', '?')}: {s.get('content', '')[:30]}...\n"
    else:
        text += "Weli post laguma darin jadwalka.\n"

    if query:
        await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
    else:
        await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")

async def schedule_new_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        "**➕ New Scheduled Post**\n\n"
        "Soo dir qoraalka aad rabto inaad jadwaliso:",
        parse_mode="Markdown"
    )
    return SCHED_TEXT

async def receive_sched_content(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["sched_content"] = update.message.text or update.message.caption or ""
    await update.message.reply_text(
        "✅ **Qoraalka waa la kaydiyay!**\n\n"
        "Hadda soo dir **waqtiga** (tusaale: `2026-07-17 19:00` ama `19:00`):",
        parse_mode="Markdown"
    )
    return SCHED_TIME

async def receive_sched_time(update: Update, context: ContextTypes.DEFAULT_TYPE):
    time_str = update.message.text.strip()
    content = context.user_data.get("sched_content", "")
    scheduled = context.user_data.get("scheduled_posts", [])
    scheduled.append({"time": time_str, "content": content})
    context.user_data["scheduled_posts"] = scheduled
    await update.message.reply_text(
        f"✅ **Post waa la jadwaliyay!**\n\n"
        f"🕐 {time_str}\n📝 {content[:50]}...",
        parse_mode="Markdown"
    )
    return -1

async def view_scheduled_posts(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    scheduled = context.user_data.get("scheduled_posts", [])
    if not scheduled:
        await query.edit_message_text("❌ **Weli post laguma darin jadwalka.**", parse_mode="Markdown")
        return
    text = "**📋 Scheduled Posts:**\n\n"
    for i, s in enumerate(scheduled, 1):
        text += f"{i}. 🕐 {s['time']} — {s['content'][:40]}...\n"
    text += "\n🔙 Back: /menu"
    await query.edit_message_text(text, parse_mode="Markdown")
