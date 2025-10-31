
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center py-8 md:py-12 px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-text tracking-tight">
                Virtual Stylist AI
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-secondary">
                Stuck on what to wear? Upload a single item and let AI create three complete looks for you.
            </p>
        </header>
    );
};
