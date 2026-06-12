'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animate, createScope } from 'animejs';
import Image from 'next/image';
import { Analytics } from "@vercel/analytics/react"

// Light sage-green backdrop, sampled from santiago-2025.jpg so the art blends in.
const BG = '#e8ecdf';

function Headshot() {
  return (
    <div className="portal-core relative h-[clamp(180px,42vmin,300px)] w-[clamp(180px,42vmin,300px)]">
      <div className="absolute inset-0 rounded-full border-2 border-[#c01622]/70" />
      <div className="absolute inset-[3px] overflow-hidden rounded-full shadow-[0_0_45px_rgba(192,22,34,0.30)]">
        <Image
          src="/images/santiago-pfp.png"
          alt="Santiago"
          fill
          sizes="(max-width: 600px) 80vw, 300px"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}

function Audio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false); // auto-play (browsers may require a click to start with sound)
  const [showToast, setShowToast] = useState(false);

  // Play the audio or handle auto-play on mute/unmute toggle
  useEffect(() => {
    const tryPlay = () => {
      const audio = audioRef.current;
      if (audio) {
        audio.muted = muted;
        audio.volume = 0.05;
        audio.play().catch((err) => {
          console.warn('Autoplay blocked:', err);
        });
      }
    };

    tryPlay();

    // Resume playback after the user clicks anywhere on the screen
    const resumeOnClick = () => {
      tryPlay();
      document.removeEventListener('click', resumeOnClick);
    };

    document.addEventListener('click', resumeOnClick);

    return () => {
      document.removeEventListener('click', resumeOnClick);
    };
  }, [muted]);

  // Toggle mute state
  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !muted;
    }
    setMuted((prev) => !prev);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Define animation variants for the wave effect
  const waveVariants = {
    animate: {
      scaleY: [1, 1.5, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <>
      <audio ref={audioRef} src="/bg_music/New Mode.mp3" hidden loop />

      {/* Mute/Unmute Button — soft cream disk with a red speaker accent */}
      <motion.button
        onClick={toggleMute}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 grid h-12 w-12 place-items-center rounded-full bg-[#fbfaf3]/70 hover:bg-[#fbfaf3] backdrop-blur-sm ring-1 ring-[#2a2622]/10 shadow-sm transition-all duration-300 z-50"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? (
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d="M4 9v6h3.5L13 19V5L7.5 9H4z" fill="#c01622" />
            <g stroke="#c01622" strokeWidth="2" strokeLinecap="round">
              <line x1="16.5" y1="9.5" x2="21.5" y2="14.5" />
              <line x1="21.5" y1="9.5" x2="16.5" y2="14.5" />
            </g>
          </motion.svg>
        ) : (
          <motion.div className="flex h-5 w-6 items-end justify-center gap-[2px]">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                custom={i * 0.1} // Delay stagger for each wave
                variants={waveVariants}
                animate="animate"
                className="w-[3px] bg-[#c01622] rounded-sm"
                style={{ height: `${8 + i * 4}px` }} // Dynamic height for each wave
              />
            ))}
          </motion.div>
        )}
      </motion.button>

      {/* Toast Message for Mute/Unmute */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-24 right-6 bg-[#fbfaf3]/90 text-[#c01622] ring-1 ring-[#2a2622]/10 backdrop-blur px-4 py-2 rounded-xl shadow-sm text-sm font-mono z-40"
          >
            {muted ? 'Muted' : 'Unmuted'}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const scope = useRef<ReturnType<typeof createScope> | null>(null);

  useEffect(() => {
    scope.current = createScope({ root }).add(() => {
      // The headshot gently breathes.
      animate('.portal-core', { scale: [1, 1.02, 1], duration: 4500, ease: 'inOutSine', loop: true });
      // The glow behind the large image pulses.
      animate('.img-glow', { opacity: [0.4, 0.8, 0.4], scale: [1, 1.04, 1], duration: 4000, ease: 'inOutSine', loop: true });
    });

    return () => scope.current?.revert();
  }, []);

  // Pop a link on hover.
  const liftLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    animate(e.currentTarget, { y: -4, scale: 1.08, duration: 250, ease: 'outBack' });
  };
  const dropLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    animate(e.currentTarget, { y: 0, scale: 1, duration: 250, ease: 'outBack' });
  };

  return (
    <div
      ref={root}
      className="min-h-screen text-zinc-800 font-[family-name:var(--font-geist-sans)]"
      style={{ backgroundColor: BG }}
    >
      {/* === Hero: headshot + bio, shown immediately === */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Headshot />

          <div className="max-w-md text-center text-sm/6 font-[family-name:var(--font-geist-mono)] text-zinc-800">
            <span className="mb-2 block text-2xl font-bold tracking-wide">asuno was here.</span>
            he/him.{' '}
            <a
              href="https://github.com/purreo"
              className="inline-block underline decoration-[#c01622]/60 underline-offset-2 hover:decoration-[#c01622]"
              onMouseEnter={liftLink}
              onMouseLeave={dropLink}
            >
              github
            </a>
            .{' '}
            <a
              href="https://leetcode.com/u/junsoreos/"
              className="inline-block underline decoration-[#c01622]/60 underline-offset-2 hover:decoration-[#c01622]"
              onMouseEnter={liftLink}
              onMouseLeave={dropLink}
            >
              leetcode
            </a>
            .{' '}
            <a
              href="https://toyhou.se/junssbutt"
              className="inline-block underline decoration-[#c01622]/60 underline-offset-2 hover:decoration-[#c01622]"
              onMouseEnter={liftLink}
              onMouseLeave={dropLink}
            >
              toyhouse
            </a>
            .
          </div>
        </motion.div>
      </section>

      {/* === Lower section: left-justified lorem ipsum next to the full-body image === */}
      <section className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16 md:flex-row md:gap-14">
        {/* Left-justified copy */}
        <motion.p
          className="max-w-md text-left text-sm/7 font-[family-name:var(--font-geist-mono)] text-zinc-700"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
         I'm a software engineer navigating my place in the industry in an AI-slop-filled world. Just here for the furries and the vibes.
        </motion.p>

        {/* Full-body Santiago — displayed in full, to the right of the copy */}
        <motion.div
          className="shrink-0"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative">
            {/* Pulsing glow halo */}
            <div className="img-glow pointer-events-none absolute -inset-3 rounded-[2rem] bg-[#c01622]/30 blur-2xl" />
            {/* Framed image */}
            <div className="relative overflow-hidden rounded-2xl ring-2 ring-[#c01622]/60 shadow-[0_0_50px_rgba(192,22,34,0.30)]">
              <Image
                src="/images/santiago-2025.jpg"
                alt="Santiago"
                width={746}
                height={1071}
                sizes="(max-width: 768px) 70vw, 440px"
                className="block h-auto w-[clamp(220px,38vw,440px)]"
              />
            </div>
          </div>
        </motion.div>
      </section>

      <Audio /> {/* Audio Player and Mute Button */}
      <Analytics />
    </div>
  );
}
