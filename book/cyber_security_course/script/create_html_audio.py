import os
from bs4 import BeautifulSoup
from gtts import gTTS

# Get the path of the current script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))

# Define the parent folder (one level up from the script's directory)
parent_dir = os.path.dirname(script_dir)

# Define the output directory for the MP3 files
# It will be a new folder named 'audio' inside the script's directory
output_dir = os.path.join(script_dir, 'audio')
if not os.path.exists(output_dir):
    os.makedirs(output_dir)
    print(f"Created output directory: {output_dir}")

# Iterate over all files in the parent directory
for filename in os.listdir(parent_dir):
    # Check if the file is an HTML file and not a folder
    if filename.endswith(".html") and os.path.isfile(os.path.join(parent_dir, filename)):
        file_path = os.path.join(parent_dir, filename)

        try:
            # Read the HTML content
            with open(file_path, 'r', encoding='utf-8') as f:
                html_content = f.read()

            # Parse the HTML and extract plain text
            soup = BeautifulSoup(html_content, 'html.parser')
            plain_text = soup.get_text(separator=' ', strip=True)

            # Define the output MP3 filename
            # The name will be the original HTML filename with a .mp3 extension
            mp3_filename = os.path.splitext(filename)[0] + '.mp3'
            output_path = os.path.join(output_dir, mp3_filename)

            # Generate and save the audio file
            tts = gTTS(text=plain_text, lang='en')
            tts.save(output_path)
            print(f"Successfully created audio for '{filename}' at '{output_path}'")

        except Exception as e:
            print(f"Error processing {filename}: {e}")