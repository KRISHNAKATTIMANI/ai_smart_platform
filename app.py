"""
ChatGPT-Style AI Assistant Web App
Flask backend with file upload, OCR, and intelligent analysis
"""

import os
from flask import Flask, request, jsonify, send_file, session
from flask_cors import CORS
from werkzeug.utils import secure_filename
import google.generativeai as genai
import uuid
from database import (
    init_database, track_interaction, get_user_history,
    add_favorite, get_favorites, remove_favorite,
    get_usage_analytics, get_recommendations
)
from language_detector import (
    LanguageDetector, UIStrings,
    process_kannada_text, process_english_text
)
from PIL import Image
import fitz  # PyMuPDF
from docx import Document
import pytesseract
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_LEFT
import io
from datetime import datetime
from urllib.parse import quote

app = Flask(__name__)
# Enable CORS with credentials for session management
CORS(app, supports_credentials=True)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max
app.config['UPLOAD_FOLDER'] = 'uploads'
app.secret_key = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

# Create uploads folder
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize database
init_database()

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Configure LightX AI Expander API
LIGHTX_API_KEY = os.getenv('LIGHTX_API_KEY', '')

# Configure Replicate API for AI Upscaling
REPLICATE_API_KEY = os.getenv('REPLICATE_API_KEY', '')


def get_session_id():
    """Get or create session ID for user tracking."""
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())
    return session['session_id']


def extract_text_from_image(image_path):
    """Extract text from image or describe image content using AI."""
    try:
        # Try Tesseract first
        try:
            img = Image.open(image_path)
            text = pytesseract.image_to_string(img)
            if text.strip():
                return text.strip()
        except Exception:
            pass

        # Use Gemini Vision for image analysis
        if GEMINI_API_KEY:
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-2.5-flash')
            img = Image.open(image_path)

            prompt = """Analyze this image carefully.

If there is TEXT in the image:
- Extract all text exactly as shown
- Preserve formatting and structure
- List any questions clearly

If there is NO TEXT or very little text:
- Describe what you see in detail
- Explain what the image represents
- Identify objects, people, places, or activities
- Describe colors, setting, and mood
- Explain the context or purpose of the image

Be thorough and descriptive."""

            response = model.generate_content([prompt, img])
            return response.text.strip()

        return "Could not analyze image"
    except Exception as e:
        return "Error analyzing image: {}".format(str(e))


def extract_text_from_pdf(pdf_path):
    """Extract text from PDF using PyMuPDF."""
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text.strip()
    except Exception as e:
        return f"Error extracting text from PDF: {str(e)}"


def extract_text_from_docx(docx_path):
    """Extract text from DOCX using python-docx."""
    try:
        doc = Document(docx_path)
        text = "\n".join([para.text for para in doc.paragraphs])
        return text.strip()
    except Exception as e:
        return f"Error extracting text from DOCX: {str(e)}"


def extract_text_from_txt(txt_path):
    """Extract text from TXT file."""
    try:
        with open(txt_path, 'r', encoding='utf-8') as f:
            return f.read().strip()
    except Exception as e:
        return f"Error reading text file: {str(e)}"


