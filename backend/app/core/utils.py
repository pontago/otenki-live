from asyncio import Semaphore, gather
from collections.abc import Awaitable


async def parallel(tasks: list[Awaitable], concurrency: int) -> list:
    sem = Semaphore(concurrency)

    async def exec(task):
        async with sem:
            return await task

    return await gather(*[exec(task) for task in tasks])
