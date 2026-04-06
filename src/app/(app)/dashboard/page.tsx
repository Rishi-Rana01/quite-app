'use client'

import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const Dashboard = () => {
    const {data: session} = useSession()
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitching, setIsSwitching] = useState(false)

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => (message._id as unknown as string) !== messageId))
    }

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const {register, watch,setValue} = form

    const acceptMessages = watch('acceptMessages')// watch is method which return the value of the field
    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitching(true)
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setValue('acceptMessages', response.data.isAcceptingMessages as boolean)
            if(response.data.isAcceptingMessages !== undefined){
                setValue('acceptMessages', response.data.isAcceptingMessages)
            }
        } catch (error) {
            console.log("Error in fetching messages", error)
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "Failed to fetch messages")
        }
        finally{
            setIsSwitching(false)
        }
    }, [setValue])


  return (
    <div>Dashboard</div>
  )
}

export default Dashboard   