"""
profile.py — User profile & premium handlers
"""
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes

async def profile_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    if query:
        await query.answer()
        msg = query
    else:
        msg = update.message

    user = update.effective_user
    is_premium = context.user_data.get("premium", False)
    channels = len(context.user_data.get("channels", []))
    groups = len(context.user_data.get("groups", []))
    scheduled = len(context.user_data.get("scheduled_posts", []))

    text = (
        f"**👤 Profile**\n\n"
        f"**Name:** {user.first_name}\n"
        f"**ID:** {user.id}\n"
        f"**Premium:** {'✅ Yes' if is_premium else '❌ No'}\n"
        f"**Channels:** {channels}\n"
        f"**Groups:** {groups}\n"
        f"**Scheduled:** {scheduled}\n"
    )

    keyboard = [
        [InlineKeyboardButton("⭐ Upgrade to Premium", callback_data="prof_upgrade")],
        [InlineKeyboardButton("📊 Stats", callback_data="prof_stats"),
         InlineKeyboardButton("📅 My Schedule", callback_data="prof_scheduled")],
        [InlineKeyboardButton("🔙 Back", callback_data="menu_main")],
    ]

    if query:
        await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
    else:
        await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")

async def premium_info(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    keyboard = [[InlineKeyboardButton("🔙 Back", callback_data="menu_profile")]]
    await query.edit_message_text(
        "**⭐ Premium**\n\n"
        "**Benefits:**\n"
        "• Unlimited AI chat\n"
        "• All AI models (Midjourney, Sora, Flux)\n"
        "• Priority support\n"
        "• No daily message limit\n"
        "• Advanced analytics\n\n"
        "**Coming soon!** 🚀",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )
