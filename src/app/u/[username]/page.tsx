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
            <div className="flex justify-center items-center min-h-screen bg-background cyber-grid">
                <Loader2 className="h-10 w-10 text-accent animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen relative z-10 cyber-grid">
            {/* Top bar */}
            <nav className="p-4 md:p-6 border-b border-border bg-background/80 backdrop-blur">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/" className="text-2xl font-heading font-black text-foreground cyber-glitch tracking-widest uppercase" data-text="Quite Message">
                        Quite Message
                    </Link>
                    <Link href="/sign-in">
                        <Button variant="outline" size="sm">Sign In</Button>
                    </Link>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">

                {/* Profile Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-24 h-24 cyber-chamfer border-2 border-accent bg-background mb-6 shadow-neon relative group">
                        <User className="w-12 h-12 text-accent group-hover:animate-pulse" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-widest text-foreground mb-3 cyber-glitch text-shadow-neon" data-text={`@${username}`}>
                        @{username}
                    </h1>
                    <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
                        <span className="text-accent mr-2">{">"}</span>
                        Send an anonymous data packet
                    </p>
                </div>

                {/* Not accepting messages state */}
                {isAccepting === false ? (
                    <Card className="text-center" variant="terminal">
                        <CardContent className="py-10">
                            <div className="cyber-chamfer border border-destructive bg-destructive/10 p-4 inline-flex mb-4 shadow-neon">
                                <Lock className="w-8 h-8 text-destructive" />
                            </div>
                            <h2 className="text-lg font-heading text-destructive mb-1 uppercase tracking-wide">Access Denied</h2>
                            <p className="text-sm font-mono text-muted-foreground uppercase mt-2">
                                <span className="text-destructive mr-2">ERR_01:</span>
                                This terminal is not accepting incoming packets.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Message Box */}
                        <Card className="mb-8" variant="holographic">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4 text-accent" />
                                    <span className="text-sm font-mono font-medium text-accent uppercase tracking-wider">
                                        Construct Payload
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-2 space-y-4">
                                <div className="relative group/textarea">
                                    <div className="absolute left-3 top-3 text-accent font-mono text-sm select-none pointer-events-none">
                                        {">"}
                                    </div>
                                    <textarea
                                        className="w-full cyber-chamfer-sm border border-border bg-input/50 px-3 pl-8 py-3 text-foreground placeholder:text-muted-foreground placeholder:font-mono resize-none focus:outline-none focus:border-accent focus:shadow-neon transition-all min-h-[130px] text-sm font-mono"
                                        placeholder="[ INPUT DATA STREAM HERE ]"
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value.slice(0, maxChars))}
                                        rows={5}
                                    />
                                    <span className={`absolute bottom-3 right-3 font-mono text-xs font-bold ${charCount > maxChars * 0.9 ? 'text-destructive drop-shadow-[0_0_5px_rgba(255,51,102,0.8)]' : 'text-accent'}`}>
                                        {charCount}/{maxChars}
                                    </span>
                                </div>

                                <Button
                                    onClick={handleSend}
                                    disabled={isSending || !messageContent.trim()}
                                    className="w-full gap-2"
                                    size="lg"
                                    variant="glitch"
                                >
                                    {isSending ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                                    ) : sent ? (
                                        <><span>{">"}</span> Transmission Successful</>
                                    ) : (
                                        <><Send className="h-4 w-4" /> Execute Transmission</>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* AI Suggested Questions */}
                        <Card variant="terminal">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-secondary animate-pulse" />
                                        <span className="text-sm font-mono font-bold text-secondary uppercase tracking-widest">AI Node Suggestions</span>
                                        <span className="text-[10px] text-background bg-secondary px-2 py-0.5 font-bold uppercase tracking-widest shadow-neon-secondary">
                                            Gemini
                                        </span>
                                    </div>
                                    <Button
                                        onClick={fetchSuggestions}
                                        disabled={isLoadingSuggestions}
                                        variant="outline"
                                        size="icon-sm"
                                        className="border-secondary text-secondary hover:bg-secondary hover:text-background"
                                    >
                                        <RefreshCw className={`h-4 w-4 ${isLoadingSuggestions ? 'animate-spin' : ''}`} />
                                    </Button>
                                </div>
                            </CardHeader>
                            <Separator className="bg-border/50" />
                            <CardContent className="pt-4">
                                {isLoadingSuggestions ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3].map(i => (
                                            <Skeleton key={i} className="h-12 w-full cyber-chamfer-sm bg-muted/50" />
                                        ))}
                                    </div>
                                ) : suggestedMessages.length > 0 ? (
                                    <div className="space-y-3">
                                        {suggestedMessages.map((msg, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setMessageContent(msg)}
                                                className="w-full text-left px-4 py-3 cyber-chamfer-sm bg-background border border-border hover:border-secondary hover:shadow-neon-secondary text-foreground text-sm font-mono transition-all duration-200 group flex items-start gap-3"
                                            >
                                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-secondary shrink-0 transition-colors mt-0.5" />
                                                <span>{msg}</span>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground font-mono text-sm text-center py-6 uppercase tracking-wider">
                                        <span className="text-secondary mr-2">{">"}</span>
                                        Click refresh to extract concepts
                                    </p>
                                )}

                                <p className="text-xs font-mono text-muted-foreground text-center mt-6 uppercase tracking-wider opacity-70">
                                    [ Select parameter to populate input ]
                                </p>
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Footer note */}
                <p className="text-center font-mono text-muted-foreground text-xs mt-12 tracking-widest uppercase">
                    SYS.ANON_MODE: ACTIVE // SECURE CONNECTION
                </p>
            </div>

            <footer className="text-center p-6 border-t border-border bg-background/50 font-mono text-muted-foreground text-xs uppercase tracking-widest">
                © 2026 QUITE_APP_NET // ALL_RIGHTS_RESERVED
            </footer>
        </div>
    )
}

export default UserProfilePage