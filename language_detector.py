"""
Language Detection and Processing Module
ಭಾಷೆ ಪತ್ತೆ ಮತ್ತು ಪ್ರಕ್ರಿಯೆ ಮಾಡ್ಯೂಲ್

Supports: English and Kannada (ಕನ್ನಡ)
"""

from typing import Dict


class LanguageDetector:
    """
    Detects and manages language context for the application
    ಅಪ್ಲಿಕೇಶನ್‌ಗಾಗಿ ಭಾಷಾ ಸಂದರ್ಭವನ್ನು ಪತ್ತೆಹಚ್ಚುತ್ತದೆ ಮತ್ತು ನಿರ್ವಹಿಸುತ್ತದೆ
    """

    # Kannada Unicode range: 0C80-0CFF
    KANNADA_RANGE = (0x0C80, 0x0CFF)

    @staticmethod
    def detect_language(text: str) -> str:
        """
        Detect if text is in Kannada or English
        ಪಠ್ಯ ಕನ್ನಡದಲ್ಲಿದೆಯೇ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿದೆಯೇ ಎಂದು ಪತ್ತೆಹಚ್ಚಿ

        Args:
            text (str): Input text to analyze

        Returns:
            str: 'kn' for Kannada, 'en' for English
        """
        if not text or not text.strip():
            return 'en'  # Default to English for empty input

        # Count Kannada characters
        kannada_chars = 0
        total_chars = 0

        for char in text:
            if char.strip():  # Skip whitespace
                code_point = ord(char)
                total_chars += 1

                # Check if character is in Kannada Unicode range
                range_start = LanguageDetector.KANNADA_RANGE[0]
                range_end = LanguageDetector.KANNADA_RANGE[1]
                if range_start <= code_point <= range_end:
                    kannada_chars += 1

        if total_chars == 0:
            return 'en'

        # If more than 30% characters are Kannada, classify as Kannada
        kannada_percentage = (kannada_chars / total_chars) * 100

        return 'kn' if kannada_percentage > 30 else 'en'

    @staticmethod
    def is_kannada(text: str) -> bool:
        """Check if text contains Kannada script"""
        return LanguageDetector.detect_language(text) == 'kn'

    @staticmethod
    def get_script_name(text: str) -> str:
        """Get human-readable script name"""
        lang = LanguageDetector.detect_language(text)
        return 'Kannada (ಕನ್ನಡ)' if lang == 'kn' else 'English'


