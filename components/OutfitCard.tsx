
import React from 'react';
import type { Outfit } from '../types';

interface OutfitCardProps {
  outfit: Outfit;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({ outfit }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="aspect-w-1 aspect-h-1 w-full bg-gray-100">
        <img src={outfit.imageUrl} alt={outfit.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 bg-white">
        <h3 className="text-lg font-semibold text-brand-text text-center">{outfit.title}</h3>
      </div>
    </div>
  );
};
