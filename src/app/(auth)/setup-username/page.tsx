'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Button } from "@/components/ui/button"

const SetupUsernamePage = () => {
    const { data: session, update, status } = useSession()
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/sign-in')
        } else if (status === 'authenticated' && session?.user?.username && !session.user.username.startsWith('user_')) {
            // Already has a valid username
            router.replace('/dashboard')
        }
    }, [status, session, router])

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (username.length < 3) {
            toast.error('Username too short')
            return
        }

        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/setup-username', { username })
            
            toast.success('Username saved!', {
                description: response.data.message,
            })
            
            // Update session locally so the JWT token gets updated on next reload
            await update({ username })
            
            router.replace('/dashboard')
        } catch (error) {
            console.error('Error saving username:', error)
            const axiosError = error as AxiosError<ApiResponse>
            toast.error('Failed to save username', {
                description: axiosError.response?.data.message ?? 'Unknown error occurred',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (status === 'loading') {
        return <div className="flex justify-center items-center min-h-screen bg-gray-100">Loading...</div>
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">Choose Username</h1>
                    <p className="mb-4">You successfully logged in! Please choose a unique username to continue.</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            placeholder="Enter a unique username"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting || username.length < 3}
                        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Username'}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default SetupUsernamePage
