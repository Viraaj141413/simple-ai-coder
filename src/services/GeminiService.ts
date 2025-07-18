const GEMINI_API_KEY = "AIzaSyBzIwU6Kn_0J77zo8tgTtlJpU_y5S4LbbM";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

export interface ProjectFile {
  name: string;
  content: string;
  type: 'html' | 'css' | 'js' | 'json' | 'md';
  path: string;
}

export interface GeneratedProject {
  name: string;
  description: string;
  files: ProjectFile[];
  mainFile: string;
}

export class GeminiService {
  private apiKey: string;

  constructor() {
    this.apiKey = GEMINI_API_KEY;
  }

  async generateProject(prompt: string): Promise<GeneratedProject> {
    try {
      const enhancedPrompt = `
Create a complete web application based on this request: "${prompt}"

Please provide a response in this EXACT JSON format:
{
  "name": "project-name",
  "description": "Brief description of the project",
  "mainFile": "index.html",
  "files": [
    {
      "name": "index.html",
      "content": "<!DOCTYPE html>...",
      "type": "html",
      "path": "/"
    },
    {
      "name": "style.css",
      "content": "/* CSS styles */",
      "type": "css", 
      "path": "/"
    },
    {
      "name": "script.js",
      "content": "// JavaScript code",
      "type": "js",
      "path": "/"
    }
  ]
}

Requirements:
- Create a fully functional, beautiful, modern web application
- Use modern CSS with gradients, animations, and responsive design
- Include interactive JavaScript functionality
- Make it production-ready with proper error handling
- Ensure all files work together seamlessly
- Use semantic HTML5 and accessibility best practices
- The design should be visually appealing and user-friendly
- Include comments in the code for clarity

Do not include any text outside the JSON response.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: enhancedPrompt }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      const generatedText = data.candidates[0]?.content?.parts[0]?.text;
      
      if (!generatedText) {
        throw new Error('No response from Gemini API');
      }

      // Clean the response to extract JSON
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from Gemini');
      }

      const projectData = JSON.parse(jsonMatch[0]);
      return projectData as GeneratedProject;

    } catch (error) {
      console.error('Error generating project:', error);
      // Fallback to a sample project
      return this.getFallbackProject(prompt);
    }
  }

  async explainCode(code: string): Promise<string> {
    try {
      const prompt = `
Explain this code in simple, easy-to-understand terms. Break down what each part does and how it works together:

\`\`\`
${code}
\`\`\`

Please provide a clear, beginner-friendly explanation.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || 'Unable to explain code at the moment.';

    } catch (error) {
      console.error('Error explaining code:', error);
      return 'Unable to explain code at the moment. Please try again.';
    }
  }

  async chatWithAI(message: string, context?: string): Promise<string> {
    try {
      const prompt = context 
        ? `Context: ${context}\n\nUser: ${message}\n\nPlease respond as a helpful AI coding assistant.`
        : `User: ${message}\n\nPlease respond as a helpful AI coding assistant.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || 'I apologize, but I cannot respond at the moment.';

    } catch (error) {
      console.error('Error chatting with AI:', error);
      return 'I apologize, but I cannot respond at the moment. Please try again.';
    }
  }