class UIStrings:
    """
    UI strings in multiple languages
    ಬಹು ಭಾಷೆಗಳಲ್ಲಿ UI ಸ್ಟ್ರಿಂಗ್‌ಗಳು
    """

    STRINGS = {
        'en': {
            # Navigation
            'back_to_home': 'Back to Home',
            'home': 'Home',

            # Features
            'text_to_text': 'Text → Text Analysis',
            'image_to_text': 'Image → Text Extraction',
            'voice_to_text': 'Voice → Text Transcription',
            'text_to_image': 'Text → Image Generation',
            'text_to_audio': 'Text → Audio Synthesis',
            'image_enhance': 'Image Enhancement',
            'outpainting': 'Image Outpainting',

            # Actions
            'upload_image': 'Upload Image',
            'enter_text': 'Enter your text here...',
            'enter_question': 'Enter your question or text here...',
            'process': 'Process',
            'analyze': 'Analyze',
            'generate': 'Generate',
            'enhance': 'Enhance',
            'download_pdf': 'Download PDF',
            'clear': 'Clear',
            'submit': 'Submit',
            'cancel': 'Cancel',

            # Results
            'ai_response': 'AI Response',
            'ai_analysis': 'AI Analysis',
            'extracted_text': 'Extracted Text',
            'transcription': 'Transcription',
            'result': 'Result',
            'output': 'Output',

            # Status
            'processing': 'Processing...',
            'analyzing': 'Analyzing...',
            'loading': 'Loading...',
            'please_wait': 'Please wait...',
            'success': 'Success!',
            'error': 'Error',

            # Tips
            'tips_title': '💡 Tips for Better Results',
            'tip_clear_images': 'Use high-resolution, well-lit photos',
            'tip_speak_clearly': 'Speak clearly with moderate pace',
            'tip_be_specific': 'Be specific with your questions',

            # Messages
            'no_input': 'Please enter some text',
            'no_image': 'Please select an image file',
            'file_uploaded': 'File uploaded successfully',
            'processing_complete': 'Processing complete',

            # Placeholders
            'results_appear_here': 'Your results will appear here',
            'click_to_start': 'Click to get started',

            # Recent
            'recent_searches': 'Recent Searches',
            'no_recent_searches': 'No recent searches',

            # Common - ಸಾಮಾನ್ಯ
            'welcome': 'Welcome',
            'language': 'Language',
            'settings': 'Settings',
            'help': 'Help',
            'about': 'About',
            'dashboard': 'Dashboard',

            # Feature Descriptions
            'text_to_text_desc': 'Get intelligent AI-powered responses to your questions',
            'text_to_image_desc': 'Generate stunning images from text descriptions',
            'image_to_text_desc': 'Extract and analyze text from images',
            'voice_to_text_desc': 'Convert speech to text with high accuracy',
            'image_enhance_desc': 'Enhance image quality with AI upscaling',
            'outpainting_desc': 'Expand images beyond their boundaries',
            'text_to_audio_desc': 'Convert text to natural-sounding speech',

            # Page Titles
            'homepage_title': (
                'Powerful AI tools for text, image, voice, and audio '
                'processing. Choose a feature below to get started.'
            ),
        },

        'kn': {
            # Navigation - ನ್ಯಾವಿಗೇಶನ್
            'back_to_home': 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
            'home': 'ಮುಖಪುಟ',

            # Features - ವೈಶಿಷ್ಟ್ಯಗಳು
            'text_to_text': 'ಪಠ್ಯ → ಪಠ್ಯ ವಿಶ್ಲೇಷಣೆ',
            'image_to_text': 'ಚಿತ್ರ → ಪಠ್ಯ ಹೊರತೆಗೆಯುವಿಕೆ',
            'voice_to_text': 'ಧ್ವನಿ → ಪಠ್ಯ ಪ್ರತಿಲೇಖನ',
            'text_to_image': 'ಪಠ್ಯ → ಚಿತ್ರ ಉತ್ಪಾದನೆ',
            'text_to_audio': 'ಪಠ್ಯ → ಆಡಿಯೋ ಸಂಶ್ಲೇಷಣೆ',
            'image_enhance': 'ಚಿತ್ರ ವರ್ಧನೆ',
            'outpainting': 'ಚಿತ್ರ ವಿಸ್ತರಣೆ',

            # Actions - ಕ್ರಿಯೆಗಳು
            'upload_image': 'ಚಿತ್ರವನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ',
            'enter_text': 'ನಿಮ್ಮ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ನಮೂದಿಸಿ...',
            'enter_question': 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಅಥವಾ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ನಮೂದಿಸಿ...',
            'process': 'ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಿ',
            'analyze': 'ವಿಶ್ಲೇಷಿಸಿ',
            'generate': 'ಉತ್ಪಾದಿಸಿ',
            'enhance': 'ವರ್ಧಿಸಿ',
            'download_pdf': 'PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
            'clear': 'ತೆರವುಗೊಳಿಸಿ',
            'submit': 'ಸಲ್ಲಿಸಿ',
            'cancel': 'ರದ್ದುಮಾಡಿ',

            # Results - ಫಲಿತಾಂಶಗಳು
            'ai_response': 'AI ಪ್ರತಿಕ್ರಿಯೆ',
            'ai_analysis': 'AI ವಿಶ್ಲೇಷಣೆ',
            'extracted_text': 'ಹೊರತೆಗೆದ ಪಠ್ಯ',
            'transcription': 'ಪ್ರತಿಲೇಖನ',
            'result': 'ಫಲಿತಾಂಶ',
            'output': 'ಔಟ್‌ಪುಟ್',

            # Status - ಸ್ಥಿತಿ
            'processing': 'ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...',
            'analyzing': 'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
            'loading': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
            'please_wait': 'ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ...',
            'success': 'ಯಶಸ್ವಿಯಾಗಿದೆ!',
            'error': 'ದೋಷ',

            # Tips - ಸಲಹೆಗಳು
            'tips_title': '💡 ಉತ್ತಮ ಫಲಿತಾಂಶಗಳಿಗಾಗಿ ಸಲಹೆಗಳು',
            'tip_clear_images': (
                'ಹೆಚ್ಚಿನ ರೆಸಲ್ಯೂಶನ್, '
                'ಚೆನ್ನಾಗಿ ಬೆಳಗಿದ ಫೋಟೋಗಳನ್ನು ಬಳಸಿ'
            ),
            'tip_speak_clearly': 'ಮಧ್ಯಮ ವೇಗದಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ',
            'tip_be_specific': 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳೊಂದಿಗೆ ನಿರ್ದಿಷ್ಟವಾಗಿರಿ',

            # Messages - ಸಂದೇಶಗಳು
            'no_input': 'ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಪಠ್ಯವನ್ನು ನಮೂದಿಸಿ',
            'no_image': 'ದಯವಿಟ್ಟು ಚಿತ್ರ ಫೈಲ್ ಅನ್ನು ಆಯ್ಕೆಮಾಡಿ',
            'file_uploaded': 'ಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಅಪ್ಲೋಡ್ ಆಗಿದೆ',
            'processing_complete': 'ಪ್ರಕ್ರಿಯೆ ಪೂರ್ಣಗೊಂಡಿದೆ',

            # Placeholders - ಸ್ಥಳದಾರಗಳು
            'results_appear_here': 'ನಿಮ್ಮ ಫಲಿತಾಂಶಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ',
            'click_to_start': 'ಪ್ರಾರಂಭಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ',

            # Recent - ಇತ್ತೀಚಿನ
            'recent_searches': 'ಇತ್ತೀಚಿನ ಹುಡುಕಾಟಗಳು',
            'no_recent_searches': 'ಇತ್ತೀಚಿನ ಹುಡುಕಾಟಗಳಿಲ್ಲ',

            # Common - ಸಾಮಾನ್ಯ
            'welcome': 'ಸ್ವಾಗತ',
            'language': 'ಭಾಷೆ',
            'settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
            'help': 'ಸಹಾಯ',
            'about': 'ಬಗ್ಗೆ',
            'dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',

            # Feature Descriptions - ವೈಶಿಷ್ಟ್ಯ ವಿವರಣೆಗಳು
            'text_to_text_desc': 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳಿಗೆ ಬುದ್ಧಿವಂತ AI-ಚಾಲಿತ ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ಪಡೆಯಿರಿ',
            'text_to_image_desc': 'ಪಠ್ಯ ವಿವರಣೆಗಳಿಂದ ಅದ್ಭುತ ಚಿತ್ರಗಳನ್ನು ರಚಿಸಿ',
            'image_to_text_desc': 'ಚಿತ್ರಗಳಿಂದ ಪಠ್ಯವನ್ನು ಹೊರತೆಗೆಯಿರಿ ಮತ್ತು ವಿಶ್ಲೇಷಿಸಿ',
            'voice_to_text_desc': 'ಹೆಚ್ಚಿನ ನಿಖರತೆಯೊಂದಿಗೆ ಭಾಷಣವನ್ನು ಪಠ್ಯಕ್ಕೆ ಪರಿವರ್ತಿಸಿ',
            'image_enhance_desc': 'AI ಅಪ್‌ಸ್ಕೇಲಿಂಗ್‌ನೊಂದಿಗೆ ಚಿತ್ರ ಗುಣಮಟ್ಟವನ್ನು ಹೆಚ್ಚಿಸಿ',
            'outpainting_desc': 'ಚಿತ್ರಗಳನ್ನು ಅವುಗಳ ಗಡಿಗಳ ಆಚೆಗೆ ವಿಸ್ತರಿಸಿ',
            'text_to_audio_desc': 'ಪಠ್ಯವನ್ನು ನೈಸರ್ಗಿಕ ಧ್ವನಿಯ ಭಾಷಣಕ್ಕೆ ಪರಿವರ್ತಿಸಿ',

            # Page Titles - ಪುಟ ಶೀರ್ಷಿಕೆಗಳು
            'homepage_title': (
                'ಪಠ್ಯ, ಚಿತ್ರ, ಧ್ವನಿ ಮತ್ತು ಆಡಿಯೋ ಪ್ರಕ್ರಿಯೆಗಾಗಿ ಶಕ್ತಿಶಾಲಿ AI ಸಾಧನಗಳು. '
                'ಪ್ರಾರಂಭಿಸಲು ಕೆಳಗಿನ ವೈಶಿಷ್ಟ್ಯವನ್ನು ಆರಿಸಿ.'
            ),
        }
    }

    @staticmethod
    def get(key: str, lang: str = 'en') -> str:
        """
        Get localized string
        ಸ್ಥಳೀಯಗೊಳಿಸಿದ ಸ್ಟ್ರಿಂಗ್ ಪಡೆಯಿರಿ

        Args:
            key: String key
            lang: Language code ('en' or 'kn')

        Returns:
            Localized string
        """
        return UIStrings.STRINGS.get(lang, {}).get(key, key)

    @staticmethod
    def get_all(lang: str = 'en') -> Dict[str, str]:
        """Get all strings for a language"""
        return UIStrings.STRINGS.get(lang, UIStrings.STRINGS['en'])


