"use client"

import * as React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Interface for component props
interface PersonaCardProps {
  image: string;
  tags: { label: string; color: string }[];
  rating: { label: string; color: string };
  title: string;
  description: string;
  link: string;
  className?: string;
}

export const PersonaCard = ({
  image,
  tags,
  rating,
  title,
  description,
  link,
  className,
}: PersonaCardProps) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.03, 
        boxShadow: '0px 20px 40px rgba(0,0,0,0.6)',
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      className={cn(
        'w-full max-w-sm overflow-hidden rounded-2xl border border-black bg-black text-white shadow-2xl cursor-pointer',
        className
      )}
    >
      {/* Image Section */}
      <div className="relative group h-64">
        <img
          src={image}
          alt={title}
          className="absolute h-full w-full object-cover object-top"
        />
        
        {/* Rating at Top Right */}
        <div className="absolute top-3 right-3 z-10">
          {(() => {
            const colorClass = rating.color === 'red' ? 'bg-red-900/90' :
                              rating.color === 'green' ? 'bg-green-900/90' :
                              rating.color === 'blue' ? 'bg-blue-900/90' : 'bg-gray-900/90';
            return (
              <Badge className={`flex items-center gap-1 ${colorClass} backdrop-blur-sm text-white border border-gray-800 shadow-lg`}>
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> {rating.label}
              </Badge>
            );
          })()}
        </div>
      </div>

      {/* Content Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="p-5 space-y-4 bg-black border-t border-gray-900"
      >
        <h3 className="text-xl font-bold text-white">{title}</h3>

        <p className="text-sm text-gray-400 leading-relaxed">
          {description}
        </p>

        <div className="flex justify-between items-center pt-2">
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag, index) => {
              const colorClass = tag.color === 'blue' ? 'bg-blue-900' :
                                tag.color === 'green' ? 'bg-green-900' :
                                tag.color === 'purple' ? 'bg-purple-900' :
                                tag.color === 'indigo' ? 'bg-indigo-900' :
                                tag.color === 'yellow' ? 'bg-yellow-900' :
                                tag.color === 'teal' ? 'bg-teal-900' :
                                tag.color === 'pink' ? 'bg-pink-900' :
                                tag.color === 'orange' ? 'bg-orange-900' :
                                tag.color === 'cyan' ? 'bg-cyan-900' : 'bg-gray-900';
              return (
                <Badge key={index} className={`${colorClass}/90 backdrop-blur-sm text-white border border-gray-800 shadow-lg`}>
                  {tag.label}
                </Badge>
              );
            })}
          </div>
          <Button asChild className="group bg-black hover:bg-gray-900 text-white border border-gray-800 shadow-lg">
            <Link href={link} className="flex items-center">
              Start Chat
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};