  private getFallbackProject(prompt: string): GeneratedProject {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('calculator')) {
      return {
        name: "calculator-app",
        description: "A beautiful, functional calculator application",
        mainFile: "index.html",
        files: [
          {
            name: "index.html",
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Calculator</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="calculator-container">
        <div class="calculator">
            <div class="display">
                <input type="text" id="display" readonly>
            </div>
            <div class="buttons">
                <button class="btn clear" onclick="clearDisplay()">C</button>
                <button class="btn operator" onclick="deleteLast()">⌫</button>
                <button class="btn operator" onclick="appendOperator('/')">/</button>
                <button class="btn operator" onclick="appendOperator('*')">×</button>
                
                <button class="btn number" onclick="appendNumber('7')">7</button>
                <button class="btn number" onclick="appendNumber('8')">8</button>
                <button class="btn number" onclick="appendNumber('9')">9</button>
                <button class="btn operator" onclick="appendOperator('-')">-</button>
                
                <button class="btn number" onclick="appendNumber('4')">4</button>
                <button class="btn number" onclick="appendNumber('5')">5</button>
                <button class="btn number" onclick="appendNumber('6')">6</button>
                <button class="btn operator" onclick="appendOperator('+')">+</button>
                
                <button class="btn number" onclick="appendNumber('1')">1</button>
                <button class="btn number" onclick="appendNumber('2')">2</button>
                <button class="btn number" onclick="appendNumber('3')">3</button>
                <button class="btn equals" onclick="calculate()" rowspan="2">=</button>
                
                <button class="btn number zero" onclick="appendNumber('0')">0</button>
                <button class="btn number" onclick="appendNumber('.')">.</button>
            </div>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
            type: "html",
            path: "/"
          },
          {
            name: "style.css",
            content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.calculator-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.calculator {
    background: white;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    max-width: 320px;
}

.display {
    margin-bottom: 20px;
}

.display input {
    width: 100%;
    height: 70px;
    font-size: 24px;
    text-align: right;
    padding: 0 20px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    background: #f8f9fa;
    color: #333;
    font-weight: bold;
}

.buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
}

.btn {
    height: 60px;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.btn:active {
    transform: translateY(0);
}

.number {
    background: #f8f9fa;
    color: #333;
}

.number:hover {
    background: #e9ecef;
}

.operator {
    background: #007bff;
    color: white;
}

.operator:hover {
    background: #0056b3;
}

.equals {
    background: #28a745;
    color: white;
    grid-row: span 2;
}

.equals:hover {
    background: #1e7e34;
}

.clear {
    background: #dc3545;
    color: white;
}

.clear:hover {
    background: #c82333;
}

.zero {
    grid-column: span 2;
}`,
            type: "css",
            path: "/"
          },
          {
            name: "script.js",
            content: `let display = document.getElementById('display');
let currentInput = '';
let shouldResetDisplay = false;

function appendNumber(number) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    if (number === '.' && currentInput.includes('.')) {
        return;
    }
    
    currentInput += number;
    display.value = currentInput;
}

function appendOperator(operator) {
    if (currentInput === '' && operator !== '-') {
        return;
    }
    
    if (shouldResetDisplay) {
        shouldResetDisplay = false;
    }
    
    const lastChar = currentInput.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
        currentInput = currentInput.slice(0, -1);
    }
    
    currentInput += operator;
    display.value = currentInput;
}

function clearDisplay() {
    currentInput = '';
    display.value = '';
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
}

function calculate() {
    try {
        if (currentInput === '') return;
        
        // Replace display symbols with actual operators
        let expression = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
        
        // Evaluate the expression
        let result = eval(expression);
        
        // Handle division by zero and other errors
        if (!isFinite(result)) {
            throw new Error('Invalid calculation');
        }
        
        // Round to prevent floating point issues
        result = Math.round(result * 100000000) / 100000000;
        
        display.value = result;
        currentInput = result.toString();
        shouldResetDisplay = true;
        
    } catch (error) {
        display.value = 'Error';
        currentInput = '';
        shouldResetDisplay = true;
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendNumber('.');
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});`,
            type: "js",
            path: "/"
          }
        ]
      };
    }
    
    // Default fallback project
    return {
      name: "custom-app",
      description: "A custom application built with AI",
      mainFile: "index.html",
      files: [
        {
          name: "index.html",
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>🤖 AI Generated App</h1>
        <p>This app was created based on your request: "${prompt}"</p>
        <div class="feature-card">
            <h3>Ready to Customize</h3>
            <p>This is your starting point. Ask me to add features, modify the design, or enhance functionality!</p>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
          type: "html",
          path: "/"
        },
        {
          name: "style.css",
          content: `body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    max-width: 500px;
    text-align: center;
}

h1 {
    color: #333;
    margin-bottom: 20px;
    font-size: 2.5rem;
}

p {
    color: #666;
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 30px;
}

.feature-card {
    background: #f8f9fa;
    border-radius: 15px;
    padding: 25px;
    border-left: 4px solid #667eea;
}

.feature-card h3 {
    color: #333;
    margin-bottom: 10px;
}

.feature-card p {
    margin-bottom: 0;
    font-size: 1rem;
}`,
          type: "css",
          path: "/"
        },
        {
          name: "script.js",
          content: `// AI Generated JavaScript
console.log('🤖 Your AI-generated app is ready!');

// Add interactive functionality here
document.addEventListener('DOMContentLoaded', function() {
    console.log('App loaded successfully!');
    
    // Example: Add click animation to the feature card
    const featureCard = document.querySelector('.feature-card');
    if (featureCard) {
        featureCard.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
});`,
          type: "js",
          path: "/"
        }
      ]
    };
  }
}

export const geminiService = new GeminiService();