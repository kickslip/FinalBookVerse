"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UpcomingBooksSidebar = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides] = useState([
    '/slides/slide1.jpg',
    '/slides/slide2.jpg',
    '/slides/slide3.jpg',
    '/slides/slide4.jpg',
    '/slides/slide5.jpg',
    '/slides/slide6.jpg',
    '/slides/slide7.jpg',
    '/slides/slide8.jpg',
    '/slides/slide9.jpg'
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-center">
          New Books Coming Soon!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="relative aspect-[3/4] overflow-hidden rounded-md">
            <img
              src={slides[currentSlide] || "/api/placeholder/320/427"}
              alt={`Upcoming book ${currentSlide + 1}`}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
          </div>
          
          <div className="absolute inset-x-0 bottom-0 flex justify-between p-2">
            <Button
              variant="secondary"
              size="sm"
              className="opacity-75 hover:opacity-100"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="opacity-75 hover:opacity-100"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary' : 'bg-muted'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingBooksSidebar;