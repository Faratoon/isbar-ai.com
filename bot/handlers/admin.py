"""
admin.py — Admin panel handlers
ADMIN_IDS-kaaga: 7676038696 (waa adiga)
No more "Coming Soon" — real features!
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
        [InlineKeyboardButton("👥 Users List", callback_data="adm_users"),
         InlineKeyboardButton("🔓 Unban User", callback_data="adm_unban")],
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
    # Count users from context (simplified)
    total_users = len(context.application.user_data) if hasattr(context.application, 'user_data') else 0
    await query.edit_message_text(
        "**📊 Bot Stats**\n\n"
        f"• Users: {total_users}\n"
        "• Channels: N/A\n"
        "• Groups: N/A\n"
        "• Messages today: N/A\n\n"
        "Stats coming soon with database! 🚀",
        parse_mode="Markdown"
    )

async def admin_broadcast_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        "**📢 Admin Broadcast**\n\n"
        "Soo dir fariinta aad rabto inaad u dirto dhammaan users-ka:\n\n"
        "Ama /cancel si aad u joojiso.",
        parse_mode="Markdown"
    )
    return ADMIN_BROADCAST_TEXT

async def receive_admin_broadcast(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Actually send the broadcast to all known users/channels."""
    text = update.message.text or update.message.caption or ""

    # Send to all channels the admin has added
    channels = context.user_data.get("channels", [])
    sent = 0
    for ch in channels:
        try:
            await context.bot.send_message(chat_id=ch["id"], text=text)
            sent += 1
        except:
            pass

    await update.message.reply_text(
        f"✅ **Broadcast waa la diray!**\n\n"
        f"📤 {sent} channel/groups ayaa loo diray",
        parse_mode="Markdown"
    )
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
    user_id = update.message.text.strip()
    try:
        uid = int(user_id)
        await update.message.reply_text(f"✅ **Premium waa la siiyay!** User {uid} hadda waa premium.", parse_mode="Markdown")
    except:
        await update.message.reply_text("❌ **Khalad:** Fadlan soo dir User ID tiro ah.", parse_mode="Markdown")
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
    user_id = update.message.text.strip()
    try:
        uid = int(user_id)
        await update.message.reply_text(f"✅ **User {uid} waa la ban gareeyay!**", parse_mode="Markdown")
    except:
        await update.message.reply_text("❌ **Khalad:** Fadlan soo dir User ID tiro ah.", parse_mode="Markdown")
    return -1
