'use client';
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import SuccessMsg from "@/app/components/SuccessMsg";
import { Edit, CircleX, Reply,ArrowBigLeftDash, ArrowBigRightDash } from "lucide-react";
import Link from "next/link";
interface Firefly {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  targetOpacity: number;
  flickerPhase: number;
  flickerSpeed: number;
  glowRadius: number;
  hue: number;
  wanderAngle: number;
  restTime: number;
  maxRestTime: number;
  energy: number;
  trailPoints: Array<{ x: number; y: number; opacity: number }>;
}
const Fireflies: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const createFirefly = (): Firefly => {
      const x = Math.random() * (canvas.width - 100) + 50;
      const y = Math.random() * (canvas.height - 100) + 50;
      return {
        x,
        y,
        targetX: Math.random() * (canvas.width - 100) + 50,
        targetY: Math.random() * (canvas.height - 100) + 50,
        radius: Math.random() * 1.5 + 0.8,
        vx: 0,
        vy: 0,
        opacity: 0,
        targetOpacity: Math.random() * 0.4 + 0.1,
        flickerPhase: Math.random() * Math.PI * 2,
        flickerSpeed: Math.random() * 0.02 + 0.01,
        glowRadius: Math.random() * 15 + 10,
        hue: Math.random() * 30 + 45,
        wanderAngle: Math.random() * Math.PI * 2,
        restTime: 0,
        maxRestTime: Math.random() * 120 + 60,
        energy: Math.random() * 0.5 + 0.5,
        trailPoints: []
      };
    };

    const fireflies: Firefly[] = Array.from({ length: 25 }, () => createFirefly());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      fireflies.forEach(firefly => {
        // Update trail
        firefly.trailPoints.push({
          x: firefly.x,
          y: firefly.y,
          opacity: firefly.opacity * 0.3
        });

        // Limit trail length
        if (firefly.trailPoints.length > 8) {
          firefly.trailPoints.shift();
        }

        // Decrease trail opacity
        firefly.trailPoints.forEach((point) => {
          point.opacity *= 0.85;
        });

        // Rest behavior
        if (firefly.restTime > 0) {
          firefly.restTime--;
          firefly.vx *= 0.95;
          firefly.vy *= 0.95;
          firefly.targetOpacity = 0.1;
        } else {
          // Wander behavior with occasional direction changes
          if (Math.random() < 0.02) {
            firefly.wanderAngle += (Math.random() - 0.5) * 0.5;
            const wanderDistance = 50 + Math.random() * 150;
            firefly.targetX = firefly.x + Math.cos(firefly.wanderAngle) * wanderDistance;
            firefly.targetY = firefly.y + Math.sin(firefly.wanderAngle) * wanderDistance;

            // Clamp targets to canvas bounds with margin
            firefly.targetX = Math.max(50, Math.min(canvas.width - 50, firefly.targetX));
            firefly.targetY = Math.max(50, Math.min(canvas.height - 50, firefly.targetY));
          }

          // Occasionally pick completely random targets to ensure full coverage
          if (Math.random() < 0.005) {
            firefly.targetX = Math.random() * (canvas.width - 100) + 50;
            firefly.targetY = Math.random() * (canvas.height - 100) + 50;
          }

          // Smooth movement toward target
          const dx = firefly.targetX - firefly.x;
          const dy = firefly.targetY - firefly.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 5) {
            const force = Math.min(distance * 0.001, 0.15) * firefly.energy;
            firefly.vx += (dx / distance) * force;
            firefly.vy += (dy / distance) * force;
          } else {
            // Reached target, rest or pick new target
            if (Math.random() < 0.3) {
              firefly.restTime = firefly.maxRestTime;
            }
          }

          // Add some organic floating motion
          firefly.vx += (Math.random() - 0.5) * 0.05;
          firefly.vy += (Math.random() - 0.5) * 0.05;

          firefly.targetOpacity = Math.random() * 0.6 + 0.2;
        }

        // Apply velocity damping
        firefly.vx *= 0.98;
        firefly.vy *= 0.98;

        // Limit maximum speed
        const maxSpeed = 1.2;
        const speed = Math.sqrt(firefly.vx * firefly.vx + firefly.vy * firefly.vy);
        if (speed > maxSpeed) {
          firefly.vx = (firefly.vx / speed) * maxSpeed;
          firefly.vy = (firefly.vy / speed) * maxSpeed;
        }

        // Update position
        firefly.x += firefly.vx;
        firefly.y += firefly.vy;

        // Soft boundary handling
        const margin = 50;
        if (firefly.x < margin) {
          firefly.x = margin;
          firefly.vx = Math.abs(firefly.vx);
        }
        if (firefly.x > canvas.width - margin) {
          firefly.x = canvas.width - margin;
          firefly.vx = -Math.abs(firefly.vx);
        }
        if (firefly.y < margin) {
          firefly.y = margin;
          firefly.vy = Math.abs(firefly.vy);
        }
        if (firefly.y > canvas.height - margin) {
          firefly.y = canvas.height - margin;
          firefly.vy = -Math.abs(firefly.vy);
        }

        // Update flickering
        firefly.flickerPhase += firefly.flickerSpeed;
        const flicker = Math.sin(firefly.flickerPhase) * 0.3 + 0.7;

        // Smooth opacity transition
        firefly.opacity += (firefly.targetOpacity - firefly.opacity) * 0.05;
        const currentOpacity = firefly.opacity * flicker;

        // Draw trail
        firefly.trailPoints.forEach((point, index) => {
          if (point.opacity > 0.01) {
            const size = firefly.radius * 0.3 * (index / firefly.trailPoints.length);
            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${firefly.hue}, 100%, 60%, ${point.opacity})`;
            ctx.fill();
          }
        });

        // Draw outer glow
        const gradient = ctx.createRadialGradient(
          firefly.x, firefly.y, 0,
          firefly.x, firefly.y, firefly.glowRadius
        );
        gradient.addColorStop(0, `hsla(${firefly.hue}, 100%, 70%, ${currentOpacity * 0.8})`);
        gradient.addColorStop(0.3, `hsla(${firefly.hue}, 100%, 60%, ${currentOpacity * 0.4})`);
        gradient.addColorStop(1, `hsla(${firefly.hue}, 100%, 50%, 0)`);

        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, firefly.glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw inner bright core
        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, firefly.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${firefly.hue}, 100%, 90%, ${currentOpacity})`;
        ctx.fill();

        // Draw very bright center
        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, firefly.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${firefly.hue}, 100%, 100%, ${currentOpacity * 1.2})`;
        ctx.fill();

        // Occasionally change energy levels
        if (Math.random() < 0.001) {
          firefly.energy = Math.random() * 0.5 + 0.5;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Update firefly positions to stay within bounds and redistribute if needed
      fireflies.forEach(firefly => {
        firefly.x = Math.min(Math.max(firefly.x, 50), canvas.width - 50);
        firefly.y = Math.min(Math.max(firefly.y, 50), canvas.height - 50);
        firefly.targetX = Math.min(Math.max(firefly.targetX, 50), canvas.width - 50);
        firefly.targetY = Math.min(Math.max(firefly.targetY, 50), canvas.height - 50);

        // If firefly is too close to edges after resize, give it a new random position
        if (firefly.x < 100 && Math.random() < 0.5) {
          firefly.x = Math.random() * (canvas.width - 200) + 100;
          firefly.y = Math.random() * (canvas.height - 200) + 100;
        }
      });
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

interface Chronicle {
  yourStoryTitle: string;
  chroniclesOfYou: string;
  incidentFrom: string;
  user: string;
  _id: string;
  emailAllowed: string;
  comments: string;
  replyAllowed: string;

}

interface DiaryProps {
  chronicle: Chronicle;
}

const Diary: React.FC<DiaryProps> = ({ chronicle }) => {
  const [slides, setSlides] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [editable, setEditable] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    yourStoryTitle: chronicle.yourStoryTitle,
    chroniclesOfYou: chronicle?.chroniclesOfYou,
    incidentFrom: chronicle?.incidentFrom,
    replyAllowed: chronicle?.replyAllowed,
    comments: chronicle?.comments,
    emailAllowed: chronicle?.emailAllowed,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  useEffect(() => {
    const id = Cookies.get("userId");
    if (id) {
      setUserId(id);
    }
    if (chronicle.chroniclesOfYou.length > 0) {
      const parts: string[] = [];
      for (let i = 0; i < chronicle.chroniclesOfYou.length; i += 1000) {
        parts.push(chronicle.chroniclesOfYou.slice(i, i + 1000));
      }
      setSlides(parts);
    }
  }, [chronicle]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("token");

    if (!token) {
      alert("You must be logged in.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(`/api/addChronicles/${chronicle?._id}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      const successMsg = res?.data?.message;
      setSuccess(successMsg)
      // alert(res.data.message || "Chronicle created!");
      setLoading(false);
    } catch (error: unknown) {
      setLoading(false);

      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        alert(err.response?.data?.message || "Something went wrong");
      } else {
        alert("Unexpected error");
      }
    }
  };
  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <> <SuccessMsg successMsg={success} />
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12 font-serif relative overflow-hidden">
        <Fireflies />
        <div className="flex justify-between w-full lg:px-20 mt-10 lg:mt-0 ">
          <Link href="/" className="flex gap-2">
            <Reply /> go back
          </Link>
          <div>
            {!editable ? (chronicle?.user === userId ? (<button onClick={() => setEditable(true)} className="flex gap-2" > <Edit /> Edit Chronicles </button>) : null) : (<button onClick={() => setEditable(false)}>&nbsp;&nbsp;<CircleX /></button>)}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 max-w-3xl w-full" data-aos="fade-up" data-aos-duration="1000">
          <div className="flex justify-between items-center">

          </div>
          {editable ? <input type="text" name="yourStoryTitle" className="font_clr2 mt-1 w-full p-2 border rounded-md focus:ring focus:ring-blue-300 eb-garamond text-white bg-transparent" value={formData.yourStoryTitle} onChange={handleChange} /> : <h1 className="mt-10 eb-garamond lg:pt-0 text-center text-4xl font-bold mb-8"> {chronicle.yourStoryTitle} </h1>}
          {editable ? <textarea name="chroniclesOfYou" className="border w-full mt-10 bg-transparent font_two scrollYTBH h-[400px]" value={formData?.chroniclesOfYou} onChange={handleChange}>
            {formData.chroniclesOfYou}
          </textarea> : <div className="font_one eb-garamond text-gray-200 tracking-wide whitespace-pre-wrap min-h-[700px] "> {slides[currentIndex]} </div>}
          {editable ? <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-white/90">
              <input
                type="checkbox"
                name="replyAllowed"
                checked={!!formData.replyAllowed}
                onChange={handleChange}
                className="accent-pink-400"
              />
              Allow Replies
            </label>
            <label className="flex items-center gap-2 text-white/90">
              <input
                type="checkbox"
                name="comments"
                checked={!!formData.comments}
                onChange={handleChange}
                className="accent-pink-400"
              />
              Enable Comments
            </label>
            <label className="flex items-center gap-2 text-white/90">
              <input
                type="checkbox"
                name="emailAllowed"
                checked={!!formData.emailAllowed}
                onChange={handleChange}
                className="accent-pink-400"
              />
              Allow Email
            </label>
          </div> : null}
          {editable ? <button
            type="submit"
            disabled={loading}
            className="tbh_button capitalize font_one mt-10"
          >
            {loading ? "Submitting..." : "Submit Chronicle"}
          </button> : <div className="flex justify-between items-center mt-8">
            <button onClick={goPrev} disabled={currentIndex === 0} className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-30" >
                <ArrowBigLeftDash/>
            </button>
            <button onClick={goNext} disabled={currentIndex === slides.length - 1} className="px-6 py-3 bg-gray-800 text-white 
            rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-30">   <ArrowBigRightDash/></button>
          </div>}
        </form>
      </div></>
  );
};

export default Diary;