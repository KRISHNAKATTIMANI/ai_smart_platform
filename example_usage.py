"""
Quick Example: Using the Image Summarizer

This is a simplified example showing how to use the image summarizer
with both Gemini and OpenAI APIs.
"""

import os

# Example 1: Using with a local image file
print("Example 1: Local Image with Gemini")
print("-" * 50)
print("Command:")
print('python image_summarizer.py --image "C:\\path\\to\\your\\image.jpg"')
print()

# Example 2: Using with a URL
print("Example 2: Image from URL with Gemini")
print("-" * 50)
print("Command:")
print('python image_summarizer.py --image "https://example.com/image.jpg"')
print()

# Example 3: Using OpenAI instead
print("Example 3: Using OpenAI API")
print("-" * 50)
print("Command:")
print('python image_summarizer.py --image "image.jpg" --api openai')
print()

# Example 4: Test with a sample image URL
print("Example 4: Try with a real URL")
print("-" * 50)
print("Sample command (works if API key is set):")
sample_url = ("https://upload.wikimedia.org/wikipedia/commons/"
              "thumb/3/3a/Cat03.jpg/400px-Cat03.jpg")
print(f'python image_summarizer.py --image "{sample_url}"')
print()

# Show how to set environment variables
print("\n" + "=" * 50)
print("SETUP INSTRUCTIONS")
print("=" * 50)
print("\nFor Gemini API:")
print("PowerShell:  $env:GEMINI_API_KEY='your_key_here'")
print("CMD:         set GEMINI_API_KEY=your_key_here")
print()
print("For OpenAI API:")
print("PowerShell:  $env:OPENAI_API_KEY='your_key_here'")
print("CMD:         set OPENAI_API_KEY=your_key_here")
print()

# Check current environment
print("\n" + "=" * 50)
print("CURRENT STATUS")
print("=" * 50)
gemini_key = os.getenv('GEMINI_API_KEY')
openai_key = os.getenv('OPENAI_API_KEY')

print(f"Gemini API Key: {'✓ Set' if gemini_key else '✗ Not set'}")
print(f"OpenAI API Key: {'✓ Set' if openai_key else '✗ Not set'}")
print()
