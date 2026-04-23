'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Check } from "lucide-react"
import { MorphingSquare } from "@/components/ui/morphing-square"

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
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <MorphingSquare message="Loading..." />
            </div>
        )
    }

    // Progress percentage: step 0 done = 33%, step 1 active = 66%, step 2 done = 100%
    const progressPercent = ((currentStep + 1) / steps.length) * 100

    return (
        <div className="flex justify-center items-center min-h-screen bg-background cyber-grid relative z-10">
            <div className="w-full max-w-md p-8 space-y-6 cyber-chamfer border border-border bg-background/90 backdrop-blur-md shadow-neon">
                {/* Progress Bar */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        <span>Step {currentStep + 1} / {steps.length}</span>
                        <span className="font-bold text-accent shadow-neon-sm">Almost there</span>
                    </div>
                    <Progress value={progressPercent} className="h-1 cyber-chamfer-sm bg-muted/50 [&>div]:bg-accent" />

                    {/* Step Indicators */}
                    <div className="flex justify-between mt-4">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 flex-1">
                                <div className={`w-8 h-8 flex items-center justify-center text-sm font-bold font-mono transition-all duration-300 cyber-chamfer-sm ${
                                    index < currentStep
                                        ? 'bg-secondary text-background shadow-neon-secondary'
                                        : index === currentStep
                                            ? 'bg-accent text-background shadow-neon border-2 border-accent/20'
                                            : 'bg-muted/50 text-muted-foreground border border-border'
                                }`}>
                                    {index < currentStep ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <span className={`text-[10px] text-center leading-tight uppercase font-mono tracking-wider ${
                                    index === currentStep ? 'text-accent font-bold' : 'text-muted-foreground'
                                }`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center pt-4">
                    <h1 className="text-3xl font-heading font-black tracking-widest uppercase cyber-glitch mb-2" data-text="IDENTIFY">IDENTIFY</h1>
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        <span className="text-accent mr-2">{">"}</span>Initialize network alias
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-mono text-foreground mb-2 uppercase tracking-wide" htmlFor="username">Network Alias</label>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="enter_alias"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting || username.length < 3}
                        className="w-full"
                        variant="glitch"
                    >
                        {isSubmitting ? 'Syncing...' : 'Lock Alias'}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default SetupUsernamePage