def process_kannada_text(text: str) -> str:
    """
    Process Kannada text input
    ಕನ್ನಡ ಪಠ್ಯ ಇನ್‌ಪುಟ್ ಅನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಿ

    Args:
        text: Kannada input text

    Returns:
        Processed text with Kannada context
    """
    # Add Kannada context indicator for AI processing
    return f"[ಕನ್ನಡ ಭಾಷೆಯಲ್ಲಿ ಉತ್ತರಿಸಿ / Reply in Kannada language]\n\n{text}"


def process_english_text(text: str) -> str:
    """
    Process English text input
    ಇಂಗ್ಲಿಷ್ ಪಠ್ಯ ಇನ್‌ಪುಟ್ ಅನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಿ

    Args:
        text: English input text

    Returns:
        Processed text with English context
    """
    return text


def handle_image_input(
    image_path: str,
    prompt: str,
    prompt_language: str
) -> Dict:
    """
    Handle image input with language-aware processing
    ಭಾಷಾ-ಜಾಗೃತ ಪ್ರಕ್ರಿಯೆಯೊಂದಿಗೆ ಚಿತ್ರ ಇನ್‌ಪುಟ್ ಅನ್ನು ನಿರ್ವಹಿಸಿ

    Args:
        image_path: Path to image file
        prompt: User prompt/instruction
        prompt_language: Detected language ('en' or 'kn')

    Returns:
        Dictionary with processing instructions
    """
    result = {
        'image_path': image_path,
        'original_prompt': prompt,
        'language': prompt_language,
        'encoding': 'utf-8'
    }

    if prompt_language == 'kn':
        # Kannada language context
        result['ai_instruction'] = (
            f"ಚಿತ್ರವನ್ನು ವಿಶ್ಲೇಷಿಸಿ ಮತ್ತು ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ.\n"
            f"ಬಳಕೆದಾರರ ಸೂಚನೆ: {prompt}\n\n"
            "[Please analyze this image and "
            "respond in Kannada language]"
        )
    else:
        # English language context
        result['ai_instruction'] = (
            f"Analyze this image.\n"
            f"User instruction: {prompt}"
        )

    return result


