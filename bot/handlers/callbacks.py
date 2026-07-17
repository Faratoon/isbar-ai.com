"""
callbacks.py — Navigation & Settings callbacks
"""
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes

async def main_menu_cb(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    keyboard = [
        [InlineKeyboardButton("🤖 AI Chat", callback_data="menu_ai"),
         InlineKeyboardButton("📚 Courses", callback_data="menu_learn")],
        [InlineKeyboardButton("📢 Channels", callback_data="menu_channels"),
         InlineKeyboardButton("👥 Groups", callback_data="menu_groups")],
        [InlineKeyboardButton("📅 Schedule", callback_data="menu_schedule"),
         InlineKeyboardButton("👤 Profile", callback_data="menu_profile")],
        [InlineKeyboardButton("⚙️ Settings", callback_data="menu_settings"),
         InlineKeyboardButton("❓ Help", callback_data="menu_info")],
    ]
    await query.edit_message_text(
        "**Menu-ka Guud** 📋\n\nDooro waxa aad rabto:",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )

async def action_cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text("✅ **Waa la joojiyay!**", parse_mode="Markdown")

async def coming_soon_cb(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text("🚧 **Soo socdo!** Feature-kan wali waa la dhisayaa.", parse_mode="Markdown")

async def broadcast_menu_cb(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    if query:
        await query.answer()
        msg = query
    else:
        msg = update.message
    keyboard = [
        [InlineKeyboardButton("📢 Channels", callback_data="bc_channels"),
         InlineKeyboardButton("👥 Groups", callback_data="bc_groups")],
        [InlineKeyboardButton("🌐 All", callback_data="bc_all"),
         InlineKeyboardButton("🔙 Back", callback_data="menu_main")],
    ]
    text = "**📢 Broadcast**\n\nDooro meesha aad fariinta u dirtay:"
    if query:
        await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
    else:
        await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")

async def settings_menu_cb(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    if query:
        await query.answer()
        msg = query
    else:
        msg = update.message
    keyboard = [
        [InlineKeyboardButton("🌐 Language", callback_data="set_lang"),
         InlineKeyboardButton("🔔 Notifications", callback_data="set_notif")],
        [InlineKeyboardButton("🧹 Clear Memory", callback_data="set_clear_mem"),
         InlineKeyboardButton("🔙 Back", callback_data="menu_main")],
    ]
    text = "**⚙️ Settings**\n\nDooro waxa aad rabto inaad bedesho:"
    if query:
        await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
    else:
        await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")

async def set_language_cb(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    keyboard = [
        [InlineKeyboardButton("🇸🇴 Soomaali", callback_data="lang_so"),
         InlineKeyboardButton("🇬🇧 English", callback_data="lang_en")],
        [InlineKeyboardButton("🇸🇦 العربية", callback_data="lang_ar"),
         InlineKeyboardButton("🔙 Back", callback_data="menu_settings")],
    ]
    await query.edit_message_text(
        "**🌐 Language / Luuqad**\n\nDooro luuqadda aad rabto:",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )

async def save_language_cb(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    lang = query.data.replace("lang_", "")
    context.user_data["language"] = lang
    names = {"so": "🇸🇴 Soomaali", "en": "🇬🇧 English", "ar": "🇸🇦 العربية"}
    await query.edit_message_text(f"✅ **Luuqadda waa la bedelay!**\n\n{names.get(lang, lang)}", parse_mode="Markdown")

async def notifications_cb(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    keyboard = [
        [InlineKeyboardButton("🔔 On", callback_data="notif_on"),
         InlineKeyboardButton("🔕 Off", callback_data="notif_off")],
        [InlineKeyboardButton("🔙 Back", callback_data="menu_settings")],
    ]
    await query.edit_message_text(
        "**🔔 Notifications**\n\nDooro haddii aad rabto in la kuu soo diro wargelinta:",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )

async def save_notif_cb(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    state = query.data.replace("notif_", "")
    context.user_data["notifications"] = state == "on"
    await query.edit_message_text(
        f"✅ **Notifications: {'🔔 On' if state == 'on' else '🔕 Off'}**",
        parse_mode="Markdown"
    )

async def clear_memory_cb(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    context.user_data.clear()
    await query.edit_message_text("✅ **Xusuusta waa la nadiifiyay!**", parse_mode="Markdown")
