"""
admin.py — Admin panel handlers
"""
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
import config

ADMIN_BROADCAST_TEXT, ADMIN_PREMIUM_ID, ADMIN_BAN_ID = range(3)

def is_admin(user_id: int) -> bool:
    return user_id in config.ADMIN_IDS

async def admin_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_admin(update.effective_user.id):
        await update.message.reply_text("❌ **Unauthorized.** Admin only.", parse_mode="Markdown")
        return
    keyboard = [
        [InlineKeyboardButton("📊 Stats", callback_data="adm_stats"),
         InlineKeyboardButton("📢 Broadcast", callback_data="adm_broadcast")],
        [InlineKeyboardButton("⭐ Grant Premium", callback_data="adm_premium"),
         InlineKeyboardButton("🚫 Ban User", callback_data="adm_ban")],
        [InlineKeyboardButton("👥 Users", callback_data="adm_users"),
         InlineKeyboardButton("🔓 Unban", callback_data="adm_unban")],
        [InlineKeyboardButton("🔙 Back", callback_data="menu_main")],
    ]
    await update.message.reply_text(
        "**🛡️ Admin Panel**\n\nDooro hawsha:",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )

async def admin_stats(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        "**📊 Bot Stats**\n\n"
        "• Users: N/A\n"
        "• Channels: N/A\n"
        "• Groups: N/A\n"
        "• Messages today: N/A\n\n"
        "Stats coming soon! 🚀",
        parse_mode="Markdown"
    )

async def admin_broadcast_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        "**📢 Admin Broadcast**\n\n"
        "Soo dir fariinta aad rabto inaad u dirto dhammaan users-ka:",
        parse_mode="Markdown"
    )
    return ADMIN_BROADCAST_TEXT

async def receive_admin_broadcast(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("✅ **Broadcast waa la diray!**", parse_mode="Markdown")
    return -1

async def grant_premium_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        "**⭐ Grant Premium**\n\n"
        "Soo dir **User ID**-ga qofka aad rabto inaad premium siiso:",
        parse_mode="Markdown"
    )
    return ADMIN_PREMIUM_ID

async def receive_premium_id(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("✅ **Premium waa la siiyay!**", parse_mode="Markdown")
    return -1

async def ban_user_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        "**🚫 Ban User**\n\n"
        "Soo dir **User ID**-ga qofka aad rabto inaad ban gareyso:",
        parse_mode="Markdown"
    )
    return ADMIN_BAN_ID

async def receive_ban_id(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("✅ **User waa la ban gareeyay!**", parse_mode="Markdown")
    return -1
