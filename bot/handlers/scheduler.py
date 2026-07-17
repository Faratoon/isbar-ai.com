"""
scheduler.py — Scheduled posts handler
Now works with real APScheduler!
"""
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.date import DateTrigger
from apscheduler.triggers.cron import CronTrigger
import datetime
import asyncio
import logging

logger = logging.getLogger(__name__)
scheduler = None

def get_scheduler():
    global scheduler
    if scheduler is None:
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        scheduler = AsyncIOScheduler(event_loop=loop)
    return scheduler

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
    chat_id = update.effective_chat.id
    scheduled = context.user_data.get("scheduled_posts", [])
    
    # Try to parse time
    try:
        if ":" in time_str and "-" not in time_str:
            # Just time like "19:00" — schedule for today
            now = datetime.datetime.now()
            hour, minute = map(int, time_str.split(":"))
            run_time = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
            if run_time < now:
                run_time += datetime.timedelta(days=1)
        else:
            # Full datetime like "2026-07-17 19:00"
            run_time = datetime.datetime.strptime(time_str, "%Y-%m-%d %H:%M")
        
        # Schedule with APScheduler
        sched = get_scheduler()
        sched.add_job(
            send_scheduled_post,
            DateTrigger(run_time=run_time),
            args=[context.bot, chat_id, content],
            id=f"post_{chat_id}_{int(run_time.timestamp())}",
            replace_existing=True
        )
        
        scheduled.append({"time": time_str, "content": content, "chat_id": chat_id})
        context.user_data["scheduled_posts"] = scheduled
        
        await update.message.reply_text(
            f"✅ **Post waa la jadwaliyay!**\n\n"
            f"🕐 {time_str}\n📝 {content[:50]}...\n\n"
            f"Bot-ka ayaa otomaatig ah u soo diri doona!",
            parse_mode="Markdown"
        )
    except Exception as e:
        await update.message.reply_text(
            f"❌ **Khalad:** {str(e)}\n\n"
            f"Fadlan soo dir waqtiga qaabkan: `19:00` ama `2026-07-17 19:00`",
            parse_mode="Markdown"
        )
    return -1

async def send_scheduled_post(bot, chat_id, content):
    """Send a scheduled post."""
    try:
        await bot.send_message(chat_id=chat_id, text=content)
        logger.info(f"Scheduled post sent to {chat_id}")
    except Exception as e:
        logger.error(f"Failed to send scheduled post to {chat_id}: {e}")

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
