"""
Image Summarizer using Google Gemini 1.5 or OpenAI GPT-4o-mini API

This script takes an image file (local path or URL) as input,
sends it to a multimodal AI API, and returns a summarized description.

Usage:
    python image_summarizer.py --image <path_or_url> --api <gemini|openai>

Environment Variables Required:
    - GEMINI_API_KEY: For Google Gemini API
    - OPENAI_API_KEY: For OpenAI API
"""

import os
import sys
import argparse
import base64
import requests
import google.generativeai as genai
from PIL import Image
import io


def load_image_from_path(image_path: str) -> bytes:
    """
    Load an image from a local file path.

    Args:
        image_path: Path to the local image file

    Returns:
        Image data as bytes

    Raises:
        FileNotFoundError: If the image file doesn't exist
        IOError: If there's an error reading the file
    """
    try:
        with open(image_path, 'rb') as image_file:
            return image_file.read()
    except FileNotFoundError:
        raise FileNotFoundError(f"Image file not found: {image_path}")
    except Exception as e:
        raise IOError(f"Error reading image file: {str(e)}")


def load_image_from_url(image_url: str) -> bytes:
    """
    Download an image from a URL.

    Args:
        image_url: URL of the image to download

    Returns:
        Image data as bytes

    Raises:
        requests.RequestException: If error downloading the image
    """
    try:
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()
        return response.content
    except requests.RequestException as e:
        error_msg = f"Error downloading image from URL: {str(e)}"
        raise requests.RequestException(error_msg)


def is_url(path: str) -> bool:
    """Check if the given path is a URL."""
    return path.startswith(('http://', 'https://'))


def summarize_with_gemini(image_data: bytes, api_key: str) -> str:
    """
    Send an image to Google Gemini 1.5 API and get a summary.

    Args:
        image_data: Image data as bytes
        api_key: Google Gemini API key

    Returns:
        Summary text from Gemini

    Raises:
        Exception: If API request fails
    """
    try:
        # Configure the Gemini API
        genai.configure(api_key=api_key)

        # Create the model (using gemini-2.5-flash)
        model = genai.GenerativeModel('gemini-2.5-flash')

        # Convert bytes to PIL Image
        image = Image.open(io.BytesIO(image_data))

        # Generate content
        prompt = ("Summarize the content or meaning of this image "
                  "in 2-3 lines.")
        response = model.generate_content([prompt, image])

        return response.text.strip()

    except Exception as e:
        raise Exception(f"Gemini API request failed: {str(e)}")


def summarize_with_openai(image_data: bytes, api_key: str) -> str:
    """
    Send an image to OpenAI GPT-4o-mini API and get a summary.

    Args:
        image_data: Image data as bytes
        api_key: OpenAI API key

    Returns:
        Summary text from GPT-4o-mini

    Raises:
        requests.RequestException: If API request fails
    """
    # Encode image to base64
    image_base64 = base64.b64encode(image_data).decode('utf-8')

    # OpenAI API endpoint
    url = "https://api.openai.com/v1/chat/completions"

    # Prepare the request payload
    prompt_text = ("Summarize the content or meaning of this image "
                   "in 2-3 lines.")
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt_text
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_base64}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 300
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    try:
        # Send request to OpenAI API
        response = requests.post(
            url, json=payload, headers=headers, timeout=30
        )
        response.raise_for_status()

        # Parse response
        result = response.json()

        # Extract the summary text
        if 'choices' in result and len(result['choices']) > 0:
            text = result['choices'][0]['message']['content']
            return text.strip()
        else:
            raise ValueError("Unexpected response format from OpenAI API")

    except requests.RequestException as e:
        raise requests.RequestException(
            f"OpenAI API request failed: {str(e)}"
        )
    except (KeyError, IndexError, ValueError) as e:
        raise ValueError(f"Error parsing OpenAI API response: {str(e)}")


def main():
    """Main function to orchestrate the image summarization process."""

    # Parse command-line arguments
    parser = argparse.ArgumentParser(
        description='Summarize an image using AI APIs (Gemini or OpenAI)'
    )
    parser.add_argument(
        '--image',
        required=True,
        help='Path to local image file or image URL'
    )
    parser.add_argument(
        '--api',
        choices=['gemini', 'openai'],
        default='gemini',
        help='API to use for summarization (default: gemini)'
    )

    args = parser.parse_args()

    # Step 1: Load the image from disk or URL
    print(f"Loading image from: {args.image}")
    try:
        if is_url(args.image):
            image_data = load_image_from_url(args.image)
            print("✓ Image downloaded successfully")
        else:
            image_data = load_image_from_path(args.image)
            print("✓ Image loaded successfully")
    except Exception as e:
        print(f"✗ Error loading image: {str(e)}", file=sys.stderr)
        sys.exit(1)

    # Step 2: Get the API key from environment variables
    if args.api == 'gemini':
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            msg = "✗ Error: GEMINI_API_KEY environment variable not set"
            print(msg, file=sys.stderr)
            print("Please set it using: set GEMINI_API_KEY=your_api_key",
                  file=sys.stderr)
            sys.exit(1)
    else:  # openai
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            msg = "✗ Error: OPENAI_API_KEY environment variable not set"
            print(msg, file=sys.stderr)
            print("Please set it using: set OPENAI_API_KEY=your_api_key",
                  file=sys.stderr)
            sys.exit(1)

    # Step 3: Send the image to the chosen API and get summary
    print(f"\nSending image to {args.api.upper()} API...")
    try:
        if args.api == 'gemini':
            summary = summarize_with_gemini(image_data, api_key)
        else:  # openai
            summary = summarize_with_openai(image_data, api_key)

        print("✓ Summary received successfully\n")

        # Step 4: Print the summary
        print("=" * 60)
        print("IMAGE SUMMARY:")
        print("=" * 60)
        print(summary)
        print("=" * 60)

    except Exception as e:
        print(f"✗ Error during API request: {str(e)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
