"""
Interactive Command-Line Image Analyzer

This script provides a simple command-line interface where users can:
1. Enter the path to their image file
2. Choose which AI API to use
3. Get a detailed analysis of the image

Usage:
    python image_analyzer_cli.py
"""

import os
import sys
import base64
import requests
import google.generativeai as genai
from PIL import Image
import io


def analyze_with_gemini(image_data, api_key, user_prompt):
    """Analyze image using Gemini API."""
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')

        image = Image.open(io.BytesIO(image_data))

        # Use user's custom prompt
        response = model.generate_content([user_prompt, image])
        return response.text.strip()

    except Exception as e:
        raise Exception(f"Gemini API error: {str(e)}")


def analyze_with_openai(image_data, api_key, user_prompt):
    """Analyze image using OpenAI API."""
    try:
        image_base64 = base64.b64encode(image_data).decode('utf-8')

        url = "https://api.openai.com/v1/chat/completions"

        # Use user's custom prompt
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": user_prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": (f"data:image/jpeg;"
                                        f"base64,{image_base64}")
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 1000
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }

        response = requests.post(
            url,
            json=payload,
            headers=headers,
            timeout=30
        )
        response.raise_for_status()

        result = response.json()
        return result['choices'][0]['message']['content'].strip()

    except Exception as e:
        raise Exception(f"OpenAI API error: {str(e)}")


def load_image(file_path):
    """Load image from file path."""
    try:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        with open(file_path, 'rb') as f:
            return f.read()

    except Exception as e:
        raise Exception(f"Error loading image: {str(e)}")


def main():
    """Main interactive function."""
    print("=" * 60)
    print("AI IMAGE ANALYZER")
    print("=" * 60)
    print()

    # Get image path from user
    while True:
        image_path = input("Enter the path to your image file: ").strip()
        image_path = image_path.strip('"').strip("'")

        if not image_path:
            print("❌ Please enter a valid path!")
            continue

        try:
            print(f"\n📂 Loading image: {image_path}")
            image_data = load_image(image_path)
            print("✓ Image loaded successfully!")
            break
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            retry = input("\nTry another file? (y/n): ").strip().lower()
            if retry != 'y':
                print("Goodbye!")
                return

    # Choose API
    print("\n" + "=" * 60)
    print("SELECT AI API:")
    print("=" * 60)
    print("1. Google Gemini (Fast and powerful)")
    print("2. OpenAI GPT-4o-mini (Detailed analysis)")
    print()

    while True:
        choice = input("Enter your choice (1 or 2): ").strip()

        if choice == '1':
            api_choice = 'gemini'
            api_key = os.getenv('GEMINI_API_KEY')
            if not api_key:
                print("\n❌ GEMINI_API_KEY not set!")
                print("Set it using:")
                print("$env:GEMINI_API_KEY='your_key'")
                return
            break
        elif choice == '2':
            api_choice = 'openai'
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                print("\n❌ OPENAI_API_KEY not set!")
                print("Set it using:")
                print("$env:OPENAI_API_KEY='your_key'")
                return
            break
        else:
            print("❌ Invalid choice! Please enter 1 or 2.")

    # Get custom prompt from user
    print("\n" + "=" * 60)
    print("WHAT DO YOU WANT TO KNOW?")
    print("=" * 60)
    print("Enter your question or request about the image.")
    print("Examples:")
    print("  - Answer the questions in this image")
    print("  - What does this image show?")
    print("  - Extract all text from this image")
    print("  - Explain the content in detail")
    print()
    print("Or press Enter for general analysis.")
    print()

    user_prompt = input("Your question: ").strip()
    if not user_prompt:
        user_prompt = ("Please provide a detailed analysis of this "
                       "image including all visible content, text, "
                       "and answer any questions shown.")

    # Analyze image
    print("\n" + "=" * 60)
    print(f"🔍 ANALYZING IMAGE WITH {api_choice.upper()}...")
    print("=" * 60)
    print("⏳ Please wait...\n")

    try:
        if api_choice == 'gemini':
            result = analyze_with_gemini(image_data, api_key, user_prompt)
        else:
            result = analyze_with_openai(image_data, api_key, user_prompt)

        print("=" * 60)
        print("ANALYSIS RESULT:")
        print("=" * 60)
        print(result)
        print("=" * 60)

    except Exception as e:
        print(f"\n❌ Analysis failed: {str(e)}")
        return

    # Ask if user wants to analyze another image
    print()
    another = input("\nAnalyze another image? (y/n): ").strip().lower()
    if another == 'y':
        print("\n" * 2)
        main()
    else:
        print("\n✓ Thank you for using AI Image Analyzer!")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n✓ Program interrupted. Goodbye!")
        sys.exit(0)
