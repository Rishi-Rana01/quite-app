'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const SignInPage = () => {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    })

    const { register, handleSubmit, formState: { errors } } = form

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true)
        try {
            const result = await signIn('credentials', {
                redirect: false,
                identifier: data.identifier,
                password: data.password,
            })

            if (result?.error) {
                if (result.error === 'CredentialsSignin') {
                    toast.error('Login Failed', {
                        description: 'Incorrect username or password',
                    })
                } else {
                    toast.error('Error', {
                        description: result.error,
                    })
                }
            } else if (result?.url) {
                router.replace('/dashboard')
            }
        } catch (error) {
            console.error('Error in sign in of User', error)
            toast.error('Sign-in Failed', {
                description: 'An unexpected error occurred',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-background cyber-grid relative z-10">
            <div className="w-full max-w-md p-8 space-y-8 cyber-chamfer border border-border bg-background/90 backdrop-blur-md shadow-neon">
                <div className="text-center">
                    <h1 className="text-4xl font-heading font-black uppercase tracking-widest text-foreground cyber-glitch mb-4" data-text="SYSTEM LOGIN">
                        SYSTEM LOGIN
                    </h1>
                    <p className="font-mono text-muted-foreground uppercase tracking-widest text-sm mb-4">
                        <span className="text-accent mr-2">{">"}</span>AUTHENTICATE TO CONTINUE
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-mono text-foreground mb-2 uppercase tracking-wide" htmlFor="identifier">Email or Username</label>
                        <Input
                            id="identifier"
                            type="text"
                            placeholder="user@domain.com"
                            {...register('identifier')}
                        />
                        {errors.identifier && <p className="mt-1 font-mono text-xs text-destructive">{errors.identifier.message}</p>}
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
                        {isSubmitting ? 'Authenticating...' : 'Initialize Login'}
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
                    UNREGISTERED ENTITY?{' '}
                    <Link href="/sign-up" className="font-bold text-accent hover:text-secondary hover:underline transition-colors shadow-neon-sm">CREATE ACCOUNT</Link>
                </p>
            </div>
        </div>
    )
}

export default SignInPage
