import React, { useState, useEffect } from 'react';
import { SetName } from './StartScreen';

type Word = {
    word: string;
    english_translation: string;
    cefr_level?: string;
    romanization?: string;
    example_sentence_native?: string;
    example_sentence_english?: string;
};

type FlashcardScreenProps = {
    setName: SetName;
    cefrLevel?: string;
    onBack: () => void;
};

export default function FlashcardScreen({ setName, cefrLevel, onBack }: FlashcardScreenProps) {
    const [words, setWords] = useState<Word[]>([]);
    const [idx, setIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setError(null);
        setFlipped(false);

        fetch(`/${setName}.json`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data: Word[]) => {
                const filtered = cefrLevel ? data.filter((w) => w.cefr_level === cefrLevel) : data;
                const finalWords = Array.isArray(filtered) ? filtered : [];
                setWords(finalWords);

                // Randomize initial index
                if (finalWords.length > 0) {
                    const randomIndex = Math.floor(Math.random() * finalWords.length);
                    setIdx(randomIndex);
                }
            })
            .catch(() => setError('Failed to load words.'));
    }, [setName, cefrLevel]);

    const nextRandomIndex = () => {
        if (words.length <= 1) return 0;
        let i = Math.floor(Math.random() * words.length);
        if (i === idx) i = (i + 1) % words.length;
        return i;
    };

    const handleNext = () => {
        // Temporarily hide card content
        setFlipped(false);

        // Wait for the flip animation to finish before showing new card
        setTimeout(() => {
            setIdx(nextRandomIndex());
        }, 300); // match with CSS transition duration (0.6s / 2)
    };

    const current = words[idx];

    return (
        <div>
            <button className="back-button" onClick={onBack}>
                &larr; Back
            </button>

            {error && <p className="error">{error}</p>}

            {current && (
                <div className={`card ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped((f) => !f)}>
                    <div className="card-inner">
                        <div className="card-front">
                            <div className="glyph">{current.word}</div>
                            {current.romanization && <div className="romanization">{current.romanization}</div>}
                        </div>
                        <div className="card-back">
                            <div className="meaning">{current.english_translation}</div>
                            {current.example_sentence_native && (
                                <div className="example">
                                    <div>{current.example_sentence_native}</div>
                                    <div>{current.example_sentence_english}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <button className="next-button" onClick={handleNext}>
                Next
            </button>
        </div>
    );
}