# Example usage / ಉದಾಹರಣೆ ಬಳಕೆ
if __name__ == "__main__":
    print("=" * 60)
    print("Language Detection Test / ಭಾಷೆ ಪತ್ತೆ ಪರೀಕ್ಷೆ")
    print("=" * 60)

    # Test 1: Kannada input
    kannada_text = "ನಮಸ್ಕಾರ, ಇದು ಕನ್ನಡ ಪಠ್ಯವಾಗಿದೆ"
    lang1 = LanguageDetector.detect_language(kannada_text)
    print(f"\nInput: {kannada_text}")
    script_name = LanguageDetector.get_script_name(kannada_text)
    print(f"Detected: {lang1} ({script_name})")
    print(f"UI String: {UIStrings.get('welcome', lang1)}")

    # Test 2: English input
    english_text = "Hello, this is English text"
    lang2 = LanguageDetector.detect_language(english_text)
    print(f"\nInput: {english_text}")
    script_name2 = LanguageDetector.get_script_name(english_text)
    print(f"Detected: {lang2} ({script_name2})")
    print(f"UI String: {UIStrings.get('welcome', lang2)}")

    # Test 3: Image processing with Kannada
    print("\n" + "=" * 60)
    print("Image Processing Test / ಚಿತ್ರ ಪ್ರಕ್ರಿಯೆ ಪರೀಕ್ಷೆ")
    print("=" * 60)

    kannada_prompt = "ಈ ಚಿತ್ರದಲ್ಲಿ ಏನಿದೆ?"
    result = handle_image_input(
        "test.jpg",
        kannada_prompt,
        LanguageDetector.detect_language(kannada_prompt)
    )
    print(f"\nPrompt: {result['original_prompt']}")
    print(f"Language: {result['language']}")
    print(f"AI Instruction:\n{result['ai_instruction']}")
