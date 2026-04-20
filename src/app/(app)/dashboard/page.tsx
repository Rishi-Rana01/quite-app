'use client'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCw, Trash2 } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const Dashboard = () => {
    const { data: session } = useSession()
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitching, setIsSwitching] = useState(false)

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => (message._id as unknown as string) !== messageId))
    }

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const { register, watch, setValue } = form

    const acceptMessages = watch('acceptMessages')// watch is method which return the value of the field
    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitching(true)
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setValue('acceptMessages', response.data.isAcceptingMessages as boolean)
            if (response.data.isAcceptingMessages !== undefined) {
                setValue('acceptMessages', response.data.isAcceptingMessages)
            }
        } catch (error) {
            console.log("Error in fetching messages", error)
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "Failed to fetch messages")
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

    const { username } = session?.user as User
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    if (!session || !session.user) {
        return <div>Please Login
            <Link href="/sign-in">
                Sign In
            </Link>
        </div>
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast.success('Profile URL copied to clipboard')
    }



    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">Copy Your Unique Link</h2>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={profileUrl}
                            readOnly
                            className="border border-gray-300 rounded-md px-2 py-1"
                        />
                        <Button onClick={copyToClipboard}>
                            Copy
                        </Button>
                    </div>
                    <div className="flex items-center space-x-2">

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
                    <Separator />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Your Messages</h2>
                    <Button onClick={() => fetchMessages(true)} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Refreshing...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Refresh
                            </>
                        )}
                    </Button>
                </div>

                {messages.length === 0 ? (
                    <div className="text-center p-8 bg-muted rounded-lg">
                        <p className="text-muted-foreground">No messages yet</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <Card key={message._id as unknown as string} className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold">{message.content}</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteMessage(message._id as unknown as string)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
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