import time
import aiosqlite
import config


async def init_db() -> None:
    async with aiosqlite.connect(config.DB_PATH) as db:
        await db.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                coins INTEGER NOT NULL,
                energy INTEGER NOT NULL,
                last_energy_ts INTEGER NOT NULL,
                referrer_id INTEGER
            )
            """
        )
        await db.commit()


async def get_user(user_id: int) -> dict | None:
    async with aiosqlite.connect(config.DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT id, coins, energy, last_energy_ts, referrer_id FROM users WHERE id = ?",
            (user_id,),
        )
        row = await cursor.fetchone()
        await cursor.close()
        return dict(row) if row else None


async def create_user(user_id: int, referrer_id: int | None) -> dict:
    now = int(time.time())
    async with aiosqlite.connect(config.DB_PATH) as db:
        await db.execute(
            """
            INSERT INTO users (id, coins, energy, last_energy_ts, referrer_id)
            VALUES (?, ?, ?, ?, ?)
            """,
            (user_id, 0, config.ENERGY_MAX, now, referrer_id),
        )
        await db.commit()
    return await get_user(user_id)


async def update_user(user_id: int, coins: int, energy: int, last_energy_ts: int) -> None:
    async with aiosqlite.connect(config.DB_PATH) as db:
        await db.execute(
            """
            UPDATE users
            SET coins = ?, energy = ?, last_energy_ts = ?
            WHERE id = ?
            """,
            (coins, energy, last_energy_ts, user_id),
        )
        await db.commit()


async def add_coins(user_id: int, amount: int) -> None:
    async with aiosqlite.connect(config.DB_PATH) as db:
        await db.execute(
            "UPDATE users SET coins = coins + ? WHERE id = ?",
            (amount, user_id),
        )
        await db.commit()


async def get_top_users(limit: int = 10) -> list[dict]:
    async with aiosqlite.connect(config.DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            """
            SELECT id, coins
            FROM users
            ORDER BY coins DESC, id ASC
            LIMIT ?
            """,
            (limit,),
        )
        rows = await cursor.fetchall()
        await cursor.close()
        return [dict(row) for row in rows]
