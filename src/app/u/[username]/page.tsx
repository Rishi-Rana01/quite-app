'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Loader2, Send, Sparkles, MessageCircle, RefreshCw, User, Lock } from 'lucide-react'

const UserProfilePage = () => {
    const params = useParams()
    const username = params?.username as string

    const [messageContent, setMessageContent] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [isAccepting, setIsAccepting] = useState<boolean | null>(null)
    const [isLoadingStatus, setIsLoadingStatus] = useState(true)

    const [suggestedMessages, setSuggestedMessages] = useState<string[]>([])
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
    const [sent, setSent] = useState(false)

    // Default to accepting — the send-message API will tell us if they've disabled messages
    useEffect(() => {
        if (username) {
            setIsAccepting(true)
            setIsLoadingStatus(false)
        }
    }, [username])

    const fetchSuggestions = useCallback(async () => {
        setIsLoadingSuggestions(true)
        setSuggestedMessages([])
        try {
            const response = await fetch('/api/suggest-messages', { method: 'POST' })
            if (!response.body) return

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let fullText = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                fullText += decoder.decode(value, { stream: true })
            }
            // Flush any remaining bytes in the decoder buffer
            fullText += decoder.decode()

            // Strip markdown, surrounding quotes, and newlines the model sometimes adds
            const cleaned = fullText
                .replace(/\*\*/g, '')           // remove bold markdown
                .replace(/^['"`]+|['"`]+$/g, '') // strip wrapping quotes
                .replace(/\n/g, ' ')             // collapse newlines into spaces
                .trim()

            const parts = cleaned
                .split('||')
                .map(q => q.replace(/^['"`\s]+|['"`\s]+$/g, '').trim()) // strip per-part quotes too
                .filter(q => q.length > 0)

            setSuggestedMessages(parts.slice(0, 3))
        } catch (error) {
            toast.error('Could not load suggestions. Try again!')
        } finally {
            setIsLoadingSuggestions(false)
        }
    }, [])

    useEffect(() => {
        fetchSuggestions()
    }, [fetchSuggestions])

    const handleSend = async () => {
        if (!messageContent.trim()) {
            toast.error('Please write a message first!')
            return
        }
        setIsSending(true)
        try {
            const res = await axios.post('/api/send-message', {
                username,
                content: messageContent.trim()
            })
            toast.success(res.data.message || 'Message sent!')
            setMessageContent('')
            setSent(true)
            setTimeout(() => setSent(false), 3000)
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>
            const msg = axiosError.response?.data?.message
            if (msg === 'User is not accepting messages') {
                setIsAccepting(false)
            }
            toast.error(msg || 'Failed to send message')
        } finally {
            setIsSending(false)
        }
    }

    const charCount = messageContent.length
    const maxChars = 500

    if (isLoadingStatus) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-purple-400 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
            {/* Ambient blobs */}
            <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">

                {/* Profile Header */}
                <div className="text-center mb-10">
                    <div className="relative inline-flex mb-4">
                        <div className="w-24 h-24 rounded-full bg-linear-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                            <User className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-400 border-2 border-slate-950 flex items-center justify-center">
                            <MessageCircle className="w-3.5 h-3.5 text-white" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-1">
                        @{username}
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Send an anonymous message — they'll never know it's you 👀
                    </p>
                </div>

                {/* Not accepting messages state */}
                {isAccepting === false ? (
                    <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                        <Lock className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                        <h2 className="text-white font-semibold text-lg mb-1">Not accepting messages</h2>
                        <p className="text-slate-400 text-sm">This user has turned off anonymous messages for now.</p>
                    </div>
                ) : (
                    <>
                        {/* Message Box */}
                        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl">
                            <label className="block text-sm font-medium text-slate-300 mb-3">
                                Your anonymous message
                            </label>
                            <div className="relative">
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all min-h-[130px]"
                                    placeholder="Ask something curious, confess a thought, or just say something fun... 🔮"
                                    value={messageContent}
                                    onChange={(e) => setMessageContent(e.target.value.slice(0, maxChars))}
                                    rows={5}
                                />
                                <span className={`absolute bottom-3 right-3 text-xs ${charCount > maxChars * 0.9 ? 'text-pink-400' : 'text-slate-500'}`}>
                                    {charCount}/{maxChars}
                                </span>
                            </div>

                            <Button
                                onClick={handleSend}
                                disabled={isSending || !messageContent.trim()}
                                className="w-full mt-4 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSending ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                                ) : sent ? (
                                    <><span className="mr-2">✅</span> Sent! They'll wonder who sent this...</>
                                ) : (
                                    <><Send className="mr-2 h-4 w-4" /> Send Anonymously</>
                                )}
                            </Button>
                        </div>

                        {/* AI Suggested Questions */}
                        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-purple-400" />
                                    <span className="text-sm font-medium text-slate-200">AI Suggested Questions</span>
                                    <span className="text-xs text-slate-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">Gemini</span>
                                </div>
                                <button
                                    onClick={fetchSuggestions}
                                    disabled={isLoadingSuggestions}
                                    className="text-slate-400 hover:text-purple-400 transition-colors disabled:opacity-50"
                                    title="Refresh suggestions"
                                >
                                    <RefreshCw className={`h-4 w-4 ${isLoadingSuggestions ? 'animate-spin' : ''}`} />
                                </button>
                            </div>

                            {isLoadingSuggestions ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            ) : suggestedMessages.length > 0 ? (
                                <div className="space-y-3">
                                    {suggestedMessages.map((msg, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setMessageContent(msg)}
                                            className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 text-slate-300 hover:text-white text-sm transition-all duration-200 group"
                                        >
                                            <span className="text-purple-400 mr-2 group-hover:text-pink-400 transition-colors">→</span>
                                            {msg}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 text-sm text-center py-4">
                                    Click refresh to load suggestions ✨
                                </p>
                            )}

                            <p className="text-xs text-slate-600 text-center mt-4">
                                Click any suggestion to use it as your message
                            </p>
                        </div>
                    </>
                )}

                {/* Footer note */}
                <p className="text-center text-slate-600 text-xs mt-8">
                    100% anonymous · Powered by Quite Message
                </p>
            </div>
        </div>
    )
}

export default UserProfilePage