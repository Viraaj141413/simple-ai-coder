import { useState } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onCodeGenerated: (code: string, language: string) => void;
}

export const ChatInterface = ({ onCodeGenerated }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI coding assistant. Tell me what you want to build and I'll write the code for you. Try something like:\n\n• 'Make a calculator app in JavaScript'\n• 'Create a to-do list with HTML/CSS/JS'\n• 'Build a simple Python game'",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response for now (you'll integrate Gemini API here)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'll create that for you! Here's a working example:",
        timestamp: new Date()
      };

      // Generate sample code based on user request
      const sampleCode = generateSampleCode(userMessage.content);
      
      setMessages(prev => [...prev, aiResponse]);
      onCodeGenerated(sampleCode.code, sampleCode.language);
      setIsLoading(false);
    }, 1500);
  };

  const generateSampleCode = (request: string): { code: string; language: string } => {
    const lowerRequest = request.toLowerCase();
    
    if (lowerRequest.includes('calculator')) {
      return {
        language: 'html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .calculator {
            background: white;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .display {
            width: 100%;
            height: 60px;
            font-size: 24px;
            text-align: right;
            margin-bottom: 15px;
            padding: 0 15px;
            border: 2px solid #ddd;
            border-radius: 8px;
            box-sizing: border-box;
        }
        .buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }
        button {
            height: 50px;
            font-size: 18px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .num-btn {
            background: #f0f0f0;
        }
        .num-btn:hover {
            background: #e0e0e0;
        }
        .op-btn {
            background: #007bff;
            color: white;
        }
        .op-btn:hover {
            background: #0056b3;
        }
        .equals {
            background: #28a745;
            color: white;
        }
        .equals:hover {
            background: #1e7e34;
        }
    </style>
</head>
<body>
    <div class="calculator">
        <input type="text" class="display" id="display" readonly>
        <div class="buttons">
            <button onclick="clearDisplay()" class="op-btn">C</button>
            <button onclick="deleteLast()" class="op-btn">⌫</button>
            <button onclick="appendToDisplay('/')" class="op-btn">÷</button>
            <button onclick="appendToDisplay('*')" class="op-btn">×</button>
            
            <button onclick="appendToDisplay('7')" class="num-btn">7</button>
            <button onclick="appendToDisplay('8')" class="num-btn">8</button>
            <button onclick="appendToDisplay('9')" class="num-btn">9</button>
            <button onclick="appendToDisplay('-')" class="op-btn">-</button>
            
            <button onclick="appendToDisplay('4')" class="num-btn">4</button>
            <button onclick="appendToDisplay('5')" class="num-btn">5</button>
            <button onclick="appendToDisplay('6')" class="num-btn">6</button>
            <button onclick="appendToDisplay('+')" class="op-btn">+</button>
            
            <button onclick="appendToDisplay('1')" class="num-btn">1</button>
            <button onclick="appendToDisplay('2')" class="num-btn">2</button>
            <button onclick="appendToDisplay('3')" class="num-btn">3</button>
            <button onclick="calculate()" class="equals" rowspan="2">=</button>
            
            <button onclick="appendToDisplay('0')" class="num-btn" style="grid-column: span 2;">0</button>
            <button onclick="appendToDisplay('.')" class="num-btn">.</button>
        </div>
    </div>

    <script>
        let display = document.getElementById('display');
        
        function appendToDisplay(value) {
            display.value += value;
        }
        
        function clearDisplay() {
            display.value = '';
        }
        
        function deleteLast() {
            display.value = display.value.slice(0, -1);
        }
        
        function calculate() {
            try {
                let result = eval(display.value.replace('×', '*').replace('÷', '/'));
                display.value = result;
            } catch (error) {
                display.value = 'Error';
            }
        }
    </script>
</body>
</html>`
      };
    } else if (lowerRequest.includes('todo') || lowerRequest.includes('to-do')) {
      return {
        language: 'html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>To-Do List</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #74b9ff, #0984e3);
            min-height: 100vh;
        }
        .container {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        h1 {
            color: #2d3436;
            text-align: center;
            margin-bottom: 30px;
        }
        .input-section {
            display: flex;
            margin-bottom: 30px;
            gap: 10px;
        }
        input[type="text"] {
            flex: 1;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
        }
        .add-btn {
            padding: 12px 20px;
            background: #00b894;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
        }
        .add-btn:hover {
            background: #00a085;
        }
        .todo-item {
            display: flex;
            align-items: center;
            padding: 15px;
            margin-bottom: 10px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #74b9ff;
        }
        .todo-item.completed {
            opacity: 0.6;
            text-decoration: line-through;
            border-left-color: #00b894;
        }
        .todo-text {
            flex: 1;
            font-size: 16px;
        }
        .delete-btn {
            background: #e17055;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 5px;
            cursor: pointer;
        }
        .delete-btn:hover {
            background: #d63031;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>My To-Do List</h1>
        <div class="input-section">
            <input type="text" id="todoInput" placeholder="Enter a new task..." onkeypress="handleKeyPress(event)">
            <button class="add-btn" onclick="addTodo()">Add Task</button>
        </div>
        <div id="todoList"></div>
    </div>

    <script>
        let todos = [];
        let todoIdCounter = 1;

        function addTodo() {
            const input = document.getElementById('todoInput');
            const text = input.value.trim();
            
            if (text === '') return;
            
            const todo = {
                id: todoIdCounter++,
                text: text,
                completed: false
            };
            
            todos.push(todo);
            input.value = '';
            renderTodos();
        }

        function deleteTodo(id) {
            todos = todos.filter(todo => todo.id !== id);
            renderTodos();
        }

        function toggleTodo(id) {
            const todo = todos.find(todo => todo.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                renderTodos();
            }
        }

        function renderTodos() {
            const todoList = document.getElementById('todoList');
            todoList.innerHTML = '';
            
            todos.forEach(todo => {
                const todoItem = document.createElement('div');
                todoItem.className = 'todo-item' + (todo.completed ? ' completed' : '');
                todoItem.innerHTML = \`
                    <input type="checkbox" \${todo.completed ? 'checked' : ''} onchange="toggleTodo(\${todo.id})">
                    <span class="todo-text">\${todo.text}</span>
                    <button class="delete-btn" onclick="deleteTodo(\${todo.id})">Delete</button>
                \`;
                todoList.appendChild(todoItem);
            });
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                addTodo();
            }
        }
    </script>
</body>
</html>`
      };
    } else {
      return {
        language: 'html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            border-radius: 15px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            max-width: 500px;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        p {
            color: #666;
            font-size: 18px;
            line-height: 1.6;
        }
        .btn {
            background: #667eea;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 20px;
        }
        .btn:hover {
            background: #5a6fd8;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello, World!</h1>
        <p>This is your custom app created by AI! Describe what you want to build and I'll create it for you.</p>
        <button class="btn" onclick="alert('Hello from your AI-generated app!')">Click Me!</button>
    </div>
</body>
</html>`
      };
    }
  };

  return (
    <div className="flex flex-col h-full chat-bg border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="h-8 w-8 text-primary animate-pulse-glow" />
            <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1 animate-float" />
          </div>
          <div>
            <h2 className="text-xl font-bold ai-gradient bg-clip-text text-transparent">
              AI Code Assistant
            </h2>
            <p className="text-sm text-muted-foreground">
              Tell me what to build
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-slide-up ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type === 'ai' && (
                <div className="flex-shrink-0">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'ai-gradient text-white'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              {message.type === 'user' && (
                <div className="flex-shrink-0">
                  <User className="h-6 w-6 text-accent" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 animate-slide-up">
              <Bot className="h-6 w-6 text-primary animate-pulse" />
              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
            className="flex-1 bg-background border-border"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="ai-gradient hover:opacity-90 transition-opacity"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};