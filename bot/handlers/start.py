"""
start.py — Start, Help, Menu commands
With Google Form + Premium CTA + WhatsApp
"""
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
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
    await update.message.reply_text(
        f"**Assalamu Alaykum {user.first_name}!** 👋\n\n"
        f"Anigu waxaan ahay **Isbar AI Bot** — kaaliyahaaga AI-ga ah.\n"
        f"Waxaan kaa caawin karaa:\n"
        f"🤖 AI Chat (Nano, GPT, Flux, Sora)\n"
        f"📢 Maareynta Channels & Groups\n"
        f"📚 Koorsooyin AI oo Soomaali ah (69 cashar)\n"
        f"📅 Qorsheynta qoraallada\n"
        f"🧪 Quiz & Imtixaan\n\n"
        f"⭐ **Premium:** @Mfaratoon\n"
        f"💬 **WhatsApp:** https://chat.whatsapp.com/BRk1xgsg4ohKAaWN7oDRIe\n"
        f"📝 **Google Form:** https://forms.gle/YOUR_FORM_LINK\n\n"
        f"Hoos ka dooro waxa aad rabto 👇",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "**Isbar AI Bot — Help** 🆘\n\n"
        "**Commands:**\n"
        "/start — Biloow\n"
        "/menu — Menu-ka guud\n"
        "/help — Caawimaad\n"
        "/ai — AI Chat\n"
        "/nano — Nano model\n"
        "/midjourney — Midjourney\n"
        "/sora — Sora video\n"
        "/gpt_image — GPT Image\n"
        "/flux — Flux image\n"
        "/veo — Veo video\n"
        "/channels — Channels-ka\n"
        "/groups — Groups-ka\n"
        "/schedule — Jadwalka\n"
        "/profile — Profaylkaaga\n"
        "/settings — Settings-ka\n"
        "/clear — Nadiifi xusuusta\n"
        "/admin — Admin panel\n\n"
        "**Links:**\n"
        "⭐ Premium: @Mfaratoon\n"
        "💬 WhatsApp: https://chat.whatsapp.com/BRk1xgsg4ohKAaWN7oDRIe\n"
        "📝 Google Form: https://forms.gle/YOUR_FORM_LINK\n\n"
        "**Support:** @Mfaratoon",
        parse_mode="Markdown"
    )

async def menu_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
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
    await update.message.reply_text(
        "**Menu-ka Guud** 📋\n\nDooro waxa aad rabto:",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )
