'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Check } from "lucide-react"

const steps = [
    { label: 'Create Account', description: 'Sign up completed' },
    { label: 'Choose Username', description: 'Pick something unique' },
    { label: 'Start Messaging', description: 'You\'re all set!' },
]

const SetupUsernamePage = () => {
    const { data: session, update, status } = useSession()
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const currentStep = 1 // 0 = account created, 1 = choose username, 2 = done

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

    // Progress percentage: step 0 done = 33%, step 1 active = 66%, step 2 done = 100%
    const progressPercent = ((currentStep + 1) / steps.length) * 100

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                {/* Progress Bar */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Step {currentStep + 1} of {steps.length}</span>
                        <span className="font-medium text-gray-700">Almost there!</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />

                    {/* Step Indicators */}
                    <div className="flex justify-between">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center gap-1.5 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                                    index < currentStep
                                        ? 'bg-green-500 text-white'
                                        : index === currentStep
                                            ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                                            : 'bg-gray-200 text-gray-500'
                                }`}>
                                    {index < currentStep ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <span className={`text-xs text-center leading-tight ${
                                    index === currentStep ? 'text-blue-600 font-semibold' : 'text-gray-400'
                                }`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-2">Choose Username</h1>
                    <p className="text-gray-500">You successfully logged in! Please choose a unique username to continue.</p>
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
