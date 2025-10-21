"""
Interactive Image Analyzer with File Upload

This script provides an interactive interface where users can:
1. Upload/select an image file from their computer
2. Choose which AI API to use (Gemini or OpenAI)
3. Get a detailed analysis of the image

Usage:
    python image_analyzer_ui.py
"""

import os
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from PIL import Image, ImageTk
import google.generativeai as genai
import base64
import requests
import io


class ImageAnalyzerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("AI Image Analyzer")
        self.root.geometry("800x700")
        self.root.resizable(True, True)

        self.image_path = None
        self.image_data = None

        self.setup_ui()

    def setup_ui(self):
        """Create the user interface."""
        # Title
        title_label = tk.Label(
            self.root,
            text="AI Image Analyzer",
            font=("Arial", 20, "bold"),
            pady=10
        )
        title_label.pack()

        # Image display frame
        self.image_frame = tk.Frame(
            self.root,
            width=400,
            height=300,
            bg="lightgray"
        )
        self.image_frame.pack(pady=10)
        self.image_frame.pack_propagate(False)

        self.image_label = tk.Label(
            self.image_frame,
            text="No image selected",
            bg="lightgray"
        )
        self.image_label.pack(expand=True)

        # Upload button
        upload_btn = tk.Button(
            self.root,
            text="📁 Select Image File",
            command=self.upload_image,
            font=("Arial", 12),
            bg="#4CAF50",
            fg="white",
            padx=20,
            pady=10,
            cursor="hand2"
        )
        upload_btn.pack(pady=10)

        # API selection frame
        api_frame = tk.Frame(self.root)
        api_frame.pack(pady=10)

        tk.Label(
            api_frame,
            text="Select AI API:",
            font=("Arial", 11)
        ).pack(side=tk.LEFT, padx=5)

        self.api_var = tk.StringVar(value="gemini")
        gemini_radio = tk.Radiobutton(
            api_frame,
            text="Google Gemini",
            variable=self.api_var,
            value="gemini",
            font=("Arial", 10)
        )
        gemini_radio.pack(side=tk.LEFT, padx=10)

        openai_radio = tk.Radiobutton(
            api_frame,
            text="OpenAI GPT-4o-mini",
            variable=self.api_var,
            value="openai",
            font=("Arial", 10)
        )
        openai_radio.pack(side=tk.LEFT, padx=10)

        # Analyze button
        self.analyze_btn = tk.Button(
            self.root,
            text="🔍 Analyze Image",
            command=self.analyze_image,
            font=("Arial", 12, "bold"),
            bg="#2196F3",
            fg="white",
            padx=30,
            pady=10,
            cursor="hand2",
            state=tk.DISABLED
        )
        self.analyze_btn.pack(pady=10)

        # Progress bar
        self.progress = ttk.Progressbar(
            self.root,
            mode='indeterminate',
            length=300
        )

        # Custom prompt input
        prompt_label = tk.Label(
            self.root,
            text="What do you want to know about this image?",
            font=("Arial", 11, "bold")
        )
        prompt_label.pack(pady=(10, 5))

        prompt_frame = tk.Frame(self.root)
        prompt_frame.pack(padx=20, pady=5, fill=tk.X)

        self.prompt_entry = tk.Text(
            prompt_frame,
            height=3,
            font=("Arial", 10),
            wrap=tk.WORD,
            bg="#ffffff",
            relief=tk.SOLID,
            borderwidth=1
        )
        self.prompt_entry.pack(fill=tk.X)
        self.prompt_entry.insert(
            1.0,
            "Analyze this image in detail and answer any questions shown."
        )

        # Quick prompt buttons
        quick_frame = tk.Frame(self.root)
        quick_frame.pack(pady=5)

        tk.Label(
            quick_frame,
            text="Quick prompts:",
            font=("Arial", 9)
        ).pack(side=tk.LEFT, padx=5)

        quick_prompts = [
            ("📝 Answer Questions", "Answer the questions shown in this image"),
            ("📖 Explain", "Explain what this image shows in detail"),
            ("🔍 Describe", "Describe everything you see in this image"),
            ("📊 Extract Text", "Extract and list all text from this image")
        ]

        for btn_text, prompt in quick_prompts:
            btn = tk.Button(
                quick_frame,
                text=btn_text,
                command=lambda p=prompt: self.set_prompt(p),
                font=("Arial", 8),
                cursor="hand2"
            )
            btn.pack(side=tk.LEFT, padx=2)

        # Results text area
        results_label = tk.Label(
            self.root,
            text="AI Response:",
            font=("Arial", 11, "bold")
        )
        results_label.pack(pady=(10, 5))

        # Text area with scrollbar
        text_frame = tk.Frame(self.root)
        text_frame.pack(padx=20, pady=5, fill=tk.BOTH, expand=True)

        scrollbar = tk.Scrollbar(text_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        self.result_text = tk.Text(
            text_frame,
            height=8,
            font=("Arial", 10),
            wrap=tk.WORD,
            yscrollcommand=scrollbar.set,
            bg="#f5f5f5"
        )
        self.result_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.config(command=self.result_text.yview)

        # Status bar
        self.status_label = tk.Label(
            self.root,
            text="Ready. Please select an image to analyze.",
            relief=tk.SUNKEN,
            anchor=tk.W,
            font=("Arial", 9)
        )
        self.status_label.pack(side=tk.BOTTOM, fill=tk.X)

    def set_prompt(self, prompt):
        """Set a quick prompt in the text field."""
        self.prompt_entry.delete(1.0, tk.END)
        self.prompt_entry.insert(1.0, prompt)

    def upload_image(self):
        """Handle image file selection."""
        file_types = [
            ("Image files", "*.jpg *.jpeg *.png *.gif *.bmp *.webp"),
            ("All files", "*.*")
        ]

        filename = filedialog.askopenfilename(
            title="Select an image file",
            filetypes=file_types
        )

        if filename:
            try:
                # Load and display the image
                self.image_path = filename
                with open(filename, 'rb') as f:
                    self.image_data = f.read()

                # Display thumbnail
                img = Image.open(filename)
                img.thumbnail((380, 280))
                photo = ImageTk.PhotoImage(img)

                self.image_label.configure(image=photo, text="")
                self.image_label.image = photo

                # Enable analyze button
                self.analyze_btn.config(state=tk.NORMAL)

                # Update status
                self.status_label.config(
                    text=f"Image loaded: {os.path.basename(filename)}"
                )
                self.result_text.delete(1.0, tk.END)
                self.result_text.insert(
                    1.0,
                    "Image loaded successfully! "
                    "Enter your question above and click 'Analyze Image'."
                )

            except Exception as e:
                messagebox.showerror("Error", f"Failed to load image: {e}")
                self.status_label.config(text="Error loading image")

    def analyze_image(self):
        """Analyze the selected image using the chosen API."""
        if not self.image_data:
            messagebox.showwarning(
                "No Image",
                "Please select an image first!"
            )
            return

        # Get custom prompt
        user_prompt = self.prompt_entry.get(1.0, tk.END).strip()
        if not user_prompt:
            user_prompt = "Analyze this image in detail."

        api_choice = self.api_var.get()

        # Check API key
        if api_choice == "gemini":
            api_key = os.getenv('GEMINI_API_KEY')
            if not api_key:
                messagebox.showerror(
                    "API Key Missing",
                    "GEMINI_API_KEY environment variable not set!\n\n"
                    "Please set it using:\n"
                    "$env:GEMINI_API_KEY='your_key'"
                )
                return
        else:
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                messagebox.showerror(
                    "API Key Missing",
                    "OPENAI_API_KEY environment variable not set!\n\n"
                    "Please set it using:\n"
                    "$env:OPENAI_API_KEY='your_key'"
                )
                return

        # Disable button and show progress
        self.analyze_btn.config(state=tk.DISABLED)
        self.progress.pack(pady=5)
        self.progress.start()
        self.status_label.config(
            text=f"Analyzing image with {api_choice.upper()}..."
        )
        self.result_text.delete(1.0, tk.END)
        self.result_text.insert(1.0, "Processing... Please wait...")

        # Run analysis in a separate thread to keep UI responsive
        self.root.after(
            100,
            lambda: self.run_analysis(api_choice, api_key, user_prompt)
        )

    def run_analysis(self, api_choice, api_key, user_prompt):
        """Run the actual analysis."""
        try:
            if api_choice == "gemini":
                result = self.analyze_with_gemini(api_key, user_prompt)
            else:
                result = self.analyze_with_openai(api_key, user_prompt)

            # Display result
            self.result_text.delete(1.0, tk.END)
            self.result_text.insert(1.0, result)
            self.status_label.config(text="Analysis completed successfully!")

        except Exception as e:
            error_msg = str(e)
            self.result_text.delete(1.0, tk.END)
            self.result_text.insert(
                1.0,
                f"❌ Error during analysis:\n\n{error_msg}\n\n"
                f"Troubleshooting:\n"
                f"- Check your internet connection\n"
                f"- Verify API key is correct\n"
                f"- Try using the other API (Gemini/OpenAI)\n"
                f"- Image might be too large (try smaller image)"
            )
            self.status_label.config(text="Analysis failed!")
            messagebox.showerror(
                "Analysis Error",
                f"Failed to analyze image:\n\n{error_msg}"
            )

        finally:
            # Re-enable button and hide progress
            self.progress.stop()
            self.progress.pack_forget()
            self.analyze_btn.config(state=tk.NORMAL)

    def analyze_with_gemini(self, api_key, user_prompt):
        """Analyze image using Gemini API."""
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')

        image = Image.open(io.BytesIO(self.image_data))

        # Use the user's custom prompt
        response = model.generate_content([user_prompt, image])
        return response.text.strip()

    def analyze_with_openai(self, api_key, user_prompt):
        """Analyze image using OpenAI API."""
        image_base64 = base64.b64encode(self.image_data).decode('utf-8')

        url = "https://api.openai.com/v1/chat/completions"

        # Use the user's custom prompt
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
                                "url": f"data:image/jpeg;base64,{image_base64}"
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


def main():
    """Main function to run the application."""
    root = tk.Tk()
    ImageAnalyzerApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
