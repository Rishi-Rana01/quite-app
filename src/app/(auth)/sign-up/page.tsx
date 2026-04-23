'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"

const SignUpPage = () => {
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    })

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = form

    const usernameValue = watch('username') || ''
    const [debouncedUsername] = useDebounceValue(usernameValue, 300)

    useEffect(() => {
        if (!debouncedUsername) {
            setUsernameMessage('')
            return
        }

        const checkUsernameUnique = async () => {
            setIsCheckingUsername(true)
            setUsernameMessage('')

            try {
                const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${encodeURIComponent(debouncedUsername)}`)
                setUsernameMessage(response.data.message)
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>
                setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username')
            } finally {
                setIsCheckingUsername(false)
            }
        }

        checkUsernameUnique()
    }, [debouncedUsername])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data)

            toast.success('Success', {
                description: response.data.message,
            })

            router.replace('/sign-in')
        } catch (error) {
            console.error('Error in signup of User', error)
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message ?? 'Sign-up failed'

            toast.error('Sign-up Failed !!!!', {
                description: errorMessage,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-background cyber-grid relative z-10">
            <div className="w-full max-w-md p-8 space-y-8 cyber-chamfer border border-border bg-background/90 backdrop-blur-md shadow-neon">
                <div className="text-center">
                    <h1 className="text-4xl font-heading font-black uppercase tracking-widest text-foreground cyber-glitch mb-4" data-text="JOIN NETWORK">JOIN NETWORK</h1>
                    <p className="font-mono text-muted-foreground uppercase tracking-widest text-sm mb-4">
                        <span className="text-accent mr-2">{">"}</span>Initialize New Entity
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-mono text-foreground mb-2 uppercase tracking-wide" htmlFor="username">Username</label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="netrunner_99"
                            {...register('username')}
                        />
                        {errors.username && <p className="mt-1 font-mono text-xs text-destructive">{errors.username.message}</p>}
                        {isCheckingUsername && <p className="mt-1 font-mono text-xs text-secondary animate-pulse">Checking database...</p>}
                        {usernameMessage && !isCheckingUsername && <p className={`mt-1 font-mono text-xs ${usernameMessage === 'Username is unique' ? 'text-accent' : 'text-destructive'}`}>{usernameMessage}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-mono text-foreground mb-2 uppercase tracking-wide" htmlFor="email">Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="user@domain.com"
                            {...register('email')}
                        />
                        {errors.email && <p className="mt-1 font-mono text-xs text-destructive">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-mono text-foreground mb-2 uppercase tracking-wide" htmlFor="password">Password</label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register('password')}
                        />
                        {errors.password && <p className="mt-1 font-mono text-xs text-destructive">{errors.password.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                        variant="glitch"
                    >
                        {isSubmitting ? 'Registering...' : 'Execute Registration'}
                    </Button>
                </form>

                <div className="flex items-center space-x-4 my-6">
                    <div className="flex-1 h-px bg-border"></div>
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">EXTERNAL_AUTH</span>
                    <div className="flex-1 h-px bg-border"></div>
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                        variant="outline"
                        className="w-full font-mono text-sm uppercase tracking-wide hover:bg-secondary hover:text-background border-secondary text-secondary hover:shadow-neon-secondary"
                        type="button"
                    >
                        [ AUTH: GOOGLE ]
                    </Button>
                    <Button
                        onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                        variant="outline"
                        className="w-full font-mono text-sm uppercase tracking-wide hover:bg-foreground hover:text-background border-foreground text-foreground hover:shadow-neon"
                        type="button"
                    >
                        [ AUTH: GITHUB ]
                    </Button>
                </div>

                <p className="text-sm text-center font-mono text-muted-foreground uppercase tracking-wider pt-4">
                    EXISTING ENTITY?{' '}
                    <Link href="/sign-in" className="font-bold text-accent hover:text-secondary hover:underline transition-colors shadow-neon-sm">AUTHENTICATE</Link>
                </p>
            </div>
        </div>
    )
}

export default SignUpPage