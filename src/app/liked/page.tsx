"use client";

import { useImages } from '../context/ImageContext';
import ImageGrid from '../components/ImageGrid';
import Header from '../components/Header';

export default function LikedImages() {
    const { likedImages } = useImages();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <Header />
            <div className="pt-24 pb-32 max-w-7xl mx-auto px-4">
                <h1 className="text-2xl font-bold mb-8 text-cyan-400">Liked Images</h1>
                <ImageGrid images={likedImages} collectionType="liked" />
            </div>
        </div>
    );
} 