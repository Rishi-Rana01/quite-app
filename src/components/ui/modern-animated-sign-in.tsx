'use client';
import {
  memo,
  ReactNode,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  forwardRef,
} from 'react';
import Image from 'next/image';
import {
  motion,
  useAnimation,
  useInView,
  useMotionTemplate,
  useMotionValue,
} from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

// ==================== Input Component ====================

const Input = memo(
  forwardRef(function Input(
    { className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) {
    const radius = 100; // change this to increase the radius of the hover effect
    const [visible, setVisible] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({
      currentTarget,
      clientX,
      clientY,
    }: React.MouseEvent<HTMLDivElement>) {
      const { left, top } = currentTarget.getBoundingClientRect();

      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    return (
      <motion.div
        style={{
          background: useMotionTemplate`
        radial-gradient(
          ${visible ? radius + 'px' : '0px'} circle at ${mouseX}px ${mouseY}px,
          var(--primary),
          transparent 80%
        )
      `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className='group/input cyber-chamfer-sm p-[2px] transition duration-300'
      >
        <input
          type={type}
          className={cn(
            `shadow-neon-sm flex h-10 w-full cyber-chamfer-sm border-none bg-input px-3 py-2 text-sm text-foreground transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-[2px] focus-visible:ring-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
            className
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  })
);

Input.displayName = 'Input';

// ==================== BoxReveal Component ====================

type BoxRevealProps = {
  children: ReactNode;
  width?: string;
  boxColor?: string;
  duration?: number;
  overflow?: string;
  position?: string;
  className?: string;
};

const BoxReveal = memo(function BoxReveal({
  children,
  width = 'fit-content',
  boxColor,
  duration,
  overflow = 'hidden',
  position = 'relative',
  className,
}: BoxRevealProps) {
  const mainControls = useAnimation();
  const slideControls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      slideControls.start('visible');
      mainControls.start('visible');
    } else {
      slideControls.start('hidden');
      mainControls.start('hidden');
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <section
      ref={ref}
      style={{
        position: position as
          | 'relative'
          | 'absolute'
          | 'fixed'
          | 'sticky'
          | 'static',
        width,
        overflow,
      }}
      className={className}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial='hidden'
        animate={mainControls}
        transition={{ duration: duration ?? 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{ hidden: { left: 0 }, visible: { left: '100%' } }}
        initial='hidden'
        animate={slideControls}
        transition={{ duration: duration ?? 0.5, ease: 'easeIn' }}
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          zIndex: 20,
          background: boxColor ?? 'var(--primary)',
        }}
      />
    </section>
  );
});

// ==================== Ripple Component ====================

type RippleProps = {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  className?: string;
};

const Ripple = memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 11,
  className = '',
}: RippleProps) {
  return (
    <section
      className={`max-w-[50%] absolute inset-0 flex items-center justify-center
        bg-background/5
        mask-[linear-gradient(to_bottom,black,transparent)]
        dark:mask-[linear-gradient(to_bottom,white,transparent)] ${className}`}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;
        const borderStyle = i === numCircles - 1 ? 'dashed' : 'solid';
        const borderOpacity = 5 + i * 5;

        return (
          <span
            key={i}
            className='absolute animate-ripple rounded-full bg-primary/10 border shadow-neon-sm'
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity: opacity,
              animationDelay: animationDelay,
              borderStyle: borderStyle,
              borderWidth: '1px',
              borderColor: `var(--primary)`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </section>
  );
});

// ==================== OrbitingCircles Component ====================

type OrbitingCirclesProps = {
  className?: string;
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
};

const OrbitingCircles = memo(function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 10,
  radius = 70,
  path = true,
}: OrbitingCirclesProps) {
  return (
    <>
      {path && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          version='1.1'
          className='pointer-events-none absolute inset-0 size-full'
        >
          <circle
            className='stroke-primary/20 stroke-1'
            cx='50%'
            cy='50%'
            r={radius}
            fill='none'
          />
        </svg>
      )}
      <section
        style={
          {
            '--duration': duration,
            '--radius': radius,
            '--delay': -delay,
          } as React.CSSProperties
        }
        className={cn(
          'absolute flex size-full transform-gpu animate-orbit items-center justify-center rounded-full border border-primary/50 shadow-neon-sm bg-background/50 [animation-delay:calc(var(--delay)*1000ms)]',
          { 'direction-[reverse]': reverse },
          className
        )}
      >
        {children}
      </section>
    </>
  );
});

// ==================== TechOrbitDisplay Component ====================

type IconConfig = {
  className?: string;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  reverse?: boolean;
  component: () => React.ReactNode;
};

type TechnologyOrbitDisplayProps = {
  iconsArray: IconConfig[];
  text?: string;
};

const TechOrbitDisplay = memo(function TechOrbitDisplay({
  iconsArray,
  text = 'QUITE APP ACCESS',
}: TechnologyOrbitDisplayProps) {
  return (
    <section className='relative flex h-full w-full flex-col items-center justify-center overflow-hidden'>
      <span className='pointer-events-none whitespace-pre-wrap font-heading text-center text-5xl md:text-7xl font-bold leading-none text-primary text-shadow-glitch cyber-glitch' data-text={text}>
        {text}
      </span>

      {iconsArray.map((icon, index) => (
        <OrbitingCircles
          key={index}
          className={icon.className}
          duration={icon.duration}
          delay={icon.delay}
          radius={icon.radius}
          path={icon.path}
          reverse={icon.reverse}
        >
          {icon.component()}
        </OrbitingCircles>
      ))}
    </section>
  );
});

// ==================== AnimatedForm Component ====================

type FieldType = 'text' | 'email' | 'password';

type Field = {
  label: string;
  required?: boolean;
  type: FieldType;
  placeholder?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

type AnimatedFormProps = {
  header: string;
  subHeader?: string;
  fields: Field[];
  submitButton: string;
  textVariantButton?: string;
  errorField?: string;
  fieldPerRow?: number;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  googleLogin?: string;
  githubLogin?: string;
  onSocialLogin?: (provider: 'google' | 'github') => void;
  goTo?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

type Errors = {
  [key: string]: string;
};

const AnimatedForm = memo(function AnimatedForm({
  header,
  subHeader,
  fields,
  submitButton,
  textVariantButton,
  errorField,
  fieldPerRow = 1,
  onSubmit,
  googleLogin,
  githubLogin,
  onSocialLogin,
  goTo,
}: AnimatedFormProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  const toggleVisibility = () => setVisible(!visible);

  const validateForm = (event: FormEvent<HTMLFormElement>) => {
    const currentErrors: Errors = {};
    fields.forEach((field) => {
      const value = (event.target as HTMLFormElement)[field.label]?.value;

      if (field.required && !value) {
        currentErrors[field.label] = `${field.label} is required`;
      }

      if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
        currentErrors[field.label] = 'Invalid email address';
      }

      if (field.type === 'password' && value && value.length < 6) {
        currentErrors[field.label] =
          'Password must be at least 6 characters long';
      }
    });
    return currentErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formErrors = validateForm(event);

    if (Object.keys(formErrors).length === 0) {
      onSubmit(event);
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <section className='max-md:w-full flex flex-col gap-6 w-[400px] mx-auto bg-card/80 backdrop-blur-md p-8 border border-border cyber-chamfer shadow-neon'>
      <div className='flex flex-col gap-2'>
        <BoxReveal boxColor='var(--primary)' duration={0.3}>
          <h2 className='font-heading text-3xl text-primary text-shadow-neon uppercase tracking-wider'>
            {header}
          </h2>
        </BoxReveal>

        {subHeader && (
          <BoxReveal boxColor='var(--secondary)' duration={0.3} className='pb-2'>
            <p className='text-muted-foreground text-sm font-mono'>
              {subHeader}
            </p>
          </BoxReveal>
        )}
      </div>

      {googleLogin && (
        <div className='flex flex-col gap-4'>
          <BoxReveal
            boxColor='var(--primary)'
            duration={0.3}
            overflow='visible'
            width='unset'
          >
            <button
              className='group/btn bg-background/50 hover:bg-primary/10 border border-primary/50 cyber-chamfer-sm w-full h-12 font-mono text-primary transition-all shadow-neon-sm hover:shadow-neon outline-hidden hover:cursor-pointer relative overflow-hidden'
              type='button'
              onClick={() => onSocialLogin && onSocialLogin('google')}
            >
              <span className='flex items-center justify-center w-full h-full gap-3 relative z-10'>
                <Image
                  src='https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png'
                  width={20}
                  height={20}
                  alt='Google Icon'
                  className='brightness-200 grayscale'
                />
                {googleLogin}
              </span>
              <BottomGradient />
            </button>
          </BoxReveal>

          {githubLogin && (
            <BoxReveal
              boxColor='var(--foreground)'
              duration={0.3}
              overflow='visible'
              width='unset'
            >
              <button
                className='group/btn bg-background/50 hover:bg-foreground/10 border border-foreground/50 cyber-chamfer-sm w-full h-12 font-mono text-foreground transition-all shadow-neon-sm hover:shadow-neon outline-hidden hover:cursor-pointer relative overflow-hidden'
                type='button'
                onClick={() => onSocialLogin && onSocialLogin('github')}
              >
                <span className='flex items-center justify-center w-full h-full gap-3 relative z-10'>
                  <Image
                    src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg'
                    width={20}
                    height={20}
                    alt='GitHub Icon'
                    className='brightness-200 grayscale dark:invert'
                  />
                  {githubLogin}
                </span>
                <BottomGradient />
              </button>
            </BoxReveal>
          )}

          <BoxReveal boxColor='var(--muted)' duration={0.3} width='100%'>
            <section className='flex items-center gap-4'>
              <hr className='flex-1 border-t border-border' />
              <p className='text-muted-foreground text-xs font-mono uppercase tracking-widest'>
                or
              </p>
              <hr className='flex-1 border-t border-border' />
            </section>
          </BoxReveal>
        </div>
      )}

      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <section
          className={`grid grid-cols-1 md:grid-cols-${fieldPerRow} gap-4`}
        >
          {fields.map((field) => (
            <section key={field.label} className='flex flex-col gap-2'>
              <BoxReveal boxColor='var(--primary)' duration={0.3}>
                <Label htmlFor={field.label} className='font-mono text-xs uppercase tracking-wider text-foreground/80'>
                  {field.label} {field.required && <span className='text-destructive'>*</span>}
                </Label>
              </BoxReveal>

              <BoxReveal
                width='100%'
                boxColor='var(--secondary)'
                duration={0.3}
                className='w-full'
              >
                <section className='relative'>
                  <Input
                    type={
                      field.type === 'password'
                        ? visible
                          ? 'text'
                          : 'password'
                        : field.type
                    }
                    id={field.label}
                    placeholder={field.placeholder}
                    onChange={field.onChange}
                    className='font-mono'
                  />

                  {field.type === 'password' && (
                    <button
                      type='button'
                      onClick={toggleVisibility}
                      className='absolute inset-y-0 right-0 pr-3 flex items-center text-primary hover:text-secondary transition-colors'
                    >
                      {visible ? (
                        <Eye className='h-4 w-4' />
                      ) : (
                        <EyeOff className='h-4 w-4' />
                      )}
                    </button>
                  )}
                </section>

                <section className='h-4 mt-1'>
                  {errors[field.label] && (
                    <p className='text-destructive text-xs font-mono animate-pulse'>
                      &gt; ERROR: {errors[field.label]}
                    </p>
                  )}
                </section>
              </BoxReveal>
            </section>
          ))}
        </section>

        <BoxReveal width='100%' boxColor='var(--destructive)' duration={0.3}>
          {errorField && (
            <p className='text-destructive text-sm mb-4 font-mono border border-destructive/50 bg-destructive/10 p-2 cyber-chamfer-sm'>
              &gt; {errorField}
            </p>
          )}
        </BoxReveal>

        <BoxReveal
          width='100%'
          boxColor='var(--primary)'
          duration={0.3}
          overflow='visible'
        >
          <button
            className='relative group/btn bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground border border-primary cyber-chamfer w-full h-12 font-heading tracking-widest uppercase transition-all shadow-neon hover:shadow-neon-secondary outline-hidden hover:cursor-pointer overflow-hidden'
            type='submit'
          >
            <span className='relative z-10 flex items-center justify-center gap-2'>
              {submitButton}
              <span className='text-xl leading-none'>&rarr;</span>
            </span>
            <div className='absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300' />
          </button>
        </BoxReveal>

        {textVariantButton && goTo && (
          <BoxReveal boxColor='var(--secondary)' duration={0.3}>
            <section className='mt-2 text-center hover:cursor-pointer'>
              <button
                type='button'
                className='text-xs font-mono text-muted-foreground hover:text-primary transition-colors outline-hidden underline decoration-primary/30 hover:decoration-primary underline-offset-4'
                onClick={goTo}
              >
                {textVariantButton}
              </button>
            </section>
          </BoxReveal>
        )}
      </form>
    </section>
  );
});

const BottomGradient = () => {
  return (
    <>
      <span className='group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-linear-to-r from-transparent via-primary to-transparent' />
      <span className='group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-linear-to-r from-transparent via-secondary to-transparent' />
    </>
  );
};

// ==================== AuthTabs Component ====================

interface AuthTabsProps {
  formFields: {
    header: string;
    subHeader?: string;
    fields: Array<{
      label: string;
      required?: boolean;
      type: 'text' | 'email' | 'password';
      placeholder?: string;
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    }>;
    submitButton: string;
    textVariantButton?: string;
  };
  goTo: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onSocialLogin?: (provider: 'google' | 'github') => void;
}

const AuthTabs = memo(function AuthTabs({
  formFields,
  goTo,
  handleSubmit,
  onSocialLogin,
}: AuthTabsProps) {
  return (
    <div className='flex max-lg:justify-center w-full md:w-auto z-10'>
      <div className='w-full lg:w-[500px] flex flex-col justify-center items-center'>
        <AnimatedForm
          {...formFields}
          fieldPerRow={1}
          onSubmit={handleSubmit}
          goTo={goTo}
          googleLogin='Authenticate via Google'
          githubLogin='Authenticate via GitHub'
          onSocialLogin={onSocialLogin}
        />
      </div>
    </div>
  );
});

// ==================== Label Component ====================

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
}

const Label = memo(function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  );
});

// ==================== Exports ====================

export {
  Input,
  BoxReveal,
  Ripple,
  OrbitingCircles,
  TechOrbitDisplay,
  AnimatedForm,
  AuthTabs,
  Label,
  BottomGradient,
};
