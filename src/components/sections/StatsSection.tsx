'use client';

import { Users, Award, Smartphone, Clock } from 'lucide-react';
import { STATS } from '@/data/site-data';
import type { LucideIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const iconMap: LucideIcon[] = [Users, Award, Smartphone, Clock];

export default function StatsSection() {
  const [counts, setCounts] = useState<number[]>(STATS.map(() => 0));
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const animationStarted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animationStarted.current) {
          setIsVisible(true);
          animationStarted.current = true;
        }
      },
      { threshold: 0.3 } // Trigger when 30% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // Animation duration in milliseconds
    const steps = 60; // Number of steps for smooth animation
    const stepDuration = duration / steps;

    const targetValues = STATS.map(stat => {
      // Extract numeric value from string (e.g., "500+" -> 500)
      const numericValue = parseInt(stat.value.replace(/[^0-9]/g, ''));
      return isNaN(numericValue) ? 0 : numericValue;
    });

    let currentStep = 0;
    const intervalId = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      const newCounts = targetValues.map(target => {
        // Use easeOutQuad easing for smoother animation
        const easedProgress = 1 - Math.pow(1 - progress, 2);
        return Math.round(target * easedProgress);
      });
      
      setCounts(newCounts);

      if (currentStep >= steps) {
        clearInterval(intervalId);
        // Set final values
        setCounts(targetValues);
      }
    }, stepDuration);

    return () => clearInterval(intervalId);
  }, [isVisible]);

  // Format the count with + sign if original value had it
  const formatValue = (count: number, index: number) => {
    const originalValue = STATS[index].value;
    const hasPlus = originalValue.includes('+');
    const hasK = originalValue.includes('K');
    
    let formatted = count.toString();
    if (hasPlus) formatted += '+';
    if (hasK && count >= 1000) {
      formatted = (count / 1000).toFixed(1) + 'K+';
    }
    return formatted;
  };

  return (
    <section ref={sectionRef} className="bg-[#e6f0ff] py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, index) => {
            const Icon = iconMap[index];
            const displayValue = isVisible ? formatValue(counts[index] || 0, index) : '0';
            
            return (
              <div key={stat.label} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#002b5c] rounded-full text-white">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-3xl lg:text-4xl font-bold text-[#002b5c] mt-3">
                  {displayValue}
                </p>
                <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}