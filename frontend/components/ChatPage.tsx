'use client';

import { useState } from 'react';
import ChatInput from './ChatInput';
import { MessageCircle } from 'lucide-react';

export default function ChatPage() {
    const [message, setMessage] = useState('');
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const sendMessage = async () => {
        if (!message.trim()) return;

        setLoading(true);
        setReply('');
        setError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }

            const data = await res.json();
            setReply(data.response);
            setMessage('');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Ошибка запроса');
            } else {
                setError('Неизвестная ошибка');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col items-start min-h-screen bg-blue-950 px-4 py-10">
            <div className="mb-4 text-white">
                <MessageCircle size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-6 text-left text-white">Hi there!</h1>
            <h2 className="text-4xl font-bold mb-4 text-white">What would you like to know?</h2>
            <h3 className="text-2xl text-gray-400 mb-6">
                Use one of the most common promp ts bellow <br /> or ask your own question
            </h3>
            <ChatInput
                message={message}
                onChange={setMessage}
                onSend={sendMessage}
                loading={loading}
            />
            {reply && (
                <div className="mt-6 p-4 bg-gray-100 rounded-xl text-gray-800 whitespace-pre-wrap">
                    {reply}
                </div>
            )}
            {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
        </main>
    );
}
