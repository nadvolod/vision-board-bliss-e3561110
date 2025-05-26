import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { 
  Trophy, 
  TrendingUp, 
  Rocket, 
  Star,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const Landing: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-vision-purple/10 to-vision-teal/10">
      <header className="container mx-auto py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-vision-purple">Vision Board</h1>
        <div className="space-x-4">
          {user ? (
            <Link to="/app">
              <Button className="bg-vision-purple hover:bg-vision-purple/90">My Board</Button>
            </Link>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-vision-purple hover:bg-vision-purple/90">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-vision-purple to-vision-teal bg-clip-text text-transparent">
              Visualize Your Dreams, Achieve Your Goals
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Create your personal vision board to clarify, maintain focus, and stay excited about your life goals.
            </p>
            {user ? (
              <Link to="/app">
                <Button className="bg-vision-purple hover:bg-vision-purple/90 text-lg py-6 px-8">
                  Go to My Vision Board
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button className="bg-vision-purple hover:bg-vision-purple/90 text-lg py-6 px-8">
                  Start Your Vision Board
                </Button>
              </Link>
            )}
          </div>
          
          {/* New inspirational carousel section */}
          <div className="my-16">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-vision-purple">
              Success Stories <Sparkles className="inline-block ml-1 text-vision-yellow" />
            </h3>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-4xl mx-auto"
            >
              <CarouselContent>
                {[
                  {
                    title: "Career Growth",
                    description: "Landed my dream job after visualizing it for 6 months",
                    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=500&auto=format&fit=crop",
                    icon: <TrendingUp className="text-vision-purple" />
                  },
                  {
                    title: "Health Milestone",
                    description: "Completed my first marathon after a year of focused training",
                    image: "https://images.unsplash.com/photo-1527933053326-89d1746b76b9?w=500&auto=format&fit=crop",
                    icon: <Trophy className="text-vision-yellow" />
                  },
                  {
                    title: "Financial Freedom",
                    description: "Paid off all debt and saved for my dream vacation",
                    image: "https://images.unsplash.com/photo-1565514020179-026b92b2d95b?w=500&auto=format&fit=crop",
                    icon: <Star className="text-vision-teal" />
                  },
                  {
                    title: "Business Launch",
                    description: "Started my own business after visualizing success daily",
                    image: "https://images.unsplash.com/photo-1552664688-cf412ec27db2?w=500&auto=format&fit=crop",
                    icon: <Rocket className="text-vision-pink" />
                  }
                ].map((story, idx) => (
                  <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                    <div className="bg-white rounded-xl overflow-hidden shadow-md h-full flex flex-col transition-all hover:shadow-lg">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={story.image} 
                          alt={story.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            // If the image fails to load, use a default image
                            target.src = "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=500&auto=format&fit=crop";
                          }}
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent"></div>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-vision-purple/10 flex items-center justify-center mr-3">
                            {story.icon}
                          </div>
                          <h4 className="font-bold text-lg">{story.title}</h4>
                        </div>
                        <p className="text-gray-600">{story.description}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="left-1" />
                <CarouselNext className="right-1" />
              </div>
            </Carousel>
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
            {user ? (
              <Link to="/app">
                <Button className="bg-vision-purple hover:bg-vision-purple/90">
                  Go to My Vision Board
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button className="bg-vision-purple hover:bg-vision-purple/90">
                  Create Your Vision Board Now
                </Button>
              </Link>
            )}
            
            {/* Built by UltimateQA link */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <a 
                href="https://www.ultimateqa.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-vision-purple transition-colors"
              >
                Built by UltimateQA
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
