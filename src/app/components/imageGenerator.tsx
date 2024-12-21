"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useImages } from '../context/ImageContext';
import { GeneratedImage } from '../types';
import ImageGrid from './ImageGrid';
import { v4 as uuidv4 } from 'uuid';
import Header from './Header';

interface ImageGeneratorProps {
    generateImage: (text: string) => Promise<{success: boolean, imageUrl?: string; error?: string}>;
}

export default function ImageGenerator({ generateImage }: ImageGeneratorProps) {
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [allImages, setAllImages] = useState<GeneratedImage[]>([]);
    const { likedImages, savedImages } = useImages();

    // Load images from localStorage on mount
    useEffect(() => {
        const savedImages = localStorage.getItem('generatedImages');
        if (savedImages) {
            const parsedImages = JSON.parse(savedImages);
            setAllImages(parsedImages);
        }
    }, []);

    const MAX_IMAGES = 8;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await generateImage(inputText);
            
            if (!result.success) {
                throw new Error(result.error || "Failed to generate image");
            }

            if (result.imageUrl) {
                const newImage: GeneratedImage = {
                    id: uuidv4(),
                    url: result.imageUrl,
                    prompt: inputText,
                    createdAt: new Date(),
                    isLiked: false,
                    isSaved: false
                };
                
                setAllImages(prev => {
                    if (prev.some(img => img.url === result.imageUrl)) {
                        return prev;
                    }

                    let updatedImages;
                    if (prev.length >= MAX_IMAGES) {
                        const oldestImage = prev[prev.length - 1];
                        
                        if (likedImages.some(img => img.id === oldestImage.id)) {
                            const updatedLikedImages = likedImages.filter(img => img.id !== oldestImage.id);
                            localStorage.setItem('likedImages', JSON.stringify(updatedLikedImages));
                        }
                        if (savedImages.some(img => img.id === oldestImage.id)) {
                            const updatedSavedImages = savedImages.filter(img => img.id !== oldestImage.id);
                            localStorage.setItem('savedImages', JSON.stringify(updatedSavedImages));
                        }
                        
                        updatedImages = [newImage, ...prev.slice(0, -1)];
                    } else {
                        updatedImages = [newImage, ...prev];
                    }
                    
                    localStorage.setItem('generatedImages', JSON.stringify(updatedImages));
                    return updatedImages;
                });
                
                setInputText("");
            }
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.7),rgba(0,0,0,0.4))]" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-20" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-20" />
            </div>

            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="pt-24 pb-32 max-w-6xl mx-auto px-4">
                <ImageGrid images={allImages} collectionType="home" />
            </main>

            {/* Footer with Input */}
            <footer className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-black/40 border-t border-cyan-500/20">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="flex-1 p-4 rounded-xl bg-gray-900/90 border border-cyan-500/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-gray-100 placeholder-gray-400 transition-all"
                                placeholder="Describe your vision..."
                                disabled={isLoading}
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="relative px-8 py-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium hover:bg-cyan-500/20 transition-all group overflow-hidden"
                            >
                                <div className="absolute inset-0 rounded-xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 animate-pulse" />
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                                </div>
                                <span className="relative">
                                    {isLoading ? 'Processing...' : 'Generate'}
                                </span>
                            </motion.button>
                        </div>
                    </form>
                </div>
            </footer>
        </div>
    );
}