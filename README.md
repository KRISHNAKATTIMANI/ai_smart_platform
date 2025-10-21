# Image Summarizer

A Python script that uses AI multimodal APIs (Google Gemini 1.5 or OpenAI GPT-4o-mini) to generate concise summaries of images.

## Features

- 📸 Load images from local paths or URLs
- 🤖 Support for both Google Gemini and OpenAI APIs
- 🔐 Secure API key handling via environment variables
- ✅ Comprehensive error handling
- 📝 Clear, commented code structure

## Installation

1. Install Python 3.7 or higher

2. Install required dependencies:
```bash
pip install -r requirements.txt
```

## Setup

### For Google Gemini API

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Set the environment variable:

**PowerShell:**
```powershell
$env:GEMINI_API_KEY="your_gemini_api_key_here"
```

**Command Prompt:**
```cmd
set GEMINI_API_KEY=your_gemini_api_key_here
```

### For OpenAI API

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Set the environment variable:

**PowerShell:**
```powershell
$env:OPENAI_API_KEY="your_openai_api_key_here"
```

**Command Prompt:**
```cmd
set OPENAI_API_KEY=your_openai_api_key_here
```

## Usage

### Basic Usage with Gemini (default)

```bash
python image_summarizer.py --image path/to/image.jpg
```

### Using a URL

```bash
python image_summarizer.py --image https://example.com/image.jpg
```

### Using OpenAI instead of Gemini

```bash
python image_summarizer.py --image path/to/image.jpg --api openai
```

### Full Example

```bash
# Using Gemini
python image_summarizer.py --image C:\Users\YourName\Pictures\photo.jpg --api gemini

# Using OpenAI with a URL
python image_summarizer.py --image https://example.com/screenshot.png --api openai
```

## Command-Line Arguments

- `--image` (required): Path to local image file or image URL
- `--api` (optional): API to use - `gemini` (default) or `openai`

## Example Output

```
Loading image from: example.jpg
✓ Image loaded successfully

Sending image to GEMINI API...
✓ Summary received successfully

============================================================
IMAGE SUMMARY:
============================================================
The image shows a sunset over a mountain range with vibrant
orange and pink hues in the sky. The silhouette of trees
frames the scenic view, creating a peaceful natural landscape.
============================================================
```

## Error Handling

The script includes comprehensive error handling for:
- Missing or invalid image files
- Network errors when downloading from URLs
- Missing API keys
- API request failures
- Invalid API responses

## Supported Image Formats

- JPEG/JPG
- PNG
- GIF
- WebP
- BMP

## Code Structure

1. **Image Loading**: Loads images from local paths or downloads from URLs
2. **API Key Validation**: Checks for required environment variables
3. **API Communication**: Sends image to chosen API with proper formatting
4. **Response Parsing**: Extracts and displays the summary
5. **Error Handling**: Provides clear error messages for debugging

## Notes

- The script uses `gemini-1.5-flash` model for faster and cost-effective responses
- For OpenAI, it uses `gpt-4o-mini` model
- Both APIs support various image formats automatically
- Maximum timeout is set to 30 seconds for API requests

## Troubleshooting

**"API key not set" error:**
- Make sure you've set the environment variable correctly
- Restart your terminal after setting the variable

**"Error loading image" error:**
- Verify the file path is correct
- Check that the image file exists and is readable
- For URLs, ensure you have internet connectivity

**API request errors:**
- Check your API key is valid and has sufficient quota
- Verify you have internet connectivity
- Check API service status

## License

This project is open source and available for educational purposes.
