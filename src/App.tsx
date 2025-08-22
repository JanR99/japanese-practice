import React, { useState } from 'react';
import StartScreen, { SetName } from './Components/StartScreen';
import FlashcardScreen from './Components/FlashcardScreen';
import './styles/App.css';
import './styles/Button.css';
import './styles/Card.css';
import './styles/Popup.css';

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
            {!selectedSet && <h1>Japanese Practice</h1>}
            {!selectedSet && <StartScreen onSelectSet={handleSetSelect} />}
            {selectedSet && <FlashcardScreen setName={selectedSet} cefrLevel={cefrLevel} onBack={handleBack} />}
        </div>
    );
}
