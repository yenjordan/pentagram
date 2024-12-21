"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { GeneratedImage } from '../types';

interface ImageContextType {
  likedImages: GeneratedImage[];
  savedImages: GeneratedImage[];
  toggleLike: (image: GeneratedImage) => void;
  toggleSave: (image: GeneratedImage) => void;
  addNewImage: (image: GeneratedImage) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [likedImages, setLikedImages] = useState<GeneratedImage[]>([]);
  const [savedImages, setSavedImages] = useState<GeneratedImage[]>([]);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedLiked = localStorage.getItem('likedImages');
    const savedSaved = localStorage.getItem('savedImages');
    if (savedLiked) setLikedImages(JSON.parse(savedLiked));
    if (savedSaved) setSavedImages(JSON.parse(savedSaved));
  }, []);

  // Save to localStorage whenever the arrays change
  useEffect(() => {
    localStorage.setItem('likedImages', JSON.stringify(likedImages));
    localStorage.setItem('savedImages', JSON.stringify(savedImages));
  }, [likedImages, savedImages]);

  const toggleLike = (image: GeneratedImage) => {
    const isLiked = likedImages.some(img => img.id === image.id);
    
    if (isLiked) {
      // Remove from liked images
      setLikedImages(prev => prev.filter(img => img.id !== image.id));
    } else {
      // Add to liked images
      const likedImage = {
        ...image,
        isLiked: true
      };
      setLikedImages(prev => [likedImage, ...prev]);
    }

    // Update the image in localStorage if it exists there
    const storedImages = JSON.parse(localStorage.getItem('generatedImages') || '[]');
    const updatedStoredImages = storedImages.map((img: GeneratedImage) => 
      img.id === image.id ? { ...img, isLiked: !isLiked } : img
    );
    localStorage.setItem('generatedImages', JSON.stringify(updatedStoredImages));
  };

  const toggleSave = (image: GeneratedImage) => {
    const isSaved = savedImages.some(img => img.id === image.id);
    
    if (isSaved) {
      // Remove from saved images
      setSavedImages(prev => prev.filter(img => img.id !== image.id));
    } else {
      // Add to saved images
      const savedImage = {
        ...image,
        isSaved: true
      };
      setSavedImages(prev => [savedImage, ...prev]);
    }

    // Update the image in localStorage if it exists there
    const storedImages = JSON.parse(localStorage.getItem('generatedImages') || '[]');
    const updatedStoredImages = storedImages.map((img: GeneratedImage) => 
      img.id === image.id ? { ...img, isSaved: !isSaved } : img
    );
    localStorage.setItem('generatedImages', JSON.stringify(updatedStoredImages));
  };

  const addNewImage = (image: GeneratedImage) => {
    const existingImages = JSON.parse(localStorage.getItem('generatedImages') || '[]');
    if (!existingImages.some((img: GeneratedImage) => img.id === image.id)) {
      const updatedImages = [image, ...existingImages];
      localStorage.setItem('generatedImages', JSON.stringify(updatedImages));
    }
  };

  return (
    <ImageContext.Provider value={{ 
      likedImages, 
      savedImages, 
      toggleLike, 
      toggleSave,
      addNewImage 
    }}>
      {children}
    </ImageContext.Provider>
  );
}

export function useImages() {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImages must be used within an ImageProvider');
  }
  return context;
} 