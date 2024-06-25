#!/usr/bin/env python3
from telethon.sync import TelegramClient
from telethon.tl.functions.messages import GetHistoryRequest
from telethon.tl.types import InputPeerChannel
import json
import os


api_id = '24601844'
api_hash = 'fec54757a8a04552135a120af34d8bbd'
phone_number = '+6588309804'
channel_username = '@lowcalgigssg'

client = TelegramClient('session_name', api_id, api_hash)

async def fetch_messages():
    # Wait until the client is connected
    await client.connect()
    while not await client.is_user_authorized():
        await client.send_code_request(phone_number)
        await client.sign_in(phone_number, input('Enter the code: '))
    
    me = await client.get_me()
    print(f'Logged in as {me.first_name}')

    # Get the channel entity
    entity = await client.get_entity(channel_username)
    # Create an InputPeerChannel object
    my_channel = InputPeerChannel(entity.id, entity.access_hash)

    # Fetch the last 10 messages
    messages = await client(GetHistoryRequest(
        peer=my_channel,
        limit=15,
        offset_date=None,
        offset_id=0,
        max_id=0,
        min_id=0,
        add_offset=0,
        hash=0
    ))
    return messages.messages

async def get_media_url(message):
    if message.media:
        if message.photo:
            media_path = await client.download_media(message, file=os.path.join('media', f'{message.id}.jpg'))
            return media_path
    return None



async def main():
    await client.start(phone_number)
    messages = await fetch_messages()
    
    # Create media directory if it does not exist
    os.makedirs('media', exist_ok=True)
    
    # Save messages to JSON
    messages_list = []
    for msg in messages:
        media_url = await get_media_url(msg)
        message_data = {
            "id": msg.id,
            "message": msg.message,
            "date": str(msg.date),
            "media_url": media_url
        }
        messages_list.append(message_data)

    with open('messages.json', 'w') as f:
        json.dump(messages_list, f, indent=4)

with client:
    client.loop.run_until_complete(main())
