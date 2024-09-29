'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@mui/material"
import { Input } from "@mui/material"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Send } from "lucide-react"
import logo from "./logo.png"

import "./chat.css"

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hola! C\u00F3mo puedo ayudarte hoy?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [streamingResponse, setStreamingResponse] = useState('');
  const messagesEndRef = useRef(null);
  const [showButtons, setShowButtons] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (streamingResponse) {
      setMessages(prevMessages => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage.sender === 'bot') {
          return [...prevMessages.slice(0, -1), { ...lastMessage, text: streamingResponse }];
        } else {
          return [...prevMessages, { id: Date.now(), text: streamingResponse, sender: 'bot' }];
        }
      });
    }
    scrollToBottom()
  }, [streamingResponse]);

  const handleSend = async (predefinedMessage = null) => {
    if (predefinedMessage) {
      setShowButtons(false);
    }
    const messageToSend = predefinedMessage || input;
    if (messageToSend.trim()) {
      const newMessage = { id: Date.now(), text: messageToSend, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInput('');
      
      try {
        const response = await fetch('http://192.168.42.51:1234/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "RichardErkhov/curiousily_-_Llama-3-8B-Instruct-Finance-RAG-gguf/Llama-3-8B-Instruct-Finance-RAG.Q6_K.gguf",
            messages: [
              { role: "system", content: 
                `
               Eres un financiero experto en administración de gastos, planificación e inversiones que actúa como un acompañante diario hacia los objetivos financieros de los usuarios, independientemente 
               de su nivel de conocimiento en finanzas. Su enfoque es empático y accesible, adaptándose a cada persona, desde usuarios avanzados hasta principiantes, con respuestas claras,
                concisas y fáciles de entender. Utiliza un lenguaje natural y humano, generando confianza y eliminando la sensación de distancia o tecnicismos innecesarios. Además, la IA es proactiva en proporcionar sugerencias personalizadas, motivando a los usuarios y ofreciendo 
                soluciones adecuadas para optimizar sus finanzas y alcanzar metas. Cada interacción se basa en conocer los objetivos individuales de los usuarios, ajustándose a sus necesidades y ofreciendo un acompañamiento flexible y constante.
                Maximo una respuesta de 4 renglones.
                Nunca respondas con una lista de opciones, solo responde con una respuesta.
                `
              },
              { role: "user", content: messageToSend }
            ],
            temperature: 0.7,
            max_tokens: -1,
            stream: true
          }),
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedResponse = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.trim() === 'data: [DONE]') {
              // Stream is finished
              break;
            }
            if (line.startsWith('data:')) {
              try {
                const jsonData = JSON.parse(line.slice(5));
                if (jsonData.choices && jsonData.choices[0].delta.content) {
                  accumulatedResponse += jsonData.choices[0].delta.content;
                  setStreamingResponse(accumulatedResponse);
                  scrollToBottom(); // Add this line
                }
              } catch (error) {
                console.error('Error parsing JSON:', error);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages(prevMessages => [...prevMessages, { id: Date.now(), text: "Lo siento, hubo un error al procesar tu solicitud.", sender: 'bot' }]);
      }
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="p-4 bg-[#8378FF] flex items-center">
        <img 
          src={logo} 
          alt="Mushi.IA Logo" 
          width="40" 
          height="40" 
          className="mr-3"
        />
        <div>
          <h1 className="text-2xl font-bold text-[#351255]">mushIA</h1>
          <p className="text-xs text-white">tu asistente personal</p>
        </div>
      </div>
      
      <ScrollArea className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex text-justify ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`p-2 rounded-lg ${message.sender === 'user' ? 'bg-[#A299FF] text-white' : 'bg-[#F2F2F2] text-black'}`}>
                  {message.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Add this line */}
        </div>
      </ScrollArea>
      
      {showButtons && (
        <div className="p-4">
          <Button 
            onClick={() => handleSend("Aprender sobre educación financiera")}
            className="text-xs w-full"
          >
            Aprender sobre educación financiera
          </Button>
          <Button 
            onClick={() => handleSend("Consejos para optimizar mis ahorros")}
            className="text-xs w-full"
          >
            Consejos para optimizar mis ahorros
          </Button>
          <Button 
            onClick={() => handleSend("Ayuda para administrar mis finanzas")}
            className="text-xs w-full"
          >
            Ayuda para administrar mis finanzas 
          </Button>
        </div>
      )}
      
      <div className="p-4 border-t mt-auto" style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)'
      }}>
        <form onSubmit={(e) => { e.preventDefault(); setShowButtons(false); handleSend(); }} className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}