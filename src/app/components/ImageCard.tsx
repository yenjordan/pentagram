"use client";

import { motion } from 'framer-motion';
import { TbHeart, TbHeartFilled, TbBookmark, TbBookmarkFilled } from 'react-icons/tb';
import { GeneratedImage } from '../types';
import { useImages } from '../context/ImageContext';
import Image from 'next/image';

interface ImageCardProps {
    image: GeneratedImage;
}

export default function ImageCard({ image }: ImageCardProps) {
    const { toggleLike, toggleSave, likedImages, savedImages } = useImages();
    
    // Check status using the original ID
    const isLiked = likedImages.some(img => img.id === image.id);
    const isSaved = savedImages.some(img => img.id === image.id);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group flex flex-col"
        >
            <div className="relative bg-gray-900 rounded-t-xl overflow-hidden">
                <div className="aspect-square relative overflow-hidden">
                    <Image
                        src={image.url}
                        alt={image.prompt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            </div>

            <div className="relative bg-gray-900/95 rounded-b-xl border-t border-cyan-500/20">
                <div className="px-3 pt-2 pb-1">
                    <p className="text-center font-medium text-gray-400 text-xs tracking-wide truncate">
                        {image.prompt}
                    </p>
                </div>
                <div className="px-3 py-2 flex justify-between items-center border-t border-cyan-500/10">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleLike(image)}
                        className="flex items-center gap-1 text-white hover:text-pink-500 transition-colors"
                    >
                        {isLiked ? (
                            <TbHeartFilled className="text-xl text-pink-500" />
                        ) : (
                            <TbHeart className="text-xl" />
                        )}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleSave(image)}
                        className="flex items-center gap-1 text-white hover:text-cyan-500 transition-colors"
                    >
                        {isSaved ? (
                            <TbBookmarkFilled className="text-xl text-cyan-500" />
                        ) : (
                            <TbBookmark className="text-xl" />
                        )}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
} 