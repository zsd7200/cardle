'use client';

import { useState, useEffect } from 'react';
import { getRandomCard, getMonNamesFromApi, InnerCardData, dummyCard } from '@/components/util/tcg/card';
import { compareTwoStrings } from 'string-similarity';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Confetti from 'react-confetti';

type CardProps = {
  data?: InnerCardData
}

export default function Card(props: CardProps | undefined = undefined) {
  const [cardData, setCardData] = useState<InnerCardData>(dummyCard);
  const [monNames, setMonNames] = useState<Array<string>>(['Pokémon']);
  const [guessesRemaining, setGuessesRemaining] = useState<number>(3);
  const [guessesUsed, setGuessesUsed] = useState<number>(0);
  const [winState, setWinState] = useState<Boolean>(false);
  const [loseState, setLoseState] = useState<Boolean>(false);
  const [confettiPieces, setConfettiPieces] = useState<number>(200);

  useEffect(() => {
    let loadCardData = async () => {
      if (props?.data) {
        setCardData(props.data);
        return;
      }
  
      const randomCardData = await getRandomCard();
      setCardData(randomCardData);
    }

    let loadMonNames = async () => {
      const monNamesData = await getMonNamesFromApi();
      setMonNames(monNamesData);
    }

    loadCardData();
    loadMonNames();
  }, []);

  // handle any differences between the apis
  let formatName = (name: string) => {
    name = name.trim();

    if (name.includes("'s ")) {
      name = name.split("'s ")[1];
    }

    name = name.replace(/ vmax/gi, '');
    name = name.replace(/ v/gi, '');
    name = name.replace(/ ex/gi, '');
    name = name.replace(/ gx/gi, '');
    name = name.replace(/[^\w\s]/gi, '');

    if (
      name.includes('Alolan') ||
      name.includes('Galarian') ||
      name.includes('Hisuian') ||
      name.includes('Paldean')
    ) {
      name = name.split(' ').reverse().join(' ');
      name = name.replace('Alolan', 'Alola');
      name = name.replace('Galarian', 'Galar');
      name = name.replace('Hisuian', 'Hisui');
      name = name.replace('Paldean', 'Paldea');
    }

    name = name.replace(' ', '');
    name = name.toLowerCase();

    return name;
  }

  let handleSubmit = (e: any) => {
    e.preventDefault();
    const answer = formatName(cardData.name);
    const guess = formatName(e.target.mon.value);
    const minAllowedPercent = 0.8;

    if (compareTwoStrings(answer, guess) < minAllowedPercent) {
      const newGuessesRemaining = guessesRemaining - 1;
      const newGuessesUsed = guessesUsed + 1;
      setGuessesRemaining(newGuessesRemaining);
      setGuessesUsed(newGuessesUsed);

      if (newGuessesRemaining == 0) {
        return handleLoss();
      }
      return;
    }

    return handleWin();
  };

  let handleWin = () => {
    setWinState(true);
    setTimeout(() => { setConfettiPieces(0); }, 5000);
  }

  let handleLoss = () => {
    setLoseState(true);
  }

  let cardClasses = () => {
    let base = 'h-[700px] pointer-events-none ';
    if (winState) return base;

    switch (guessesRemaining) {
      case 3:
      default:
        base += 'blur-3xl';
        break;
      case 2:
        base += 'blur-xl';
        break;
      case 1:
        base += 'blur-md';
        break;
      case 0:
        break;
    }
    return base;
  }

  return (
    <>
      <div className="flex justify-center items-center gap-[50px]">
        <div className="overflow-hidden">
          <div className="overflow-hidden max-h-[700px] w-fit">
            <img src={cardData.images.large ?? cardData.images.small} className={cardClasses()} id="card-image" />
          </div>
        </div>
        <div className="flex flex-col w-1/3 text-lg rounded-lg px-[15px] py-[10px] shadow-[0px_0px_13px_8px_rgba(128,_128,_128,_0.1)] bg-gray-700">
          <div className="flex flex-col pb-[15px]">
            <div className="flex justify-between">
              <span>Classification:</span>
              <span>{cardData.supertype ?? 'Unknown Classification'}</span>
            </div>
            <div className="flex justify-between">
              <span>Subclasses:</span>
              <div>
                {cardData.subtypes.map((type: string, i: number) => (
                  <span key={type}>{ (i ? ', ' : '') + type }</span>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <span>Set:</span>
              <span>{cardData.set.name ?? 'Unknown Set'}</span>
            </div>
            <div className="flex justify-between">
              <span>Rarity:</span>
              <span>{cardData.rarity ?? 'Unknown Rarity'}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <form onSubmit={handleSubmit} className="flex items-center gap-[5px]">
              <input 
                list="mon"
                name="mon"
                placeholder={ monNames[Math.floor(Math.random() * monNames.length)] }
                className="
                  text-black px-2 py-1 border rounded-md 
                  shadow-sm outline-none focus:ring-2 
                  focus:ring-purple-300 transition
                  arrow:!block
                  arrow:mt-[-10px]
                  arrow:text-purple-400
                "
              />
              <datalist id="mon">
                {monNames.map(name => (
                  <option key={name} value={name}></option>
                ))}
              </datalist>
              <button type="submit" className="bg-purple-400 hover:bg-purple-600 active:bg-purple-800 text-white font-bold py-1 px-3 rounded transition">Guess</button>
            </form>
            <div>
              <ul className="flex gap-[10px]">
                {[...Array(guessesRemaining)].map((_: any, i: number) => (
                  <li key={`remain-guess-${i}`} className="text-purple-300"><FontAwesomeIcon icon={faCircle} /></li>
                ))}
                {[...Array(guessesUsed)].map((_: any, i: number) => (
                  <li key={`used-guess-${i}`} className="text-red-400"><FontAwesomeIcon icon={faCircleXmark} /></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {winState && <Confetti numberOfPieces={confettiPieces} />}
    </>
  );
}