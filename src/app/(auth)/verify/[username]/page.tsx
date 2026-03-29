"use client"
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from 'next/navigation'
import * as z from "zod"
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const VerifyPage = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: '',
        },
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post<ApiResponse>('/api/verify-code', {
                username: params.username,
                code: data.code,
            })

            toast.success('Success', {
                description: response.data.message,
            })

            router.replace('/sign-in')
        } catch (error) {
            console.error('Error in verification of User', error)
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message ?? 'Verification failed'

            toast.error('Verification Failed !!!!', {
                description: errorMessage,
            })
        }
    }



    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>VERIFY YOUR ACCOUNT</h1>
                    <p className='mb-4'>Enter the verification code sent to your email</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor='code'>Verification Code</label>
                        <input
                            id='code'
                            type='text'
                            className='w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200'
                            {...register('code')}
                        />
                        {errors.code && <p className='mt-1 text-xs text-red-500'>{errors.code.message}</p>}
                    </div>

                    <Button
                        type='submit'
                        className='w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300'
                    >
                        Verify
                    </Button>
                </form>

                <p className='text-sm text-center text-gray-500'>
                    Didn't receive a code?{' '}
                    <Link href='/sign-up' className='text-blue-600 hover:text-blue-800'>
                        Resend code
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default VerifyPage