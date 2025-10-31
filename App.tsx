
import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { OutfitCard } from './components/OutfitCard';
import { Spinner } from './components/Spinner';
import { generateOutfits } from './services/geminiService';
import type { Outfit } from './types';

export default function App() {
  const [uploadedImage, setUploadedImage] = useState<{ base64: string; mimeType: string; previewUrl: string } | null>(null);
  const [outfits, setOutfits] = useState<Outfit[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (base64: string, mimeType: string, previewUrl: string) => {
    setUploadedImage({ base64, mimeType, previewUrl });
    setOutfits(null);
    setError(null);
  };
  
  const handleGenerateClick = async () => {
    if (!uploadedImage) return;

    setIsLoading(true);
    setError(null);
    setOutfits(null);

    try {
      const generated = await generateOutfits(uploadedImage.base64, uploadedImage.mimeType);
      setOutfits(generated);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setOutfits(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans">
      <main className="container mx-auto px-4 pb-12">
        <Header />

        {!uploadedImage && (
            <div className="mt-4">
                <FileUpload onImageUpload={handleImageUpload} disabled={isLoading} />
            </div>
        )}

        {uploadedImage && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="flex-shrink-0">
                    <img src={uploadedImage.previewUrl} alt="Uploaded clothing item" className="w-48 h-48 object-cover rounded-xl shadow-md" />
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h2 className="text-2xl font-bold text-brand-text">Your Item</h2>
                    <p className="text-brand-secondary mt-2">Ready to find the perfect match? Let's create some outfits based on this item.</p>
                    <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                        <button
                            onClick={handleGenerateClick}
                            disabled={isLoading}
                            className="w-full sm:w-auto px-6 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-md hover:bg-brand-primary-dark transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                            {isLoading ? 'Generating...' : 'Generate Outfits'}
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={isLoading}
                            className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-brand-text font-bold rounded-lg hover:bg-gray-300 transition-all duration-200 disabled:opacity-50"
                        >
                            Start Over
                        </button>
                    </div>
                </div>
            </div>
          </div>
        )}

        <div className="mt-12 max-w-6xl mx-auto">
            {isLoading && <Spinner />}

            {error && (
                <div className="max-w-2xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                    <p className="font-bold">Oh no, something went wrong!</p>
                    <p>{error}</p>
                </div>
            )}

            {outfits && outfits.length > 0 && (
                <>
                    <h2 className="text-3xl font-bold text-center text-brand-text mb-8">Here are your looks!</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {outfits.map((outfit) => (
                            <OutfitCard key={outfit.title} outfit={outfit} />
                        ))}
                    </div>
                </>
            )}
        </div>
      </main>
    </div>
  );
}
