import React, { useEffect, useRef } from "react";

const VenomBeam = ({ children, className = "" }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Detect mobile device and adjust particle count
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 80 : 150; // Reduced particles for mobile

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 0,
          maxLife: Math.random() * 150 + 80,
          size: Math.random() * 1.5 + 0.8,
          opacity: Math.random() * 0.9 + 0.4,
        });
      }
    };

    initParticles();

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // mouse interaction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200;
          p.vx += (dx / dist) * force * 0.08;
          p.vy += (dy / dist) * force * 0.08;
        }

        // bounce
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // reset particle
        if (p.life > p.maxLife) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.life = 0;
        }

        // glow effect
        const alpha = p.opacity * (1 - p.life / p.maxLife);
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size * 2.5
        );

        // Enhanced cyan glow effect
        gradient.addColorStop(0, `rgba(0, 255, 255, ${alpha * 0.8})`); // cyan center
        gradient.addColorStop(0.3, `rgba(0, 200, 255, ${alpha * 0.6})`); // blue-cyan
        gradient.addColorStop(0.7, `rgba(0, 150, 255, ${alpha * 0.3})`); // blue
        gradient.addColorStop(1, `rgba(0, 0, 0, 0)`); // fade out

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // connect nearby particles with enhanced visibility
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const opacity = (120 - dist) / 120;
            ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.6})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="relative w-full bg-black">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      />
      <div className={`relative z-10 ${className}`}>{children}</div>
    </div>
  );
};

export default VenomBeam;
