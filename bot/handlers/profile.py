"""
profile.py — User profile & premium handlers
Premium CTA @Mfaratoon + Google Form + WhatsApp
"""
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes

async def profile_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    if query:
        await query.answer()

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
        [InlineKeyboardButton("⭐ Premium @Mfaratoon", url="https://t.me/Mfaratoon")],
        [InlineKeyboardButton("💬 WhatsApp Group", url="https://chat.whatsapp.com/BRk1xgsg4ohKAaWN7oDRIe")],
        [InlineKeyboardButton("📢 Telegram Channel", url="https://t.me/Farsamada")],
        [InlineKeyboardButton("📝 Google Form Registration", url="https://forms.gle/YOUR_FORM_LINK")],
        [InlineKeyboardButton("🔙 Back", callback_data="menu_main")],
    ]

    if query:
        await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
    else:
        await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")

async def premium_info(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    keyboard = [
        [InlineKeyboardButton("📞 Contact @Mfaratoon", url="https://t.me/Mfaratoon")],
        [InlineKeyboardButton("💬 WhatsApp Group", url="https://chat.whatsapp.com/BRk1xgsg4ohKAaWN7oDRIe")],
        [InlineKeyboardButton("📝 Google Form", url="https://forms.gle/YOUR_FORM_LINK")],
        [InlineKeyboardButton("🔙 Back", callback_data="menu_profile")],
    ]
    await query.edit_message_text(
        "**⭐ Premium**\n\n"
        "**Benefits:**\n"
        "• Unlimited AI chat\n"
        "• All AI models (Midjourney, Sora, Flux)\n"
        "• Priority support\n"
        "• No daily message limit\n"
        "• Advanced analytics\n"
        "• Knowledge base access\n\n"
        "**Si aad u hesho Premium:**\n"
        "📞 Contact @Mfaratoon\n"
        "💬 WhatsApp: https://chat.whatsapp.com/BRk1xgsg4ohKAaWN7oDRIe\n"
        "📝 Google Form: https://forms.gle/YOUR_FORM_LINK\n\n"
        "Fadlan nagala soo xiriir si aad u hesho Premium! 🚀",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )
