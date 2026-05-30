import React, { useEffect, useRef } from "react";

const CharacterCursor = ({
  characters = ["h", "e", "l", "l", "o"],
  colors = ["#6622CC", "#A755C2", "#B07C9E", "#B59194", "#D2A1B8"],
  cursorOffset = { x: 0, y: 0 },
  zIndex = 9999,
  font = "15px serif",
  characterLifeSpanFunction = () => Math.floor(Math.random() * 60 + 80),
  initialCharacterVelocityFunction = () => ({
    x: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 5,
    y: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 5,
  }),
  characterVelocityChangeFunctions = {
    x_func: () => (Math.random() < 0.5 ? -1 : 1) / 30,
    y_func: () => (Math.random() < 0.5 ? -1 : 1) / 15,
  },
  characterScalingFunction = (age, lifeSpan) =>
    Math.max(((lifeSpan - age) / lifeSpan) * 2, 0),
  characterNewRotationDegreesFunction = (age, lifeSpan) =>
    (lifeSpan - age) / 5,
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const cursorRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);
  const canvImagesRef = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    if (prefersReducedMotion.matches) {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    if (!context) return undefined;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const randomSign = () => (Math.random() < 0.5 ? -1 : 1);

    class Particle {
      constructor(x, y, img) {
        const lifeSpan = characterLifeSpanFunction();
        this.rotationSign = randomSign();
        this.age = 0;
        this.initialLifeSpan = lifeSpan;
        this.lifeSpan = lifeSpan;
        this.velocity = initialCharacterVelocityFunction();
        this.position = {
          x: x + cursorOffset.x,
          y: y + cursorOffset.y,
        };
        this.canv = img;
      }

      update(ctx) {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.lifeSpan -= 1;
        this.age += 1;

        this.velocity.x += characterVelocityChangeFunctions.x_func(
          this.age,
          this.initialLifeSpan
        );
        this.velocity.y += characterVelocityChangeFunctions.y_func(
          this.age,
          this.initialLifeSpan
        );

        const scale = characterScalingFunction(this.age, this.initialLifeSpan);
        const degrees =
          this.rotationSign *
          characterNewRotationDegreesFunction(this.age, this.initialLifeSpan);
        const radians = degrees * 0.0174533;

        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(radians);
        ctx.drawImage(
          this.canv,
          (-this.canv.width / 2) * scale,
          -this.canv.height / 2,
          this.canv.width * scale,
          this.canv.height * scale
        );
        ctx.restore();
      }
    }

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const createCharacterImages = () => {
      context.font = font;
      context.textBaseline = "middle";
      context.textAlign = "center";

      canvImagesRef.current = characters.map((character) => {
        const measured = context.measureText(character);
        const bgCanvas = document.createElement("canvas");
        const bgContext = bgCanvas.getContext("2d");
        if (!bgContext) return null;

        bgCanvas.width = Math.ceil(measured.width + 10);
        bgCanvas.height = Math.ceil(measured.actualBoundingBoxAscent * 2.5 + 10);
        bgContext.font = font;
        bgContext.textAlign = "center";
        bgContext.textBaseline = "middle";
        bgContext.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        bgContext.fillText(
          character,
          bgCanvas.width / 2,
          bgCanvas.height / 2
        );
        return bgCanvas;
      }).filter(Boolean);
    };

    const addParticle = (x, y) => {
      const image = canvImagesRef.current[
        Math.floor(Math.random() * canvImagesRef.current.length)
      ];
      if (image) {
        particlesRef.current.push(new Particle(x, y, image));
      }
    };

    const animate = () => {
      if (!context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => particle.update(context));

      particlesRef.current = particlesRef.current.filter(
        (particle) => particle.lifeSpan >= 0
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const onMouseMove = (event) => {
      cursorRef.current.x = event.clientX;
      cursorRef.current.y = event.clientY;
      addParticle(cursorRef.current.x, cursorRef.current.y);
    };

    const onTouchMove = (event) => {
      for (let i = 0; i < event.touches.length; i += 1) {
        addParticle(event.touches[i].clientX, event.touches[i].clientY);
      }
    };

    resizeCanvas();
    createCharacterImages();
    animate();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = "none";

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      document.body.style.cursor = originalCursor;
    };
  }, [
    characters,
    colors,
    cursorOffset,
    font,
    characterLifeSpanFunction,
    initialCharacterVelocityFunction,
    characterVelocityChangeFunctions,
    characterScalingFunction,
    characterNewRotationDegreesFunction,
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex,
      }}
    />
  );
};

export default CharacterCursor;
