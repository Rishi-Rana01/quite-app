'use client';

import { useState, ChangeEvent, FormEvent, ReactNode } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

import {
  AuthTabs,
  TechOrbitDisplay,
} from '@/components/ui/modern-animated-sign-in';

interface OrbitIcon {
  component: () => ReactNode;
  className: string;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  reverse?: boolean;
}

import { Ghost, MessageSquare, Search, Shield, UserX, Lock, EyeOff, Key } from 'lucide-react';

const iconsArray: OrbitIcon[] = [
  {
    component: () => <Ghost className="w-5 h-5 text-primary" />,
    className: 'size-[40px] border-none bg-background/80 backdrop-blur-sm p-2 rounded-full cyber-chamfer-sm shadow-neon-sm',
    duration: 25,
    delay: 0,
    radius: 85,
    path: true,
    reverse: false,
  },
  {
    component: () => <MessageSquare className="w-5 h-5 text-secondary" />,
    className: 'size-[40px] border-none bg-background/80 backdrop-blur-sm p-2 rounded-full cyber-chamfer-sm shadow-neon-sm',
    duration: 30,
    delay: 15,
    radius: 120,
    path: true,
    reverse: true,
  },
  {
    component: () => <Search className="w-5 h-5 text-accent" />,
    className: 'size-[40px] border-none bg-background/80 backdrop-blur-sm p-2 rounded-full cyber-chamfer shadow-neon',
    duration: 20,
    delay: 5,
    radius: 155,
    path: true,
    reverse: false,
  },
  {
    component: () => <Shield className="w-6 h-6 text-primary" />,
    className: 'size-[50px] border-none bg-background/80 backdrop-blur-sm p-3 rounded-full cyber-chamfer shadow-neon',
    duration: 35,
    delay: 20,
    radius: 190,
    path: true,
    reverse: true,
  },
  {
    component: () => <UserX className="w-5 h-5 text-secondary" />,
    className: 'size-[40px] border-none bg-background/80 backdrop-blur-sm p-2 rounded-full cyber-chamfer-sm shadow-neon-sm',
    duration: 22,
    delay: 10,
    radius: 225,
    path: true,
    reverse: false,
  },
  {
    component: () => <EyeOff className="w-6 h-6 text-accent" />,
    className: 'size-[50px] border-none bg-background/80 backdrop-blur-sm p-3 rounded-full cyber-chamfer shadow-neon',
    duration: 40,
    delay: 25,
    radius: 260,
    path: true,
    reverse: true,
  },
  {
    component: () => <Lock className="w-5 h-5 text-primary" />,
    className: 'size-[40px] border-none bg-background/80 backdrop-blur-sm p-2 rounded-full cyber-chamfer shadow-neon',
    duration: 28,
    delay: 10,
    radius: 155,
    path: true,
    reverse: false,
  },
  {
    component: () => <Key className="w-5 h-5 text-secondary" />,
    className: 'size-[40px] border-none bg-background/80 backdrop-blur-sm p-2 rounded-full cyber-chamfer shadow-neon',
    duration: 32,
    delay: 5,
    radius: 190,
    path: true,
    reverse: true,
  },
];

const SignInPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const goToForgotPassword = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    event.preventDefault();
    router.push('/sign-up');
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const value = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: formData.identifier,
        password: formData.password,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast.error('Login Failed', {
            description: 'Incorrect username or password',
          });
        } else {
          toast.error('Error', {
            description: result.error,
          });
        }
      } else if (result?.url) {
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error('Error in sign in of User', error);
      toast.error('Sign-in Failed', {
        description: 'An unexpected error occurred',
      });
    }
  };

  const formFields = {
    header: 'QUITE-LOGIN',
    subHeader: '> AUTHENTICATE TO CONTINUE',
    fields: [
      {
        label: 'identifier',
        required: true,
        type: 'text' as const,
        placeholder: 'user@domain.com',
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(event, 'identifier'),
      },
      {
        label: 'password',
        required: true,
        type: 'password' as const,
        placeholder: '••••••••',
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(event, 'password'),
      },
    ],
    submitButton: 'INITIALIZE',
    textVariantButton: 'UNREGISTERED ENTITY? CREATE ACCOUNT',
  };

  return (
    <section className='flex min-h-screen bg-background relative overflow-hidden w-full'>
      {/* Cyberpunk background elements */}
      <div className='cyber-scanlines'></div>
      <div className='absolute inset-0 cyber-grid opacity-20'></div>

      {/* Left Side */}
      <span className='flex flex-col justify-center w-1/2 max-lg:hidden relative z-0'>
        <TechOrbitDisplay iconsArray={iconsArray} text='QUITE-APP ACCESS' />
      </span>

      {/* Right Side */}
      <span className='w-1/2 h-dvh flex flex-col justify-center items-center max-lg:w-full max-lg:px-[10%] relative z-10'>
        <AuthTabs
          formFields={formFields}
          goTo={goToForgotPassword}
          handleSubmit={handleSubmit}
          onSocialLogin={(provider) => signIn(provider, { callbackUrl: '/dashboard' })}
        />
      </span>
    </section>
  );
}

export default SignInPage;
