'use client';

import { useState } from 'react';
import { Image, ChevronDown } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';

interface BackgroundSelectorProps {
  onBackgroundChange: (background: string) => void;
  currentBackground: string;
}

const backgroundOptions = [
  {
    id: 'gradient',
    name: 'Default Gradient',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    preview: (
      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 rounded" />
    )
  },
  {
    id: 'mountain',
    name: 'Mountain Vista',
    value: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    preview: (
      <img 
        src="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&fit=crop" 
        alt="Mountain Vista" 
        className="w-full h-full object-cover rounded"
      />
    )
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    value: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    preview: (
      <img 
        src="https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&fit=crop" 
        alt="Ocean Waves" 
        className="w-full h-full object-cover rounded"
      />
    )
  },
  {
    id: 'forest',
    name: 'Forest Path',
    value: 'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    preview: (
      <img 
        src="https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&fit=crop" 
        alt="Forest Path" 
        className="w-full h-full object-cover rounded"
      />
    )
  },
  {
    id: 'city',
    name: 'City Skyline',
    value: 'https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    preview: (
      <img 
        src="https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&fit=crop" 
        alt="City Skyline" 
        className="w-full h-full object-cover rounded"
      />
    )
  },
  {
    id: 'desert',
    name: 'Desert Dunes',
    value: 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    preview: (
      <img 
        src="https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&fit=crop" 
        alt="Desert Dunes" 
        className="w-full h-full object-cover rounded"
      />
    )
  }
];

export function BackgroundSelector({ onBackgroundChange, currentBackground }: BackgroundSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleBackgroundChange = (background: string) => {
    onBackgroundChange(background);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/10 h-6 px-2 text-xs"
        >
          <Image className="w-3 h-3 mr-1" />
          Background
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[480px] p-4 bg-white/95 backdrop-blur-md border border-white/20 shadow-xl" 
        align="start"
        side="bottom"
        sideOffset={8}
      >
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900">Choose Background</h3>
          <div className="grid grid-cols-3 gap-3">
            {backgroundOptions.map((option) => {
              const isSelected = currentBackground === option.value;
              return (
                <button
                  key={option.id}
                  onClick={() => handleBackgroundChange(option.value)}
                  className={`relative group aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                    isSelected 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option.preview}
                  {isSelected && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white\" fill="currentColor\" viewBox="0 0 20 20">
                          <path fillRule="evenodd\" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {option.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