def analyze_with_ai(content, prompt=None):
    """Analyze content using Gemini AI with ChatGPT-style formatting."""
    try:
        if not GEMINI_API_KEY:
            return "Error: GEMINI_API_KEY not configured"

        model = genai.GenerativeModel('gemini-2.5-flash')

        if prompt:
            # User provided custom prompt
            full_prompt = """{}

Content:
{}

IMPORTANT: Write in natural, conversational language.
- Use simple, clear sentences
- Explain like you're talking to a friend
- NO markdown symbols (no ##, **, etc.)
- Use "First," "Second," instead of "1." "2."
- Write in paragraphs with proper spacing
- Be conversational and helpful
- Give complete, accurate answers

Make it easy to read and understand.
""".format(prompt, content)
        else:
            # Auto-generate intelligent analysis
            full_prompt = """Analyze this content and provide a
helpful response.

Content:
{}

IMPORTANT INSTRUCTIONS:
- Write in natural, conversational English
- NO markdown symbols (no ##, **, ###, etc.)
- Use simple headings like "Summary:" or "Key Points:"
- Explain things clearly like talking to a friend
- Use "First," "Second," "Third" instead of numbers
- Write in complete sentences and paragraphs
- Be warm, friendly, and helpful
- Give accurate, detailed information

Structure your response naturally:

SUMMARY:
Give a brief overview in 2-3 sentences.

KEY POINTS:
List the main points in a clear, easy-to-read way.

DETAILED EXPLANATION:
Explain everything thoroughly and clearly.

QUESTIONS AND ANSWERS:
If there are questions in the content, answer each one
completely and accurately.

RECOMMENDATIONS:
Suggest helpful next steps or insights.

Write everything in clear, natural language that's easy to understand.
""".format(content)

        response = model.generate_content(full_prompt)
        return response.text.strip()

    except Exception as e:
        return "Error analyzing content: {}".format(str(e))


@app.route('/')
def index():
    """API status endpoint."""
    return jsonify({
        'status': 'running',
        'message': 'AI Assistant API is running successfully!',
        'api_key_configured': bool(GEMINI_API_KEY),
        'endpoints': [
            '/api/upload',
            '/api/chat',
            '/api/download-pdf',
            '/api/usage',
            '/api/analyze',
            '/api/detect-language',
            '/api/ui-strings'
        ]
    })


