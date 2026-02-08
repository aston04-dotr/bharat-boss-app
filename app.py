import asyncio
from aiohttp import web
from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.webhook.aiohttp_server import SimpleRequestHandler, setup_application
from pyngrok import ngrok
import config
from bot_handlers import router
from db import init_db


async def on_startup(app: web.Application) -> None:
    await init_db()
    bot: Bot = app["bot"]
    if config.NGROK_AUTHTOKEN:
        ngrok.set_auth_token(config.NGROK_AUTHTOKEN)
    tunnel = ngrok.connect(config.PORT, "http")
    public_url = tunnel.public_url.replace("http://", "https://")
    webhook_url = f"{public_url}{config.WEBHOOK_PATH}"
    await bot.set_webhook(webhook_url, drop_pending_updates=True)
    me = await bot.get_me()
    config.set_bot_username(me.username or "")
    print(f"Webhook set to {webhook_url}")


async def on_shutdown(app: web.Application) -> None:
    bot: Bot = app["bot"]
    await bot.delete_webhook(drop_pending_updates=True)
    ngrok.disconnect(config.PORT)
    await bot.session.close()


def main() -> None:
    bot = Bot(config.BOT_TOKEN)
    dp = Dispatcher(storage=MemoryStorage())
    dp.include_router(router)

    app = web.Application()
    app["bot"] = bot

    SimpleRequestHandler(dispatcher=dp, bot=bot).register(app, path=config.WEBHOOK_PATH)
    setup_application(app, dp, bot=bot)

    app.on_startup.append(on_startup)
    app.on_shutdown.append(on_shutdown)

    web.run_app(app, host="0.0.0.0", port=config.PORT)


if __name__ == "__main__":
    main()