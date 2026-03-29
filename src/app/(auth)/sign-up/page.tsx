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

            router.replace(`/verify/${encodeURIComponent(data.username)}`)
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
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">JOIN QUITE MESSAGE</h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            {...register('username')}
                        />
                        {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
                        {isCheckingUsername && <p className="mt-1 text-xs text-gray-500">Checking username...</p>}
                        {usernameMessage && !isCheckingUsername && <p className="mt-1 text-xs text-blue-600">{usernameMessage}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            {...register('email')}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
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
                        {isSubmitting ? 'Signing up...' : 'Sign Up'}
                    </Button>
                </form>

                <p className="text-sm text-center text-gray-500">
                    Already have an account?{' '}
                    <Link href="/sign-in" className="font-medium text-blue-600 hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    )
}

export default SignUpPage