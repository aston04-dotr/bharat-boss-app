import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "").strip()
if not BOT_TOKEN:
    raise RuntimeError("BOT_TOKEN is required")

PORT = int(os.getenv("PORT", "3000"))
WEBHOOK_PATH = os.getenv("WEBHOOK_PATH", "/webhook")
DB_PATH = os.getenv("DB_PATH", "bharat_boss.db")
NGROK_AUTHTOKEN = os.getenv("NGROK_AUTHTOKEN", "").strip()

ENERGY_MAX = int(os.getenv("ENERGY_MAX", "10"))
ENERGY_REGEN_SECONDS = int(os.getenv("ENERGY_REGEN_SECONDS", "60"))
TAP_REWARD = int(os.getenv("TAP_REWARD", "1"))
REFERRAL_BONUS = int(os.getenv("REFERRAL_BONUS", "10"))

_bot_username = ""

def set_bot_username(username: str) -> None:
    global _bot_username
    _bot_username = username


def get_bot_username() -> str:
    return _bot_username
