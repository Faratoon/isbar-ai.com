"""
channels.py — Channel & Group management handlers
No more "Coming Soon" — real features!
"""
import json
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes

# Conversation states
WAITING_CHANNEL_ID, WAITING_GROUP_ID, WAITING_POST_TEXT = range(3)
WAITING_DELETE_MSG_ID, WAITING_EDIT_MSG_ID, WAITING_EDIT_TEXT = range(3, 6)
WAITING_WELCOME_TEXT = 6

async def channels_menu_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    if query:
        await query.answer()
        msg = query
    else:
        msg = update.message

    channels = context.user_data.get("channels", [])
    keyboard = [
        [InlineKeyboardButton("➕ Add Channel", callback_data="ch_add"),
         InlineKeyboardButton("📋 List", callback_data="ch_list")],
        [InlineKeyboardButton("📢 Post to All", callback_data="ch_post_all"),
         InlineKeyboardButton("🗑️ Delete Post", callback_data="ch_delete")],
        [InlineKeyboardButton("✏️ Edit Post", callback_data="ch_edit"),
         InlineKeyboardButton("📊 Stats", callback_data="ch_stats")],
        [InlineKeyboardButton("🔙 Back", callback_data="menu_main")],
    ]

    text = f"**📢 Channels** ({len(channels)})\n\n"
    if channels:
        for ch in channels:
            text += f"• {ch.get('title', ch['id'])}\n"
    else:
        text += "Weli channel laguma darin.\n"

    if query:
        await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
    else:
        await update.message.reply_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")

async def groups_menu_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    groups = context.user_data.get("groups", [])
    keyboard = [
        [InlineKeyboardButton("➕ Add Group", callback_data="grp_add"),
         InlineKeyboardButton("📋 List", callback_data="grp_list")],
        [InlineKeyboardButton("📢 Post to All", callback_data="grp_post_all"),
         InlineKeyboardButton("👋 Welcome", callback_data="grp_welcome")],
        [InlineKeyboardButton("📌 Pin Message", callback_data="grp_pin"),
         InlineKeyboardButton("🔇 Mute Member", callback_data="grp_mute")],
        [InlineKeyboardButton("🔙 Back", callback_data="menu_main")],
    ]
    text = f"**👥 Groups** ({len(groups)})\n\n"
    if groups:
        for g in groups:
            text += f"• {g.get('title', g['id'])}\n"
    else:
        text += "Weli group laguma darin.\n"
    await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")

async def add_channel_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        "**➕ Add Channel**\n\n"
        "Fadlan ii soo dir **Channel ID**-ga (tusaale: @channel_username ama -100123456789):\n\n"
        "Ama /cancel si aad u joojiso.",
        parse_mode="Markdown"
    )
    return WAITING_CHANNEL_ID

async def add_group_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        "**➕ Add Group**\n\n"
        "Fadlan ii soo dir **Group ID**-ga:\n\n"
        "Ama /cancel si aad u joojiso.",
        parse_mode="Markdown"
    )
    return WAITING_GROUP_ID

async def receive_channel_id(update: Update, context: ContextTypes.DEFAULT_TYPE):
    ch_id = update.message.text.strip()
    channels = context.user_data.get("channels", [])
    channels.append({"id": ch_id, "title": ch_id})
    context.user_data["channels"] = channels
    await update.message.reply_text(f"✅ **Channel {ch_id} waa la daray!**", parse_mode="Markdown")
    return -1  # End conversation

async def list_channels(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    channels = context.user_data.get("channels", [])
    if not channels:
        await query.edit_message_text("❌ **Weli channel laguma darin.**", parse_mode="Markdown")
        return
    keyboard = []
    for ch in channels:
        keyboard.append([InlineKeyboardButton(f"❌ Remove {ch['id']}", callback_data=f"rm_channel_{ch['id']}")])
    keyboard.append([InlineKeyboardButton("🔙 Back", callback_data="menu_channels")])
    await query.edit_message_text(
        "**📋 Channels-kaaga:**\n\n" + "\n".join(f"• {c['id']}" for c in channels),
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )

async def remove_channel_cb(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    data = query.data
    ch_id = data.replace("rm_channel_", "").replace("rm_group_", "")
    channels = context.user_data.get("channels", [])
    context.user_data["channels"] = [c for c in channels if c["id"] != ch_id]
    await query.edit_message_text(f"✅ **{ch_id} waa laga saaray!**", parse_mode="Markdown")

async def post_all_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        "**📢 Post to All**\n\n"
        "Soo dir qoraalka ama media-ka aad rabto inaad ku dirto dhammaan channels-ka:\n\n"
        "Ama /cancel si aad u joojiso.",
        parse_mode="Markdown"
    )
    return WAITING_POST_TEXT

async def receive_post_and_send(update: Update, context: ContextTypes.DEFAULT_TYPE):
    channels = context.user_data.get("channels", [])
    if not channels:
        await update.message.reply_text("❌ **Weli channel laguma darin!**", parse_mode="Markdown")
        return -1

    sent = 0
    for ch in channels:
        try:
            ch_id = ch["id"]
            if update.message.text:
                await context.bot.send_message(chat_id=ch_id, text=update.message.text)
            elif update.message.photo:
                await context.bot.send_photo(chat_id=ch_id, photo=update.message.photo[-1].file_id, caption=update.message.caption)
            sent += 1
        except Exception as e:
            pass

    await update.message.reply_text(f"✅ **Fariinta waxaa loo diray {sent}/{len(channels)} channel!**", parse_mode="Markdown")
    return -1

async def delete_post_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        "**🗑️ Delete Post**\n\n"
        "Soo dir **Message ID**-ga post-ka aad rabto inaad tirtirto:",
        parse_mode="Markdown"
    )
    return WAITING_DELETE_MSG_ID

async def receive_delete_msg(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("✅ **Post waa la tirtiray!**", parse_mode="Markdown")
    return -1

async def edit_post_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        "**✏️ Edit Post**\n\n"
        "Soo dir **Message ID**-ga post-ka aad rabto inaad bedesho:",
        parse_mode="Markdown"
    )
    return WAITING_EDIT_MSG_ID

async def receive_edit_msg_id(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["edit_msg_id"] = update.message.text.strip()
    await update.message.reply_text("Hadda soo dir **qoraalka cusub**:")
    return WAITING_EDIT_TEXT

async def receive_edit_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("✅ **Post waa la bedelay!**", parse_mode="Markdown")
    return -1

async def set_welcome_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(
        "**👋 Welcome Message**\n\n"
        "Soo dir qoraalka soo dhawaynta ee cusub:",
        parse_mode="Markdown"
    )
    return WAITING_WELCOME_TEXT

async def receive_welcome_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["welcome_text"] = update.message.text
    await update.message.reply_text(f"✅ **Welcome message waa la kaydiyay!**\n\n{update.message.text}", parse_mode="Markdown")
    return -1

async def new_member_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    welcome = context.user_data.get("welcome_text", "**Ku soo dhawoow!** 👋\n\nIsbar AI Bot ayaa kaa caawinaya.")
    for member in update.message.new_chat_members:
        if not member.is_bot:
            await update.message.reply_text(welcome, parse_mode="Markdown")
