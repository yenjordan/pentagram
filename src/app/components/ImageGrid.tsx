"use client";

import ImageCard from './ImageCard';
import { GeneratedImage } from '../types';

interface ImageGridProps {
    images: GeneratedImage[];
    collectionType: 'home' | 'liked' | 'saved';
}

export default function ImageGrid({ images, collectionType }: ImageGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
                <ImageCard 
                    key={`${collectionType}-${image.id}-${index}`}
                    image={image} 
                />
            ))}
        </div>
    );
} 