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
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">SIGN IN</h1>
                    <p className="mb-4">Sign in to continue your anonymous adventure</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="identifier">Email or Username</label>
                        <input
                            id="identifier"
                            type="text"
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            {...register('identifier')}
                        />
                        {errors.identifier && <p className="mt-1 text-xs text-red-500">{errors.identifier.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            {...register('password')}
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <p className="text-sm text-center text-gray-500">
                    Don't have an account?{' '}
                    <Link href="/sign-up" className="font-medium text-blue-600 hover:underline">Sign Up</Link>
                </p>
            </div>
        </div>
    )
}

export default SignInPage
