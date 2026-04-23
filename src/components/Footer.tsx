import React from 'react';
import Link from 'next/link';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="w-full relative overflow-hidden border-t border-primary/20 bg-background/50 backdrop-blur-md">
      {/* Cyberpunk Top Accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary to-transparent opacity-50"></div>

      <div className="w-full max-w-250 mx-auto px-6 md:px-10 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">

          {/* Brand Section */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-xl font-bold tracking-widest text-primary drop-shadow-[0_0_8px_rgba(0,255,157,0.5)]">
              QUITE_APP
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto md:mx-0">
              The ultimate anonymous messaging protocol. Secure, fast, and completely free.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-semibold tracking-widest uppercase text-secondary">
              Navigation
            </h4>
            <nav className="flex flex-col space-y-1.5 text-sm">
              <Link href="/" className="hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                Home
              </Link>
              <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                Dashboard
              </Link>
              <Link href="/about" className="hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                About
              </Link>
            </nav>
          </div>

          {/* Social / Connect */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-semibold tracking-widest uppercase text-accent">
              Connect
            </h4>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="https://github.com/Rishi-Rana01"
                target="_blank"
                rel="noreferrer"
                className="p-2 border border-primary/20 rounded-md hover:bg-primary/10 hover:border-primary transition-all cyber-chamfer-sm shadow-neon-sm"
                aria-label="GitHub"
              >
                <GithubIcon className="w-5 h-5 text-primary" />
              </a>
              <a
                href="#"
                className="p-2 border border-secondary/20 rounded-md hover:bg-secondary/10 hover:border-secondary transition-all cyber-chamfer-sm shadow-[0_0_10px_rgba(255,0,255,0.2)]"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-5 h-5 text-secondary" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              STATUS: <span className="text-primary animate-pulse">ONLINE</span>
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-border/50 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-2">
          <p>&copy; {new Date().getFullYear()} Quite App. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
