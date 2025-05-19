
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Landing: React.FC = () => {
  const { user } = useAuth();
  
  // If user is already logged in, redirect to the main app
  if (user) {
    return <Navigate to="/app" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vision-purple/10 to-vision-teal/10">
      <header className="container mx-auto py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-vision-purple">Vision Board</h1>
        <div className="space-x-4">
          <Link to="/auth">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-vision-purple hover:bg-vision-purple/90">Sign Up</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-vision-purple to-vision-teal bg-clip-text text-transparent">
              Visualize Your Dreams, Achieve Your Goals
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Create your personal vision board to clarify, maintain focus, and stay excited about your life goals.
            </p>
            <Link to="/auth">
              <Button className="bg-vision-purple hover:bg-vision-purple/90 text-lg py-6 px-8">
                Start Your Vision Board
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Visualize Your Goals",
                description: "Upload images that represent your dreams and aspirations to keep them top of mind."
              },
              {
                title: "Set Clear Deadlines",
                description: "Assign target dates to your goals to create urgency and track your progress."
              },
              {
                title: "Reflect on Your Why",
                description: "Document why each goal matters to you, fueling your motivation when challenges arise."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-vision-purple">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-6 text-center">How It Works</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: "1",
                  title: "Create an Account",
                  description: "Sign up with your email and password to get started."
                },
                {
                  step: "2",
                  title: "Upload Images",
                  description: "Add pictures that represent your goals and dreams."
                },
                {
                  step: "3",
                  title: "Add Details",
                  description: "Describe your goals and why they matter to you."
                },
                {
                  step: "4",
                  title: "Review Regularly",
                  description: "Visit your vision board daily to stay motivated."
                }
              ].map((step, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-12 h-12 bg-vision-purple/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-vision-purple">{step.step}</span>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-vision-purple mb-4">Ready to transform your dreams into reality?</h2>
            <Link to="/auth">
              <Button className="bg-vision-purple hover:bg-vision-purple/90">
                Create Your Vision Board Now
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
