'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import emailjs from '@emailjs/browser';

// function MessageBoard() {
//   const [messages, setMessages] = useState<string[]>([]);
//   const [input, setInput] = useState('');
//   const [sending, setSending] = useState(false);
//   emailjs.init('weQ2MUQ7B-N1yZYIQ')

//   const sendEmail = async (message: string) => {
//     setSending(true);
//     try {
//       const response = await emailjs.send('service_btcw7oy','template_2xrxnun',{message},'weQ2MUQ7B-N1yZYIQ');
//       console.log('Email sent successfully:', response);
//     } catch (err) {
//       console.error('Email send error:', err);
//       if (err.response) {
//         console.error('Response error:', err.response);
//       }
//     }
//     setSending(false);
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (input.trim() === '') return;

//     setMessages(prev => [...prev, input]);
//     await sendEmail(input);
//     setInput('');
//   };

//   return (
//     <div className="w-full max-w-md bg-zinc-800 p-4 rounded-2xl shadow-xl text-white space-y-4">
//       <h2 className="text-xl font-bold"> The Wall of Shame</h2>
//       <form onSubmit={handleSubmit} className="flex gap-2">
//         <input
//           type="text"
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           placeholder="Leave a message for me."
//           className="flex-grow px-3 py-2 rounded-xl text-black focus:outline-none"
//         />
//         <button
//           type="submit"
//           className="bg-white text-black px-4 py-2 rounded-xl hover:bg-zinc-200 transition"
//           disabled={sending}
//         >
//           {sending ? 'Sending...' : 'Send'}
//         </button>
//       </form>
//       <div className="space-y-2 max-h-64 overflow-y-auto">
//         {messages.length === 0 && (
//           <p className="text-sm text-zinc-400">No messages yet.</p>
//         )}
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className="bg-zinc-700 px-4 py-2 rounded-xl text-sm break-words"
//           >
//             {msg}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

function Kaneki() {
  return (
      <Image
        src="/images/kaneki.gif"
        alt="Kaneki"
        width={400}
        height={400}
        priority
      />
  );
}

function Audio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);
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

      {/* Mute/Unmute Button */}
      <motion.button
        onClick={toggleMute}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-white shadow-xl transition-all duration-300 z-50"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl"
          >
            🔇
          </motion.span>
        ) : (
          <motion.div className="flex gap-[2px] items-end h-5 w-6">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                custom={i * 0.1} // Delay stagger for each wave
                variants={waveVariants}
                animate="animate"
                className="w-[3px] bg-white rounded-sm"
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
            className="fixed bottom-24 right-6 bg-white/20 text-white backdrop-blur px-4 py-2 rounded-xl shadow-md text-sm font-mono z-40"
          >
            {muted ? 'Muted 🔇' : 'Unmuted 🎵'}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-zinc-900">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

        <Kaneki />{}
        <Audio /> {/* Audio Player and Mute Button */}
        <div className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)] text-white">
          asuno was here. <a href="https://nightlight.gg/u/appatheghoul/stats"><u>dbd stats</u></a>. <a href="https://leetcode.com/u/junsoreos/"><u>leetcode</u>. </a><a href="https://toyhou.se/junssbutt"><u>toyhouse</u>.</a>
          <br />
          <br />
        {/* <MessageBoard /> {} */}
        </div>
      </main>
    </div>
  );
}