"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import banner from '../assets/banner.jpeg';
import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';


const Landing = () => { 
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-center gradient-title'>
            Manage Your Finances <br /> With Intelligence
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl mx-auto leading-relaxed">
            An AI-powered financial management platform that helps you track,
            analyze, and optimize your spending with real-time insights.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-5 text-center">
            <Link to="/signup">
              <Button variant="outline" size="lg" className="px-6 py-3 rounded-full hover:bg-gradient-to-b from-blue-600 to-purple-600 hover:text-white transition-all duration-200">
                Get Started
              </Button>
            </Link>         
            <Link to="/login">
              <Button variant="outline" size="lg" className="px-6 py-3 rounded-full hover:bg-gradient-to-b from-blue-600 to-purple-600 hover:text-white transition-all duration-200">
                Login
              </Button>
            </Link>
          </div>
          <div className='hero-image-wrapper mt-5 md:mt-0'>     
            <div ref={imageRef} className="hero-image">
              <img 
                src={banner} 
                alt="Finance management dashboard" 
                className="rounded-lg shadow-2xl border mx-auto"
                
              />
            </div>
          </div>
          {/* add a data and testimonial section */}
          {/* Features Section */}
      <div className="bg-gradient-to-r from-white to-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose FinTrak
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the powerful features that make FinTrak the smart choice for your financial management.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="hover:-translate-y-2 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">📊</span>
                  </div>
                  <CardTitle className="text-sm font-medium">Smart Analytics</CardTitle>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-600">free</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get powerful insights into your spending patterns and financial health with our AI-powered analytics.
                </p>
                <div className="flex gap-2 mt-4">
                  <Badge variant="outline" className="bg-blue-50 text-blue-600">AI-Powered</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-600">Real-time</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="hover:-translate-y-2 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">💰</span>
                  </div>
                  <CardTitle className="text-sm font-medium">Expense Tracking</CardTitle>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-600">free</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track all your expenses in one place with our intuitive interface and automatic categorization.
                </p>
                <div className="flex gap-2 mt-4">
                  <Badge variant="outline" className="bg-green-50 text-green-600">Auto-Categorize</Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-600">Real-time</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="hover:-translate-y-2 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">🔒</span>
                  </div>
                  <CardTitle className="text-sm font-medium">Secure & Private</CardTitle>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-600">free</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your financial data is protected with end-to-end encryption and advanced security measures.
                </p>
                <div className="flex gap-2 mt-4">
                  <Badge variant="outline" className="bg-purple-50 text-purple-600">Encrypted</Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-600">2FA</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-gray-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - see what our satisfied users have to say.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="hover:-translate-y-2 transition-all duration-300">
              <CardContent>
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&dpr=2&q=80"
                      alt="John Doe"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "FinTrak has completely transformed how I manage my finances. The insights are invaluable!"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">J</span>
                  </div>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-gray-500">Financial Analyst</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="hover:-translate-y-2 transition-all duration-300">
              <CardContent>
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&dpr=2&q=80"
                      alt="Mary Smith"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "The expense tracking is so intuitive, I finally have a clear picture of my spending."
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">M</span>
                  </div>
                  <div>
                    <p className="font-medium">Mary Smith</p>
                    <p className="text-sm text-gray-500">Small Business Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="hover:-translate-y-2 transition-all duration-300">
              <CardContent>
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&dpr=2&q=80"
                      alt="Alex Johnson"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "I love the security features. My financial data feels safe with FinTrak."
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">A</span>
                  </div>
                  <div>
                    <p className="font-medium">Alex Johnson</p>
                    <p className="text-sm text-gray-500">Tech Professional</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* action section add to full display */}
      {/* Call to Action Section */}
      
      < div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Managing Your Finances?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of users who have taken control of their financial future.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 transition-all duration-200">
              Start Your Free Trial
            </Button>
          </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default Landing;
