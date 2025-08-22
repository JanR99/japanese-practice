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
    const [deck, setDeck] = useState<Word[]>([]);
    const [idx, setIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [learnedCount, setLearnedCount] = useState(0);

    const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    // Load words from JSON and filter by CEFR level
    useEffect(() => {
        setError(null);
        setFlipped(false);

        fetch(`/${setName}.json`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data: Word[]) => {
                let filtered: Word[];
                if (cefrLevel) {
                    const levelIndex = CEFR_LEVELS.indexOf(cefrLevel);
                    const allowedLevels = CEFR_LEVELS.slice(0, levelIndex + 1);
                    filtered = data.filter((w) => w.cefr_level && allowedLevels.includes(w.cefr_level));
                } else {
                    filtered = data;
                }

                const finalWords = Array.isArray(filtered) ? filtered : [];
                setWords(finalWords);

                // Load progress from localStorage
                const savedProgress: string[] = JSON.parse(localStorage.getItem('learnedWords') || '[]');
                const remainingDeck = finalWords.filter(w => !savedProgress.includes(w.word));
                setDeck(remainingDeck);
                setLearnedCount(savedProgress.length);

                if (remainingDeck.length > 0) {
                    setIdx(Math.floor(Math.random() * remainingDeck.length));
                }
            })
            .catch(() => setError('Failed to load words.'));
    }, [setName, cefrLevel]);

    // Mark current word as learned
    const markAsLearned = () => {
        const word = deck[idx];
        const saved: string[] = JSON.parse(localStorage.getItem('learnedWords') || '[]');
        if (!saved.includes(word.word)) saved.push(word.word);
        localStorage.setItem('learnedWords', JSON.stringify(saved));

        const newDeck = deck.filter((_, i) => i !== idx);
        setDeck(newDeck);
        setLearnedCount(learnedCount + 1);

        if (newDeck.length > 0) setIdx(Math.floor(Math.random() * newDeck.length));
    };

    // Move current word to back of deck
    const reviewLater = () => {
        if (deck.length > 1) {
            let newIdx = idx;
            while (newIdx === idx) newIdx = Math.floor(Math.random() * deck.length);
            setIdx(newIdx);
        }
        setFlipped(false);
    };

    // Reset all progress
    const resetProgress = () => {
        localStorage.removeItem('learnedWords');
        setDeck([...words]);
        setLearnedCount(0);
        if (words.length > 0) setIdx(Math.floor(Math.random() * words.length));
    };

    const current = deck[idx];

    return (
        <div>
            <button className="back-button" onClick={onBack}>
                &larr; Back
            </button>

            {error && <p className="error">{error}</p>}

            {/* Learned counter */}
            <p>Learned: {learnedCount} / {words.length}</p>
            <button className="reset-button" onClick={resetProgress}>Reset Progress</button>

            {current && (
                <div className={`card ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
                    <div className="card-inner">
                        <div className="card-front">
                            {current.cefr_level && <div className="cefr-label">{current.cefr_level}</div>}
                            <div className="glyph">{current.word}</div>
                            {current.romanization && <div className="romanization">{current.romanization}</div>}
                        </div>
                        <div className="card-back">
                            <div className="meaning">
                                {current.english_translation
                                    .split(';')
                                    .map((t, i) => <div key={i}>{t.trim()}</div>)}
                            </div>
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

            {current && (
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <button className="next-button" onClick={markAsLearned}>I knew it</button>
                    <button className="back-button" onClick={reviewLater}>Review later</button>
                </div>
            )}
        </div>
    );
}
