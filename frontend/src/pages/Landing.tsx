import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[hsl(var(--color-background))] font-['Inter']">
      <div className="px-6 text-[#2e2e38]">
        {/* Hero */}
        <section className="max-w-4xl mx-auto text-center py-20 md:py-24">
          <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold leading-tight mb-6">
            Welcome to <span className="text-[hsl(var(--color-primary))]">Luma</span>
          </h1>
          <p className="text-xl md:text-2xl text-[hsl(var(--color-muted-foreground))] mb-10 max-w-2xl mx-auto">
            A journaling space for quiet minds and honest reflections.
          </p>
          <Link to="/auth">
            <button className="bg-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-serenity))] text-[hsl(var(--color-primary-foreground))] px-8 py-4 rounded-full font-bold text-lg transition-[var(--transition-gentle)] shadow-[var(--shadow-gentle)] hover:shadow-[var(--shadow-warm)] hover:-translate-y-1">
              Start Journaling
            </button>
          </Link>
        </section>

        {/* Daily Prompts Section */}
        <section className="max-w-4xl mx-auto py-20 md:py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-semibold mb-4 relative inline-block pb-1">
              Daily Prompts
              <div className="absolute bottom-0 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 w-1/3 h-1 bg-[hsl(var(--color-warmth))] rounded-full"></div>
            </h2>
            <p className="text-lg md:text-xl text-[hsl(var(--color-muted-foreground))]">
              New questions each day to guide your reflections and support
              mindful growth. Our prompts are designed to gently encourage
              self-discovery without pressure.
            </p>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-[hsl(var(--color-serenity))] rounded-full flex items-center justify-center text-[hsl(var(--color-primary-foreground))] text-6xl shadow-inner opacity-80">
              ✍️
            </div>
          </div>
        </section>

        {/* Private & Calm Section */}
        <section className="max-w-4xl mx-auto py-20 md:py-24 text-center">
          <div className="bg-[hsl(var(--color-card))] bg-opacity-80 rounded-xl shadow-[var(--shadow-gentle)] p-8 md:p-12">
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-semibold mb-4 relative inline-block pb-1">
              Private & Calm
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-[hsl(var(--color-warmth))] rounded-full"></div>
            </h2>
            <p className="font-['Cormorant_Garamond'] text-xl md:text-2xl italic text-[hsl(var(--color-muted-foreground))] max-w-2xl mx-auto">
              "No followers, no likes — just your thoughts in a safe, personal
              space. Your reflections are yours alone, fostering genuine
              self-connection."
            </p>
          </div>
        </section>

        {/* Mental Wellness First Section */}
        <section className="max-w-4xl mx-auto py-20 md:py-24 flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-semibold mb-4 relative inline-block pb-1">
              Mental Wellness First
              <div className="absolute bottom-0 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 w-1/3 h-1 bg-[hsl(var(--color-warmth))] rounded-full"></div>
            </h2>
            <p className="text-lg md:text-xl text-[hsl(var(--color-muted-foreground))]">
              Built for clarity, self-care, and steady progress. Luma
              prioritizes your mental well-being with tools designed to support
              a balanced and reflective life.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-[hsl(var(--color-warmth))] rounded-full flex items-center justify-center text-6xl shadow-inner opacity-80">
              😊
            </div>
          </div>
        </section>

        {/* Ready to Reflect CTA */}
        <section className="max-w-4xl mx-auto py-20 md:py-24 text-center">
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-semibold mb-6">
            Ready to reflect?
          </h2>
          <p className="text-lg md:text-xl text-[hsl(var(--color-muted-foreground))] mb-10 max-w-2xl mx-auto">
            Join our mindful community today and start your journey towards a
            calmer, more reflective self.
          </p>
          <Link to="/auth">
            <button className="bg-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-serenity))] text-[hsl(var(--color-primary-foreground))] px-8 py-4 rounded-full font-bold text-lg transition-[var(--transition-gentle)] shadow-[var(--shadow-gentle)] hover:shadow-[var(--shadow-warm)] hover:-translate-y-1">
              Join Luma Today
            </button>
          </Link>
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-[hsl(var(--color-muted-foreground))] text-sm bg-[hsl(var(--color-card))] mt-auto">
        <p>&copy; 2025 Luma. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
