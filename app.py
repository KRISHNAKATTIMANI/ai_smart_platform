"""
ChatGPT-Style AI Assistant Web App
Flask backend with file upload, OCR, and intelligent analysis
"""

import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import google.generativeai as genai
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

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max
app.config['UPLOAD_FOLDER'] = 'uploads'

# Create uploads folder
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


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
            '/api/analyze'
        ]
    })


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
    """Handle general chat messages."""
    try:
        data = request.json
        message = data.get('message', '')

        if not message:
            return jsonify({'error': 'No message provided'}), 400

        # Re-check API key from environment
        api_key = os.getenv('GEMINI_API_KEY') or GEMINI_API_KEY
        if not api_key:
            return jsonify({'error': 'API key not configured'}), 500

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')

        # Create a friendly, helpful prompt
        enhanced_prompt = (
            f"You are a helpful AI assistant. Please answer the "
            f"following question or respond to the user's message "
            f"in a clear, friendly, and informative way.\n\n"
            f"User's message: {message}\n\n"
            f"Provide a well-formatted, easy-to-read response. "
            f"Use proper paragraphs and structure your answer clearly."
        )

        response = model.generate_content(enhanced_prompt)

        return jsonify({
            'success': True,
            'response': response.text.strip()
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


if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("🚀 AI Assistant Web App Starting...")
    print("=" * 60)
    print("\n📍 URL: http://localhost:5000")
    api_status = '✓ Configured' if GEMINI_API_KEY else '✗ Missing'
    print("🔑 API Key: {}".format(api_status))
    print("\n" + "=" * 60 + "\n")
    app.run(debug=True, port=5000, use_reloader=False)
