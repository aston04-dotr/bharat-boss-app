from aiogram import Router, F
from aiogram.filters import CommandStart
from aiogram.types import Message, CallbackQuery
import config
import game
from keyboards import main_keyboard

router = Router()


@router.message(CommandStart())
async def start_handler(message: Message) -> None:
    referrer_id = None
    if message.text:
        parts = message.text.split()
        if len(parts) > 1:
            try:
                referrer_id = int(parts[1])
            except ValueError:
                referrer_id = None

    await game.ensure_user(message.from_user.id, referrer_id)
    text = (
        "Welcome to Bharat Boss!\n"
        "Tap to earn coins and spend energy. Energy regenerates over time."
    )
    await message.answer(text, reply_markup=main_keyboard())


@router.callback_query(F.data == "tap")
async def tap_handler(callback: CallbackQuery) -> None:
    success, user = await game.tap(callback.from_user.id)
    if not success:
        text = "You are out of energy. Please wait for it to regenerate."
    else:
        text = (
            f"Tap complete!\nCoins: {user['coins']}\n"
            f"Energy: {user['energy']}/{config.ENERGY_MAX}"
        )
    await callback.answer()
    await callback.message.answer(text, reply_markup=main_keyboard())


@router.callback_query(F.data == "profile")
async def profile_handler(callback: CallbackQuery) -> None:
    user = await game.get_profile(callback.from_user.id)
    text = (
        "Your profile:\n"
        f"Coins: {user['coins']}\n"
        f"Energy: {user['energy']}/{config.ENERGY_MAX}"
    )
    await callback.answer()
    await callback.message.answer(text, reply_markup=main_keyboard())


@router.callback_query(F.data == "top")
async def top_handler(callback: CallbackQuery) -> None:
    top_users = await game.get_top(10)
    if not top_users:
        text = "No players yet."
    else:
        lines = ["Top players:"]
        for index, entry in enumerate(top_users, start=1):
            lines.append(f"{index}. {entry['id']} — {entry['coins']} coins")
        text = "\n".join(lines)
    await callback.answer()
    await callback.message.answer(text, reply_markup=main_keyboard())


@router.callback_query(F.data == "invite")
async def invite_handler(callback: CallbackQuery) -> None:
    link = game.get_invite_link(callback.from_user.id)
    text = f"Invite friends with this link:\n{link}"
    await callback.answer()
    await callback.message.answer(text, reply_markup=main_keyboard())
