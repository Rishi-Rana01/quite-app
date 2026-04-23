'use client'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Check, Copy, Inbox, Loader2, RefreshCw, Search, Share2, Trash2 } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const Dashboard = () => {
    const { data: session } = useSession()
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitching, setIsSwitching] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

    const handleDeleteMessage = async (messageId: string) => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${messageId}`)
            toast.success(response.data.message)
            setMessages(messages.filter((message) => (message._id as unknown as string) !== messageId))
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "Failed to delete message")
        }
    }

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues: {
            acceptMessages: false
        }
    })

    const { register, watch, setValue } = form

    const acceptMessages = watch('acceptMessages')// watch is method which return the value of the field
    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitching(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            if (response.data.isAcceptingMessages !== undefined) {
                setValue('acceptMessages', response.data.isAcceptingMessages)
            }
        } catch (error) {
            console.log("Error in fetching accept message status", error)
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "Failed to fetch message status")
        }
        finally {
            setIsSwitching(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitching(true)
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages as Message[] || [])
        } catch (error) {
            console.log("Error in fetching messages", error)
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "Failed to fetch messages")
        }
        finally {
            setIsLoading(false)
            setIsSwitching(false)
        }
    }, [setMessages])

    useEffect(() => {
        if (!session || !session.user) return

        fetchMessages()
        fetchAcceptMessage()

    }, [session, setValue, fetchAcceptMessage, fetchMessages])

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages
            })
            setValue('acceptMessages', !acceptMessages)
            toast(response.data.message)
        } catch (error) {
            console.log("Error in fetching messages", error)
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "Failed to fetch messages")
        }
    }

    // Filtered and sorted messages
    const filteredMessages = useMemo(() => {
        let result = [...messages]

        // Filter by search query
        if (searchQuery.trim()) {
            result = result.filter((msg) =>
                msg.content.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Sort by date
        result.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime()
            const dateB = new Date(b.createdAt).getTime()
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
        })

        return result
    }, [messages, searchQuery, sortOrder])

    if (!session || !session.user) {
        return <div>Please Login
            <Link href="/sign-in">
                Sign In
            </Link>
        </div>
    }

    const { username } = session.user as User
    const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : ''
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        setIsCopied(true)
        toast.success('Profile URL copied to clipboard')
        setTimeout(() => setIsCopied(false), 2000)
    }

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">User Dashboard</h1>

            <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-semibold mb-3">Copy Your Unique Link</h2>
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                            type="text"
                            value={profileUrl}
                            readOnly
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-auto sm:min-w-[280px] bg-muted/30"
                        />
                        <Button
                            onClick={copyToClipboard}
                            variant={isCopied ? "secondary" : "default"}
                            className="min-w-[90px] transition-all duration-200 shrink-0"
                        >
                            {isCopied ? (
                                <>
                                    <Check className="mr-2 h-4 w-4 text-green-500" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy
                                </>
                            )}
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            {...register('acceptMessages')}
                            checked={acceptMessages}
                            onCheckedChange={handleSwitchChange}
                            disabled={isSwitching}
                        />
                        <span className="text-sm">
                            {acceptMessages ? 'Accepting messages' : 'Not accepting messages'}
                        </span>
                    </div>
                </div>
                <Separator className="mt-4" />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl md:text-2xl font-semibold">Your Messages</h2>
                    <Button onClick={() => fetchMessages(true)} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span className="hidden sm:inline">Refreshing...</span>
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Refresh</span>
                            </>
                        )}
                    </Button>
                </div>

                {/* Search & Sort Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={sortOrder} onValueChange={(value: 'newest' | 'oldest') => setSortOrder(value)}>
                        <SelectTrigger className="w-full sm:w-[160px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Skeleton Loading State */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </div>
                                <Skeleton className="h-4 w-1/3 mt-2" />
                            </Card>
                        ))}
                    </div>
                ) : filteredMessages.length === 0 ? (
                    /* Empty State with Share Link CTA */
                    <div className="flex flex-col items-center justify-center p-8 md:p-12 bg-muted/50 rounded-xl border border-dashed border-muted-foreground/25">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <Inbox className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">
                            {searchQuery ? 'No messages found' : 'No messages yet'}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6 text-center max-w-xs">
                            {searchQuery
                                ? 'Try a different search term.'
                                : 'Share your unique link with others to start receiving anonymous messages.'}
                        </p>
                        {!searchQuery && (
                            <Button onClick={copyToClipboard} size="lg" className="gap-2">
                                <Share2 className="h-4 w-4" />
                                Share Your Link
                            </Button>
                        )}
                    </div>
                ) : (
                    filteredMessages.map((message) => (
                        <Card
                            key={message._id as unknown as string}
                            className="p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20 cursor-default"
                        >
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <p className="font-semibold flex-1">{message.content}</p>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This message will be permanently removed.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDeleteMessage(message._id as unknown as string)}
                                                className="bg-destructive text-white hover:bg-destructive/90"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <p>Received at: {new Date(message.createdAt).toLocaleString()}</p>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}

export default Dashboard   