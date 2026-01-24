import os
import asyncio
from bs4 import BeautifulSoup
from edge_tts import VoicesManager, Communicate
from pydub import AudioSegment

# Get the path of the current script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))

# Define the parent folder (one level up from the script's directory)
parent_dir = os.path.dirname(script_dir)

# Define the output directory for the final MP3 files
output_dir = os.path.join(script_dir, 'audio')
if not os.path.exists(output_dir):
    os.makedirs(output_dir)
    print(f"Created output directory: {output_dir}")

async def main():
    # Fetch a list of all available voices.
    try:
        voices = await VoicesManager.create()
        # Find a male voice in English
        voice_name = voices.find(Gender="Male", Language="en")[0]["Name"]
    except Exception as e:
        print(f"Error fetching voices: {e}")
        return

    # Iterate over all files in the parent directory
    for filename in os.listdir(parent_dir):
        # Check if the file is an HTML file
        if filename.endswith(".html") and os.path.isfile(os.path.join(parent_dir, filename)):
            file_path = os.path.join(parent_dir, filename)
            print(f"Processing file: {filename}")

            try:
                # Read the HTML content
                with open(file_path, 'r', encoding='utf-8') as f:
                    html_content = f.read()

                # Parse the HTML and find all text-bearing elements
                soup = BeautifulSoup(html_content, 'html.parser')
                text_elements = soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'li'])

                audio_segments = []
                temp_audio_dir = os.path.join(output_dir, "temp")
                if not os.path.exists(temp_audio_dir):
                    os.makedirs(temp_audio_dir)

                # Process each paragraph or header as a separate chunk
                for i, element in enumerate(text_elements):
                    plain_text = element.get_text(strip=True)
                    if not plain_text:
                        continue

                    # Construct SSML for the chunk with a break
                    ssml_chunk = f'<speak>{plain_text}<break time="1s"/></speak>'

                    # Generate a temporary audio file for the chunk
                    temp_audio_path = os.path.join(temp_audio_dir, f"chunk_{i}.mp3")
                    
                    # Pass ssml=True to tell the library to interpret the tags
                    communicate = Communicate(text=ssml_chunk, voice=voice_name, ssml=True)
                    await communicate.save(temp_audio_path)
                    
                    # Load the temporary audio file and add it to the list
                    audio_segments.append(AudioSegment.from_mp3(temp_audio_path))
                    os.remove(temp_audio_path) # Clean up the temporary file

                # Concatenate all audio segments
                if audio_segments:
                    final_audio = AudioSegment.empty()
                    for segment in audio_segments:
                        final_audio += segment
                    
                    # Save the final, concatenated audio file
                    final_mp3_filename = os.path.splitext(filename)[0] + '.mp3'
                    final_output_path = os.path.join(output_dir, final_mp3_filename)
                    final_audio.export(final_output_path, format="mp3")
                    
                    print(f"Successfully created complete audio for '{filename}' at '{final_output_path}'")
                    os.rmdir(temp_audio_dir) # Clean up the temp directory
                else:
                    print(f"No text found in {filename} to convert.")

            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    asyncio.run(main())