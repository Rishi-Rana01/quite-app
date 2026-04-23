'use client';
import { useState, ChangeEvent, FormEvent, ReactNode } from 'react';

import {
  Ripple,
  AuthTabs,
  TechOrbitDisplay,
} from '@/components/ui/modern-animated-sign-in';
import Image from 'next/image';

type FormData = {
  email: string;
  password: string;
};

interface OrbitIcon {
  component: () => ReactNode;
  className: string;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  reverse?: boolean;
}

const iconsArray: OrbitIcon[] = [
  {
    component: () => (
      <Image
        width={100}
        height={100}
        src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg'
        alt='HTML5'
        className='opacity-80 grayscale hover:grayscale-0 transition-all'
      />
    ),
    className: 'size-[30px] border-none bg-background/80 backdrop-blur-sm p-1 rounded-full cyber-chamfer-sm shadow-neon-sm',
    duration: 20,
    delay: 20,
    radius: 100,
    path: false,
    reverse: false,
  },
  {
    component: () => (
      <Image
        width={100}
        height={100}
        src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg'
        alt='CSS3'
        className='opacity-80 grayscale hover:grayscale-0 transition-all'
      />
    ),
    className: 'size-[30px] border-none bg-background/80 backdrop-blur-sm p-1 rounded-full cyber-chamfer-sm shadow-neon-sm',
    duration: 20,
    delay: 10,
    radius: 100,
    path: false,
    reverse: false,
  },
  {
    component: () => (
      <Image
        width={100}
        height={100}
        src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg'
        alt='TypeScript'
        className='opacity-80 grayscale hover:grayscale-0 transition-all'
      />
    ),
    className: 'size-[50px] border-none bg-background/80 backdrop-blur-sm p-2 rounded-full cyber-chamfer shadow-neon',
    radius: 210,
    duration: 20,
    path: false,
    reverse: false,
  },
  {
    component: () => (
      <Image
        width={100}
        height={100}
        src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg'
        alt='JavaScript'
        className='opacity-80 grayscale hover:grayscale-0 transition-all'
      />
    ),
    className: 'size-[50px] border-none bg-background/80 backdrop-blur-sm p-2 rounded-full cyber-chamfer shadow-neon',
    radius: 210,
    duration: 20,
    delay: 20,
    path: false,
    reverse: false,
  },
  {
    component: () => (
      <Image
        width={100}
        height={100}
        src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg'
        alt='TailwindCSS'
        className='opacity-80 grayscale hover:grayscale-0 transition-all'
      />
    ),
    className: 'size-[30px] border-none bg-background/80 backdrop-blur-sm p-1 rounded-full cyber-chamfer-sm shadow-neon-sm',
    duration: 20,
    delay: 20,
    radius: 150,
    path: false,
    reverse: true,
  },
  {
    component: () => (
      <Image
        width={100}
        height={100}
        src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg'
        alt='Nextjs'
        className='opacity-80 invert hover:invert-0 transition-all dark:invert-0 dark:hover:invert'
      />
    ),
    className: 'size-[30px] border-none bg-background/80 backdrop-blur-sm p-1 rounded-full cyber-chamfer-sm shadow-neon-sm',
    duration: 20,
    delay: 10,
    radius: 150,
    path: false,
    reverse: true,
  },
  {
    component: () => (
      <Image
        width={100}
        height={100}
        src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg'
        alt='React'
        className='opacity-80 grayscale hover:grayscale-0 transition-all'
      />
    ),
    className: 'size-[50px] border-none bg-background/80 backdrop-blur-sm p-2 rounded-full cyber-chamfer shadow-neon',
    radius: 270,
    duration: 20,
    path: false,
    reverse: true,
  },
  {
    component: () => (
      <Image
        width={100}
        height={100}
        src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg'
        alt='Figma'
        className='opacity-80 grayscale hover:grayscale-0 transition-all'
      />
    ),
    className: 'size-[50px] border-none bg-background/80 backdrop-blur-sm p-2 rounded-full cyber-chamfer shadow-neon',
    radius: 270,
    duration: 20,
    delay: 60,
    path: false,
    reverse: true,
  },
  {
    component: () => (
      <Image
        width={100}
        height={100}
        src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg'
        alt='Git'
        className='opacity-80 grayscale hover:grayscale-0 transition-all'
      />
    ),
    className: 'size-[50px] border-none bg-background/80 backdrop-blur-sm p-2 rounded-full cyber-chamfer shadow-neon',
    radius: 320,
    duration: 20,
    delay: 20,
    path: false,
    reverse: false,
  },
];

export function Demo() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const goToForgotPassword = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    event.preventDefault();
    console.log('forgot password');
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    name: keyof FormData
  ) => {
    const value = event.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted', formData);
  };

  const formFields = {
    header: 'ACCESS TERMINAL',
    subHeader: 'ENTER CREDENTIALS TO INITIALIZE SESSION',
    fields: [
      {
        label: 'Email_Address',
        required: true,
        type: 'email' as const,
        placeholder: 'sys.admin@net.work',
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(event, 'email'),
      },
      {
        label: 'Passkey',
        required: true,
        type: 'password' as const,
        placeholder: '••••••••',
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          handleInputChange(event, 'password'),
      },
    ],
    submitButton: 'INITIALIZE',
    textVariantButton: 'RECOVER_CREDENTIALS',
  };

  return (
    <section className='flex min-h-screen bg-background relative overflow-hidden'>
      {/* Cyberpunk background elements */}
      <div className="cyber-scanlines"></div>
      <div className="absolute inset-0 cyber-grid opacity-20"></div>

      {/* Left Side */}
      <span className='flex flex-col justify-center w-1/2 max-lg:hidden relative z-0'>
        <Ripple mainCircleSize={100} />
        <TechOrbitDisplay iconsArray={iconsArray} text='NEURAL_NET' />
      </span>

      {/* Right Side */}
      <span className='w-1/2 h-dvh flex flex-col justify-center items-center max-lg:w-full max-lg:px-[10%] relative z-10'>
        <AuthTabs
          formFields={formFields}
          goTo={goToForgotPassword}
          handleSubmit={handleSubmit}
        />
      </span>
    </section>
  );
}
