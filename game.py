import time
import config
import db

def _apply_energy_regen(user: dict) -> dict:
    now = int(time.time())
    energy = user["energy"]
    last_ts = user["last_energy_ts"]

    if energy >= config.ENERGY_MAX:
        return user

    elapsed = now - last_ts
    if elapsed < config.ENERGY_REGEN_SECONDS:
        return user

    regen = elapsed // config.ENERGY_REGEN_SECONDS
    if regen <= 0:
        return user

    new_energy = min(config.ENERGY_MAX, energy + regen)
    new_last_ts = last_ts + int(regen * config.ENERGY_REGEN_SECONDS)
    if new_energy >= config.ENERGY_MAX:
        new_last_ts = now

    updated = user.copy()
    updated["energy"] = new_energy
    updated["last_energy_ts"] = new_last_ts
    return updated


async def ensure_user(user_id: int, referrer_id: int | None) -> dict:
    user = await db.get_user(user_id)
    if user is None:
        user = await db.create_user(user_id, referrer_id)
        if referrer_id and referrer_id != user_id:
            referrer = await db.get_user(referrer_id)
            if referrer:
                await db.add_coins(referrer_id, config.REFERRAL_BONUS)
    user = await refresh_user(user_id)
    return user


async def refresh_user(user_id: int) -> dict:
    user = await db.get_user(user_id)
    if user is None:
        raise ValueError("User not found")

    updated = _apply_energy_regen(user)
    if updated != user:
        await db.update_user(
            user_id,
            updated["coins"],
            updated["energy"],
            updated["last_energy_ts"],
        )
        return updated

    return user


async def tap(user_id: int) -> tuple[bool, dict]:
    user = await refresh_user(user_id)
    if user["energy"] <= 0:
        return False, user

    energy_before = user["energy"]
    coins = user["coins"] + config.TAP_REWARD
    energy = user["energy"] - 1
    last_ts = user["last_energy_ts"]
    if energy_before >= config.ENERGY_MAX:
        last_ts = int(time.time())

    await db.update_user(user_id, coins, energy, last_ts)
    updated = user.copy()
    updated["coins"] = coins
    updated["energy"] = energy
    updated["last_energy_ts"] = last_ts
    return True, updated


async def get_profile(user_id: int) -> dict:
    return await refresh_user(user_id)


async def get_top(limit: int = 10) -> list[dict]:
    return await db.get_top_users(limit)


def get_invite_link(user_id: int) -> str:
    username = config.get_bot_username()
    if not username:
        return "Bot is starting up, please try again shortly."
    return f"https://t.me/{username}?start={user_id}"