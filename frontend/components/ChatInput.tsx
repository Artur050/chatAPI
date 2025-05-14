'use client';

import { useRef, useState } from 'react';
import { Mic, Loader2, Send } from 'lucide-react';

interface Props {
    message: string;
    onChange: (value: string) => void;
    onSend: () => void;
    loading: boolean;
}

declare global {
    interface Window {
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

export default function ChatInput({ message, onChange, onSend, loading }: Props) {
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const handleSpeech = () => {
        if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window)) {
            alert('Распознавание речи не поддерживается');
            return;
        }

        if (!recognitionRef.current) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.lang = 'ru-RU';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                const transcript = event.results[0][0].transcript;
                onChange(message + ' ' + transcript);
                setListening(false);
            };

            recognition.onerror = () => setListening(false);
            recognition.onend = () => setListening(false);

            recognitionRef.current = recognition;
        }

        if (!listening) {
            recognitionRef.current.start();
            setListening(true);
        } else {
            recognitionRef.current.stop();
            setListening(false);
        }
    };

    return (
        <div className="w-full relative">
            <textarea
                value={message}
                onChange={e => onChange(e.target.value)}
                rows={4}
                maxLength={1000}
                className="w-full p-4 pr-20 border border-gray-300 rounded-2xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Введите сообщение..."
            />
            <div className="absolute bottom-3 right-4 flex gap-2 items-center">
                <button
                    onClick={handleSpeech}
                    className={`text-white p-2 rounded-full transition-colors duration-200 ${
                        listening ? 'bg-red-500' : 'bg-blue-500'
                    } hover:scale-110`}
                >
                    <Mic size={20} />
                </button>
                <button
                    onClick={onSend}
                    disabled={loading || !message.trim()}
                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
            </div>
        </div>
    );
}
