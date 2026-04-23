'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, Send, Sparkles, MessageCircle, RefreshCw, User, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

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
            <div className="flex justify-center items-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
                <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Top bar */}
            <nav className="p-4 md:p-6 shadow-sm border-b border-zinc-200 dark:border-zinc-800">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        Quite Message
                    </Link>
                    <Link href="/sign-in">
                        <Button variant="outline" size="sm">Sign In</Button>
                    </Link>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">

                {/* Profile Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-800 mb-4 shadow-sm">
                        <User className="w-10 h-10 text-zinc-600 dark:text-zinc-400" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-1">
                        @{username}
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        Send an anonymous message — they&apos;ll never know it&apos;s you 👀
                    </p>
                </div>

                {/* Not accepting messages state */}
                {isAccepting === false ? (
                    <Card className="text-center">
                        <CardContent className="py-10">
                            <div className="rounded-full bg-muted p-4 inline-flex mb-4">
                                <Lock className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h2 className="text-lg font-semibold mb-1">Not accepting messages</h2>
                            <p className="text-sm text-muted-foreground">
                                This user has turned off anonymous messages for now.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Message Box */}
                        <Card className="mb-6 hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                        Your anonymous message
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-2 space-y-4">
                                <div className="relative">
                                    <textarea
                                        className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-3 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all min-h-[130px] text-sm"
                                        placeholder="Ask something curious, confess a thought, or just say something fun... 🔮"
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value.slice(0, maxChars))}
                                        rows={5}
                                    />
                                    <span className={`absolute bottom-3 right-3 text-xs font-medium ${charCount > maxChars * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                        {charCount}/{maxChars}
                                    </span>
                                </div>

                                <Button
                                    onClick={handleSend}
                                    disabled={isSending || !messageContent.trim()}
                                    className="w-full gap-2"
                                    size="lg"
                                >
                                    {isSending ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                                    ) : sent ? (
                                        <><span>✅</span> Sent! They&apos;ll wonder who sent this...</>
                                    ) : (
                                        <><Send className="h-4 w-4" /> Send Anonymously</>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* AI Suggested Questions */}
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-yellow-500" />
                                        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">AI Suggested Questions</span>
                                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                                            Gemini
                                        </span>
                                    </div>
                                    <Button
                                        onClick={fetchSuggestions}
                                        disabled={isLoadingSuggestions}
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                    >
                                        <RefreshCw className={`h-4 w-4 ${isLoadingSuggestions ? 'animate-spin' : ''}`} />
                                    </Button>
                                </div>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-4">
                                {isLoadingSuggestions ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3].map(i => (
                                            <Skeleton key={i} className="h-12 w-full rounded-lg" />
                                        ))}
                                    </div>
                                ) : suggestedMessages.length > 0 ? (
                                    <div className="space-y-2">
                                        {suggestedMessages.map((msg, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setMessageContent(msg)}
                                                className="w-full text-left px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 hover:border-primary/30 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm transition-all duration-200 group flex items-center gap-2"
                                            >
                                                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                                                <span>{msg}</span>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-sm text-center py-6">
                                        Click refresh to load suggestions ✨
                                    </p>
                                )}

                                <p className="text-xs text-muted-foreground text-center mt-4">
                                    Click any suggestion to use it as your message
                                </p>
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Footer note */}
                <p className="text-center text-muted-foreground text-xs mt-8 font-medium tracking-wide">
                    100% anonymous · Powered by Quite Message
                </p>
            </div>

            <footer className="text-center p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 font-medium tracking-wide">
                © 2026 Quite App. All rights reserved.
            </footer>
        </div>
    )
}

export default UserProfilePage