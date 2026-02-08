from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup


def main_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="Tap", callback_data="tap")],
            [
                InlineKeyboardButton(text="Profile", callback_data="profile"),
                InlineKeyboardButton(text="Top", callback_data="top"),
            ],
            [InlineKeyboardButton(text="Invite link", callback_data="invite")],
        ]
    )
