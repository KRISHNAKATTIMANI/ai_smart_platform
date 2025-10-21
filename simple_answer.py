"""
Simple Image Question Answerer - Just upload and get answers!

This script automatically:
1. Asks for your image
2. Detects questions in the image
3. Provides answers immediately

Usage:
    python simple_answer.py
"""

import os
import sys
import google.generativeai as genai
from PIL import Image
import io


def answer_image_questions(image_path):
    """Load image and get answers to questions in it."""

    # Load image
    print(f"\n📂 Loading image: {image_path}")
    try:
        # Handle PDF files
        if image_path.lower().endswith('.pdf'):
            print("⚠️  PDF detected - Converting first page to image...")
            try:
                import fitz  # PyMuPDF

                # Open PDF
                pdf_document = fitz.open(image_path)

                # Get first page
                first_page = pdf_document[0]

                # Convert to image (higher resolution for better OCR)
                zoom = 2  # Zoom factor for better quality
                mat = fitz.Matrix(zoom, zoom)
                pix = first_page.get_pixmap(matrix=mat)

                # Convert to PIL Image
                img_data = pix.tobytes("png")
                image_data = img_data

                pdf_document.close()
                print("✓ PDF converted to image!\n")

            except ImportError:
                print("❌ PDF support not installed!")
                print("Run: pip install PyMuPDF")
                return None
            except Exception as e:
                print(f"❌ Error converting PDF: {str(e)}")
                return None
        else:
            # Regular image file
            with open(image_path, 'rb') as f:
                image_data = f.read()
            print("✓ Image loaded!\n")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None

    # Check API key
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ GEMINI_API_KEY not set!")
        print("Run: $env:GEMINI_API_KEY='your_key'")
        return None

    # Analyze with Gemini
    print("🔍 Analyzing image and finding answers...")
    print("⏳ Please wait 10-30 seconds...\n")

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')

        image = Image.open(io.BytesIO(image_data))

        # Enhanced prompt for questions AND solutions
        prompt = """Carefully analyze this image.

        If there are QUESTIONS visible:
        1. List each question clearly
        2. Provide accurate, detailed ANSWERS
        3. If it's a problem, show the SOLUTION step by step
        4. Number your answers to match the questions

        If there's NO questions:
        - Describe what you see in the image

        Be thorough and accurate in your responses."""

        response = model.generate_content([prompt, image])
        return response.text.strip()

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None


def main():
    """Main function."""
    print("=" * 70)
    print("      SMART IMAGE QUESTION SOLVER & ANSWER GENERATOR")
    print("=" * 70)
    print("\nSupports: JPG, PNG, GIF, BMP, WebP, PDF (first page)")
    print("Provides: Answers + Step-by-step Solutions")
    print()

    # Get image path
    prompt_text = "📸 Enter file path: "
    image_path = input(prompt_text).strip()

    # Remove ALL extra characters (quotes, &, whitespace)
    image_path = image_path.replace('&', '').strip()
    image_path = image_path.strip('"').strip("'").strip()
    # Remove any leading/trailing whitespace again
    image_path = image_path.strip()

    if not image_path:
        print("❌ No path provided!")
        return

    if not os.path.exists(image_path):
        print("❌ File not found: {}".format(image_path))
        print("\nTip: Type the path manually without quotes")
        print("Example: c:\\Users\\Asus\\Pictures\\image.png")
        return

    # Get answers
    result = answer_image_questions(image_path)

    if result:
        print("=" * 70)
        print("              ANSWERS & SOLUTIONS")
        print("=" * 70)
        print()
        print(result)
        print()
        print("=" * 70)
        print("\n✓ Done!")

    # Ask to analyze another
    print()
    again = input("Analyze another file? (y/n): ").strip().lower()
    if again == 'y':
        print("\n")
        main()
    else:
        print("\n✓ Thank you!")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n✓ Bye!")
        sys.exit(0)
