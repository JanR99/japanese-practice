import React, { useState } from 'react';

export type SetName = 'hiragana' | 'katakana' | 'kanji';

type StartScreenProps = {
    onSelectSet: (setName: SetName, cefrLevel?: string) => void;
};

export default function StartScreen({ onSelectSet }: StartScreenProps) {
    const [showCefr, setShowCefr] = useState(false);
    const [selectedSet, setSelectedSet] = useState<SetName | null>(null);

    const handleSetClick = (setName: SetName) => {
        setSelectedSet(setName);
        setShowCefr(true);
    };

    const handleCefrSelect = (level: string) => {
        if (selectedSet) onSelectSet(selectedSet, level);
        setShowCefr(false);
    };

    return (
        <div className="start-screen">
            <p>What do you want to practice?</p>
            <button onClick={() => handleSetClick('hiragana')}>Hiragana</button>
            <button onClick={() => handleSetClick('katakana')}>Katakana</button>
            <button onClick={() => handleSetClick('kanji')}>Kanji</button>

            {showCefr && (
                <div className="cefr-popup">
                    <p>Select CEFR Level</p>
                    {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                        <button key={lvl} onClick={() => handleCefrSelect(lvl)}>
                            {lvl}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
