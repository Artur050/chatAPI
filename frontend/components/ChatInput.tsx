'use client';

import { useRef, useState } from 'react';
import { Mic, Loader2, ChevronRight } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

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
        <div className="w-full mt-auto">
            <TextareaAutosize
                value={message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
                rows={1}
                maxLength={1000}
                className="w-full p-4 pl-[50px] border border-gray-300 rounded-2xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                placeholder="Ask whatever you want"
            />
            <div className="absolute bottom-14 left-6">
                <button
                    onClick={handleSpeech}
                    className="text-blue-400 hover:text-blue-600 transition-colors"
                >
                    <Mic size={30} />
                </button>
            </div>
            <div className="absolute bottom-12 right-4 flex items-center gap-2">
                <button
                    onClick={onSend}
                    disabled={loading || !message.trim()}
                    className="bg-blue-600 rounded-2xl text-white p-2 hover:bg-blue-800 transition-colors disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={40} />
                    ) : (
                        <ChevronRight size={40} />
                    )}
                </button>
            </div>
        </div>
    );
}
