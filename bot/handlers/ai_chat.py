"""
ai_chat.py — AI Chat handlers (Nano, Midjourney, Sora, GPT Image, Flux, Veo)
"""
import os
import json
import aiohttp
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
import config

AI_MODELS = {
    "nano": "nousresearch/hermes-3-llama-3.1-405b:free",
    "midjourney": "midjourney/midjourney",
    "sora": "openai/sora",
    "gpt_image": "openai/dall-e-3",
    "flux": "black-forest-labs/flux-1.1-pro",
    "veo": "google/veo",
}

async def ai_chat_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle free-form AI chat messages."""
    user_msg = update.message.text
    if not user_msg:
        return

    model = context.user_data.get("ai_model", "nano")
    api_key = config.OPENROUTER_API_KEY or config.GROQ_API_KEY
    base_url = "https://openrouter.ai/api/v1" if config.OPENROUTER_API_KEY else "https://api.groq.com/openai/v1"

    thinking = await update.message.reply_text("🤔 **Fakaraya...**", parse_mode="Markdown")

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": AI_MODELS.get(model, AI_MODELS["nano"]),
                    "messages": [
                        {"role": "system", "content": "Waxaad tahay Isbar AI, kaaliye Soomaali ah. Ku jawaab Soomaali marka su'aashu Soomaali tahay, English markay English tahay. Noqo mid waxtar leh oo saaxiibtinimo leh."},
                        {"role": "user", "content": user_msg},
                    ],
                },
                timeout=aiohttp.ClientTimeout(total=30),
            ) as resp:
                data = await resp.json()
                reply = data["choices"][0]["message"]["content"]
    except Exception as e:
        reply = f"⚠️ **Error:** {str(e)}\n\nFadlan isku day mar kale."

    await thinking.edit_text(reply, parse_mode="Markdown")

async def ai_menu(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    keyboard = [
        [InlineKeyboardButton("🧠 Nano (Free)", callback_data="ai_nano"),
         InlineKeyboardButton("🎨 Midjourney", callback_data="ai_midjourney")],
        [InlineKeyboardButton("🎬 Sora Video", callback_data="ai_sora"),
         InlineKeyboardButton("🖼️ GPT Image", callback_data="ai_gpt_image")],
        [InlineKeyboardButton("✨ Flux", callback_data="ai_flux"),
         InlineKeyboardButton("📹 Veo", callback_data="ai_veo")],
        [InlineKeyboardButton("🔙 Back", callback_data="menu_main")],
    ]
    await query.edit_message_text(
        "**AI Chat** 🤖\n\nDooro model-ka aad rabto:\n\n"
        "🧠 **Nano** — Free AI chat\n"
        "🎨 **Midjourney** — Image generation\n"
        "🎬 **Sora** — Video generation\n"
        "🖼️ **GPT Image** — DALL-E images\n"
        "✨ **Flux** — Fast image gen\n"
        "📹 **Veo** — Google video gen",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )

async def select_ai_model(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    model = query.data.replace("ai_", "")
    context.user_data["ai_model"] = model
    await query.edit_message_text(
        f"✅ **{model.title()}** waa la doortay!\n\n"
        f"Hadda waxaad i soo dirtay fariintaada, waan kaa jawaabayaa.",
        parse_mode="Markdown"
    )

async def clear_memory_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data.clear()
    await update.message.reply_text("✅ **Xusuusta waa la nadiifiyay!**", parse_mode="Markdown")

async def nano_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["ai_model"] = "nano"
    await update.message.reply_text("✅ **Nano model** waa la doortay! Soo dir fariintaada.", parse_mode="Markdown")

async def midjourney_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["ai_model"] = "midjourney"
    await update.message.reply_text("✅ **Midjourney** waa la doortay! Soo dir prompt-ka sawirka.", parse_mode="Markdown")

async def sora_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["ai_model"] = "sora"
    await update.message.reply_text("✅ **Sora** waa la doortay! Soo dir prompt-ka video-ga.", parse_mode="Markdown")

async def gpt_image_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["ai_model"] = "gpt_image"
    await update.message.reply_text("✅ **GPT Image** waa la doortay! Soo dir prompt-ka sawirka.", parse_mode="Markdown")

async def flux_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["ai_model"] = "flux"
    await update.message.reply_text("✅ **Flux** waa la doortay! Soo dir prompt-ka sawirka.", parse_mode="Markdown")

async def veo_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["ai_model"] = "veo"
    await update.message.reply_text("✅ **Veo** waa la doortay! Soo dir prompt-ka video-ga.", parse_mode="Markdown")
