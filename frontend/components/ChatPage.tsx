'use client';

import { useState } from 'react';
import ChatInput from './ChatInput';

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
        <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 px-4 py-10">
            <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">ChatGPT 2.0</h1>
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
            </div>
        </main>
    );
}
