import React, { useState } from 'react';
import StartScreen, { SetName } from './StartScreen';
import FlashcardScreen from './FlashcardScreen';
import './App.css';
import './Button.css';
import './Card.css';
import './Popup.css';

export default function App() {
    const [selectedSet, setSelectedSet] = useState<SetName | null>(null);
    const [cefrLevel, setCefrLevel] = useState<string | undefined>(undefined);

    const handleBack = () => {
        setSelectedSet(null);
        setCefrLevel(undefined);
    };

    const handleSetSelect = (setName: SetName, level?: string) => {
        setSelectedSet(setName);
        setCefrLevel(level);
    };

    return (
        <div className="App">
            <h1>Japanese Practice</h1>
            {!selectedSet && <StartScreen onSelectSet={handleSetSelect} />}
            {selectedSet && <FlashcardScreen setName={selectedSet} cefrLevel={cefrLevel} onBack={handleBack} />}
        </div>
    );
}
