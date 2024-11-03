import React, { useState } from 'react';
import NavigationButtons from './NavigationButtons';
import './Flashcard.css';

const Flashcard = () => {
  const [cardIndex, setCardIndex] = useState(0);

  const handleNext = () => {
    setCardIndex(cardIndex + 1);
  };

  const handleBack = () => {
    setCardIndex(cardIndex > 0 ? cardIndex - 1 : 0);
  };

  return (
    <div className="flashcard-container">
      <div className="flashcard">
        <p>Card {cardIndex + 1}</p>
      </div>
      <NavigationButtons onNext={handleNext} onBack={handleBack} />
    </div>
  );
};

export default Flashcard;