@app.route('/api/detect-language', methods=['POST'])
def detect_language():
    """Detect language of input text."""
    try:
        data = request.json
        text = data.get('text', '')

        if not text:
            return jsonify({'language': 'en'})

        detected_lang = LanguageDetector.detect_language(text)

        return jsonify({
            'success': True,
            'language': detected_lang,
            'script_name': LanguageDetector.get_script_name(text),
            'is_kannada': detected_lang == 'kn'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/ui-strings', methods=['GET'])
def get_ui_strings():
    """Get UI strings for a specific language."""
    try:
        lang = request.args.get('lang', 'en')

        if lang not in ['en', 'kn']:
            lang = 'en'

        strings = UIStrings.get_all(lang)

        return jsonify({
            'success': True,
            'language': lang,
            'strings': strings
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle file upload and text extraction."""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Save file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Detect file type and extract text
        ext = filename.lower().split('.')[-1]
        extracted_text = ""

        if ext in ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'webp']:
            extracted_text = extract_text_from_image(filepath)
        elif ext == 'pdf':
            extracted_text = extract_text_from_pdf(filepath)
        elif ext == 'docx':
            extracted_text = extract_text_from_docx(filepath)
        elif ext == 'txt':
            extracted_text = extract_text_from_txt(filepath)
        else:
            return jsonify({'error': 'Unsupported file type'}), 400

        # Clean up file
        os.remove(filepath)

        return jsonify({
            'success': True,
            'filename': filename,
            'fileType': ext,
            'extractedText': extracted_text[:500],  # Preview
            'fullText': extracted_text
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/analyze', methods=['POST'])
def analyze_content():
    """Analyze content with AI."""
    try:
        data = request.json
        content = data.get('content', '')
        prompt = data.get('prompt', None)

        if not content:
            return jsonify({'error': 'No content provided'}), 400

        result = analyze_with_ai(content, prompt)

        return jsonify({
            'success': True,
            'result': result
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle general chat messages with language detection."""
    try:
        data = request.json
        message = data.get('message', '')

        if not message:
            return jsonify({'error': 'No message provided'}), 400

        # Detect language / à²­à²¾à²·à³† à²ªà²¤à³à²¤à³†
        detected_lang = LanguageDetector.detect_language(message)

        # Process based on language
        if detected_lang == 'kn':
            # Kannada input - à²•à²¨à³à²¨à²¡ à²‡à²¨à³â€Œà²ªà³à²Ÿà³
            processed_message = process_kannada_text(message)
        else:
            # English input - à²‡à²‚à²—à³à²²à²¿à²·à³ à²‡à²¨à³â€Œà²ªà³à²Ÿà³
            processed_message = process_english_text(message)

        # Re-check API key from environment
        api_key = os.getenv('GEMINI_API_KEY') or GEMINI_API_KEY
        if not api_key:
            return jsonify({'error': 'API key not configured'}), 500

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash-exp')

        # Use the processed message with language context
        response = model.generate_content(processed_message)

        # Track interaction
        session_id = get_session_id()
        track_interaction(session_id, 'text-to-text', 'chat', {
            'message_length': len(message),
            'response_length': len(response.text.strip()),
            'language': detected_lang
        })

        return jsonify({
            'success': True,
            'response': response.text.strip(),
            'language': detected_lang  # Return detected language
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/download-pdf', methods=['POST'])
def download_pdf():
    """Generate and download PDF of AI response."""
    try:
        data = request.json
        content = data.get('content', '')
        title = data.get('title', 'AI Analysis Report')

        if not content:
            return jsonify({'error': 'No content provided'}), 400

        # Create PDF in memory
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter,
                                rightMargin=72, leftMargin=72,
                                topMargin=72, bottomMargin=18)

        # Container for PDF elements
        elements = []

        # Styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor='#2563EB',
            spaceAfter=30,
            alignment=TA_LEFT
        )

        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor='#1F2937',
            spaceAfter=12,
            spaceBefore=12
        )

        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['BodyText'],
            fontSize=11,
            leading=16,
            textColor='#374151'
        )

        # Add title
        elements.append(Paragraph(title, title_style))
        elements.append(Spacer(1, 12))

        # Add timestamp
        timestamp = datetime.now().strftime('%B %d, %Y at %I:%M %p')
        elements.append(Paragraph(
            "Generated: {}".format(timestamp), body_style
        ))
        elements.append(Spacer(1, 20))

        # Process content - split by lines and format
        lines = content.split('\n')
        for line in lines:
            line = line.strip()
            if not line:
                elements.append(Spacer(1, 6))
                continue

            # Check if it's a heading (starts with ## or #)
            if line.startswith('## '):
                elements.append(Paragraph(line[3:], heading_style))
            elif line.startswith('# '):
                elements.append(Paragraph(line[2:], title_style))
            elif line.startswith('**') and line.endswith('**'):
                # Bold text
                clean_line = line.replace('**', '<b>').replace('**', '</b>')
                elements.append(Paragraph(clean_line, body_style))
            else:
                # Regular paragraph - escape special chars
                safe_line = line.replace('&', '&amp;').replace(
                    '<', '&lt;').replace('>', '&gt;')
                safe_line = safe_line.replace('**', '<b>', 1).replace(
                    '**', '</b>', 1)
                elements.append(Paragraph(safe_line, body_style))

        # Build PDF
        doc.build(elements)
        buffer.seek(0)

        return send_file(
            buffer,
            as_attachment=True,
            download_name='AI_Analysis_{}.pdf'.format(
                datetime.now().strftime('%Y%m%d_%H%M%S')
            ),
            mimetype='application/pdf'
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/usage', methods=['GET'])
def get_usage():
    """Get usage statistics for dashboard.

    This is a simple implementation that returns mock data.
    In production, you would track actual usage in a database.
    """
    try:
        # Mock data - replace with actual database queries in production
        usage_data = {
            'textToText': 45,
            'textToImage': 23,
            'imageToText': 67,
            'voiceToText': 12,
            'textToAudio': 34
        }

        return jsonify(usage_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/generate-image', methods=['POST'])
def generate_image():
    """Generate image from text using Pollinations AI."""
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        style = data.get('style', 'realistic')
        size = data.get('size', '1024x1024')

        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        print("=== Image Generation Request ===")
        print(f"Prompt: {prompt}")
        print(f"Style: {style}")
        print(f"Size: {size}")

        # Enhance prompt based on style
        style_prompts = {
            'realistic': 'photorealistic, detailed, high quality',
            'artistic': 'artistic, creative, beautiful artwork',
            'anime': 'anime style, manga, vibrant colors',
            'cartoon': 'cartoon style, fun, colorful',
            '3d': '3D render, octane render, detailed'
        }

        enhanced_prompt = f"{prompt}, {style_prompts.get(style, '')}"

        # Parse size
        width, height = 1024, 1024
        if 'x' in size:
            try:
                w, h = size.split('x')
                width, height = int(w), int(h)
            except Exception:
                pass

        # Generate image using Pollinations AI
        encoded_prompt = quote(enhanced_prompt)
        seed = int(datetime.now().timestamp())
        image_url = (
            f"https://image.pollinations.ai/prompt/{encoded_prompt}"
            f"?width={width}&height={height}&seed={seed}"
            f"&model=flux&nologo=true&enhance=true"
        )

        print(f"Generated image URL: {image_url}")

        # Track interaction
        session_id = get_session_id()
        track_interaction(session_id, 'text-to-image', 'generate', {
            'prompt': prompt[:100],  # Store first 100 chars
            'style': style,
            'size': size
        })

        return jsonify({
            'success': True,
            'image_url': image_url,
            'prompt': prompt,
            'enhanced_prompt': enhanced_prompt
        })

    except Exception as e:
        print(f"Error generating image: {str(e)}")
        return jsonify({'error': str(e)}), 500


def upscale_image_local(filepath, scale_factor):
    """
    FREE local image enhancement using OpenCV and PIL.
    No API calls, no rate limits, completely free!
    """
    import cv2
    import numpy as np
    from PIL import Image, ImageEnhance, ImageFilter

    # Read image with OpenCV
    img = cv2.imread(filepath)

    # Get original dimensions
    height, width = img.shape[:2]
    new_width = int(width * scale_factor)
    new_height = int(height * scale_factor)

    # Use INTER_CUBIC for upscaling (high quality)
    upscaled = cv2.resize(img, (new_width, new_height),
                          interpolation=cv2.INTER_CUBIC)

    # Apply enhancement filters
    # 1. Denoise
    denoised = cv2.fastNlMeansDenoisingColored(
        upscaled, None, 10, 10, 7, 21)

    # 2. Sharpen
    kernel = np.array([[-1, -1, -1],
                       [-1, 9, -1],
                       [-1, -1, -1]])
    sharpened = cv2.filter2D(denoised, -1, kernel)

    # Convert to PIL for additional enhancements
    img_pil = Image.fromarray(cv2.cvtColor(sharpened, cv2.COLOR_BGR2RGB))

    # 3. Enhance contrast
    enhancer = ImageEnhance.Contrast(img_pil)
    img_pil = enhancer.enhance(1.2)

    # 4. Enhance color
    enhancer = ImageEnhance.Color(img_pil)
    img_pil = enhancer.enhance(1.1)

    # 5. Enhance sharpness
    enhancer = ImageEnhance.Sharpness(img_pil)
    img_pil = enhancer.enhance(1.3)

    # 6. Apply unsharp mask for extra detail
    img_pil = img_pil.filter(ImageFilter.UnsharpMask(radius=2, percent=150))

    return img_pil


@app.route('/api/upscale', methods=['POST'])
def upscale_image():
    """Upscale image using multiple methods: LOCAL or Replicate."""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        image_file = request.files['image']
        scale = request.form.get('scale', '2')  # 2x or 4x
        face_enhance = request.form.get('face_enhance', 'false') == 'true'
        method = request.form.get('method', 'local')

        print("=== Image Upscaling Request ===")
        print(f"Image: {image_file.filename}")
        print(f"Scale: {scale}x")
        print(f"Face Enhance: {face_enhance}")
        print(f"Method: {method}")

        # Save uploaded image temporarily
        filename = secure_filename(image_file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_filename = f"{timestamp}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        image_file.save(filepath)

        # Choose enhancement method
        if method == 'local':
            print("Using FREE local enhancement (OpenCV + PIL)...")

            # Use local enhancement
            enhanced_img = upscale_image_local(filepath, int(scale))

            # Save enhanced image
            output_filename = f"enhanced_{unique_filename}"
            output_path = os.path.join(
                app.config['UPLOAD_FOLDER'], output_filename)
            enhanced_img.save(output_path, 'PNG', quality=95, optimize=True)

            # Convert to base64 for response
            import base64
            import io
            buffered = io.BytesIO()
            enhanced_img.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
            image_url = f"data:image/png;base64,{img_str}"

            # Clean up uploaded file
            try:
                os.remove(filepath)
            except Exception:
                pass

            print("Local upscaling successful!")

            return jsonify({
                'success': True,
                'image_url': image_url,
                'scale': scale,
                'method': 'local',
                'message': 'Enhanced using FREE local processing (OpenCV)'
            })

        else:  # method == 'replicate'
            # Read image and convert to base64
            import base64
            with open(filepath, 'rb') as f:
                image_data = base64.b64encode(f.read()).decode('utf-8')

            # Use Replicate API
            import replicate

            print("Calling Replicate API for upscaling...")

            # Set API token
            os.environ["REPLICATE_API_TOKEN"] = REPLICATE_API_KEY

            # Use Real-ESRGAN model
            model_version = (
                "nightmareai/real-esrgan:"
                "42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c"
                "1d7b"
            )

            output = replicate.run(
                model_version,
                input={
                    "image": f"data:image/jpeg;base64,{image_data}",
                    "scale": int(scale),
                    "face_enhance": face_enhance
                }
            )

            # Clean up uploaded file
            try:
                os.remove(filepath)
            except Exception:
                pass

            print(f"Upscaling successful! Output: {output}")

            return jsonify({
                'success': True,
                'image_url': output,
                'scale': scale,
                'face_enhance': face_enhance,
                'method': 'replicate'
            })

    except Exception as e:
        error_message = str(e)
        print(f"Error upscaling image: {error_message}")
        import traceback
        traceback.print_exc()

        # Check if it's a rate limit error
        if '429' in error_message or 'rate limit' in error_message.lower():
            return jsonify({
                'error': 'Rate Limit Exceeded',
                'message': (
                    'The Replicate API has a rate limit on the free tier. '
                    'Please wait a minute and try again, or upgrade your '
                    'Replicate account to remove limits.'
                ),
                'details': error_message
            }), 429

        # Check if it's a credit/billing error
        if ('402' in error_message or
                'insufficient credit' in error_message.lower() or
                'billing' in error_message.lower()):
            return jsonify({
                'error': 'Insufficient Credits',
                'message': (
                    'Your Replicate account does not have enough credits. '
                    'Please add a payment method at '
                    'https://replicate.com/account/billing '
                    'to purchase credits and use this feature.'
                ),
                'details': error_message
            }), 402

        return jsonify({
            'error': 'Image upscaling failed',
            'message': error_message
        }), 500


@app.route('/api/outpaint', methods=['POST'])
def outpaint_image():
    """Expand and complete images using LightX AI Expander."""
    try:
        print("=== Outpaint Request Received ===")

        if 'image' not in request.files:
            print("Error: No image in request")
            return jsonify({'error': 'No image provided'}), 400

        image_file = request.files['image']
        prompt = request.form.get('prompt', '')
        direction = request.form.get('direction', 'all')

        print(f"Image: {image_file.filename}")
        print(f"Prompt: {prompt}")
        print(f"Direction: {direction}")

        if not prompt:
            print("Error: No prompt provided")
            return jsonify({
                'error': 'Prompt required to describe expansion'
            }), 400

        # Save uploaded image temporarily
        filename = secure_filename(image_file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_filename = f"{timestamp}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        image_file.save(filepath)

        # Read image as base64
        import base64
        with open(filepath, 'rb') as f:
            image_data = base64.b64encode(f.read()).decode('utf-8')

        # Prepare LightX AI Expander API request
        import requests

        lightx_url = (
            "https://api.lightxeditor.com/external/api/v1/outpainting"
        )

        headers = {
            'x-api-key': LIGHTX_API_KEY,
            'Content-Type': 'application/json'
        }

        # Map direction to aspect ratio
        aspect_ratio = "16:9"  # default
        if direction == "horizontal":
            aspect_ratio = "16:9"
        elif direction == "vertical":
            aspect_ratio = "9:16"
        elif direction == "all":
            aspect_ratio = "1:1"

        payload = {
            "image": f"data:image/jpeg;base64,{image_data}",
            "prompt": prompt,
            "aspect_ratio": aspect_ratio,
            "creativity": 0.7
        }

        # Call LightX AI Expander API
        print("Calling LightX AI API...")
        print(f"Payload: Aspect={aspect_ratio}")

        try:
            response = requests.post(
                lightx_url, json=payload, headers=headers, timeout=30
            )

            print(f"LightX Status: {response.status_code}")

            if response.status_code == 200:
                result = response.json()
                img_url = result.get('output_url')
                image_url = img_url or result.get('image_url')

                if image_url:
                    print(f"Success! Image URL: {image_url}")

                    # Clean up uploaded file
                    try:
                        os.remove(filepath)
                    except Exception:
                        pass

                    return jsonify({
                        'success': True,
                        'image_url': image_url,
                        'enhanced_prompt': prompt
                    })
        except requests.exceptions.Timeout:
            print("LightX timeout - falling back...")
        except Exception as e:
            print(f"LightX error: {str(e)} - falling back...")

        # Fallback to Pollinations AI if LightX fails
        print("Using Pollinations AI fallback...")
        enhanced_prompt = prompt

        if GEMINI_API_KEY:
            try:
                genai.configure(api_key=GEMINI_API_KEY)
                model = genai.GenerativeModel('gemini-2.5-flash')
                img = Image.open(filepath)
                analysis_prompt = (
                    f"Create detailed description for "
                    f"expanding: {prompt}. "
                    f"Add what should complete the scene."
                )
                ai_response = model.generate_content(
                    [analysis_prompt, img]
                )
                enhanced_prompt = ai_response.text.strip()
                print(f"Enhanced: {enhanced_prompt[:100]}...")
            except Exception as e:
                print(f"Gemini error: {str(e)}")

        encoded_prompt = quote(enhanced_prompt)
        seed = int(datetime.now().timestamp())
        image_url = (
            f"https://image.pollinations.ai/prompt/{encoded_prompt}"
            f"?width=1920&height=1080&seed={seed}"
            f"&model=flux&nologo=true&enhance=true"
        )

        print("Fallback image generated")

        # Clean up uploaded file
        try:
            os.remove(filepath)
        except Exception:
            pass

        return jsonify({
            'success': True,
            'image_url': image_url,
            'enhanced_prompt': enhanced_prompt
        })

    except Exception as e:
        print(f"Error in outpaint: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/transcribe-audio', methods=['POST'])
def transcribe_audio():
    """Transcribe audio file using Gemini AI."""
    try:
        print("=== Audio Transcription Request ===")

        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio']

        if audio_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        print(f"Audio file: {audio_file.filename}")

        # Save audio temporarily
        filename = secure_filename(audio_file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_filename = f"{timestamp}_{filename}"
        filepath = os.path.join(
            app.config['UPLOAD_FOLDER'], unique_filename
        )
        audio_file.save(filepath)

        try:
            # Use Gemini AI to transcribe
            if not GEMINI_API_KEY:
                return jsonify({
                    'error': 'Gemini API not configured'
                }), 500

            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-2.5-flash')

            # Upload audio file to Gemini
            uploaded_audio = genai.upload_file(filepath)

            prompt = (
                "Transcribe this audio accurately. "
                "Provide the exact words spoken with proper punctuation "
                "and formatting. If the audio is unclear, note that in "
                "your transcription."
            )

            response = model.generate_content([prompt, uploaded_audio])
            transcription = response.text.strip()

            print(f"Transcription complete: {transcription[:100]}...")

            # Clean up
            try:
                os.remove(filepath)
            except Exception:
                pass

            return jsonify({
                'success': True,
                'transcription': transcription
            })

        except Exception as e:
            print(f"Gemini transcription error: {str(e)}")
            # Clean up
            try:
                os.remove(filepath)
            except Exception:
                pass
            return jsonify({
                'error': f'Transcription failed: {str(e)}'
            }), 500

    except Exception as e:
        print(f"Error in transcribe: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/generate-speech', methods=['POST'])
def generate_speech():
    """Generate speech from text and return audio URL."""
    try:
        data = request.get_json()
        text = data.get('text', '')

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        print("=== Speech Generation Request ===")
        print(f"Text: {text[:100]}...")

        # For now, return instructions for browser-based TTS
        # In production, integrate with Google TTS, ElevenLabs, or similar
        return jsonify({
            'success': True,
            'message': 'Use browser speech synthesis',
            'text': text,
            'instructions': (
                'Audio generation is handled client-side '
                'for optimal performance'
            )
        })

    except Exception as e:
        print(f"Error in generate-speech: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/track', methods=['POST'])
def track():
    """Track user interaction."""
    try:
        data = request.get_json()
        feature_type = data.get('feature_type', '')
        action = data.get('action', '')
        interaction_data = data.get('data', {})

        session_id = get_session_id()

        success = track_interaction(
            session_id, feature_type, action, interaction_data
        )

        return jsonify({
            'success': success,
            'session_id': session_id
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/history', methods=['GET'])
def history():
    """Get user interaction history."""
    try:
        session_id = get_session_id()
        limit = request.args.get('limit', 50, type=int)

        user_history = get_user_history(session_id, limit)

        return jsonify({
            'success': True,
            'history': user_history,
            'count': len(user_history)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/favorites', methods=['GET', 'POST', 'DELETE'])
def favorites():
    """Manage user favorites."""
    try:
        session_id = get_session_id()

        if request.method == 'GET':
            # Get favorites
            user_favorites = get_favorites(session_id)
            return jsonify({
                'success': True,
                'favorites': user_favorites,
                'count': len(user_favorites)
            })

        elif request.method == 'POST':
            # Add favorite
            data = request.get_json()
            item_type = data.get('item_type', '')
            item_data = data.get('item_data', {})

            success = add_favorite(session_id, item_type, item_data)

            return jsonify({
                'success': success,
                'message': (
                    'Added to favorites' if success else 'Failed to add'
                )
            })

        elif request.method == 'DELETE':
            # Remove favorite
            data = request.get_json()
            favorite_id = data.get('favorite_id', 0)

            success = remove_favorite(session_id, favorite_id)

            return jsonify({
                'success': success,
                'message': (
                    'Removed from favorites'
                    if success else 'Failed to remove'
                )
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/analytics', methods=['GET'])
def analytics():
    """Get usage analytics and statistics."""
    try:
        session_id = get_session_id()
        include_global = (
            request.args.get('global', 'false').lower() == 'true'
        )

        user_analytics = get_usage_analytics(session_id)

        result = {
            'success': True,
            'user_analytics': user_analytics
        }

        if include_global:
            global_analytics = get_usage_analytics()
            result['global_analytics'] = global_analytics

        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/recommendations', methods=['GET'])
def recommendations():
    """Get personalized recommendations based on user history."""
    try:
        session_id = get_session_id()

        user_recommendations = get_recommendations(session_id)

        return jsonify({
            'success': True,
            'recommendations': user_recommendations
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("ðŸš€ AI Assistant Web App Starting...")
    print("=" * 60)
    print("\nðŸ“ URL: http://localhost:5000")
    api_status = 'âœ“ Configured' if GEMINI_API_KEY else 'âœ— Missing'
    print("ðŸ”‘ API Key: {}".format(api_status))
    print("\n" + "=" * 60 + "\n")
    app.run(debug=True, port=5000, use_reloader=False)