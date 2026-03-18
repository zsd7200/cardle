'use client';

import { useState, useEffect } from 'react';
import { getAllSetsFromApi, getCardsBySetIdFromApi, SetData } from "@/components/util/tcg/SetUtilities";
import { getCardById } from '@/components/util/tcg/CardUtilities';
import PasswordInput from '@/components/util/PasswordInput';

export default function Populate() {
  const [started, setStarted] = useState<boolean>(false);
  const [waiting, setWaiting] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [currSet, setCurrSet] = useState<string>('');
  const [currProgress, setCurrProgress] = useState<number>(0);
  const [setData, setSetData] = useState<Array<SetData>>([]);
  const [populated, setPopulated] = useState<Array<boolean>>([]);

  useEffect(() => {
    const getSetData = async () => {
        const allSetData = await getAllSetsFromApi();
        setSetData(allSetData);

        const boolArr = [];
        for (let i = 0; i < allSetData.length; i++) {
            boolArr.push(false);
        }
        setPopulated(boolArr);
    }

    getSetData();
  }, []);

  const beginPopulating = async () => {
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const boolArr: Array<boolean> = [...populated];
    setStarted(true);

    for (let i = 0; i < setData.length; i++) {
        const cardsFromSet = await getCardsBySetIdFromApi(setData[i].set_id);
        setCurrSet(setData[i].set_id);
        for (let j = 0; j < cardsFromSet.length; j++) {
            console.log(cardsFromSet[j]);
            setCurrProgress((j / cardsFromSet.length) * 100);
            try {
                await getCardById(cardsFromSet[j].id);
            } catch (e) {
                console.warn(`error on card with ID: ${cardsFromSet[j].id}`);
            }
            
        }
        boolArr[i] = true;
        setPopulated(boolArr);
        setWaiting(true);
        setCurrProgress(0);
        await wait(5000);
        setWaiting(false);
    }

    setStarted(false);
    setFinished(true);
  }

  return (
    <PasswordInput>
        <div className="mx-16">
        <div className="w-full flex justify-center">
            <button 
                className="bg-purple-500 hover:bg-purple-400 rounded-md transition p-2 mb-4" 
                onClick={beginPopulating} 
                disabled={started || finished}>
                    {(started) 
                        ? <span>populating...</span> 
                        : (finished)
                            ? <span>finished populating</span>
                            : <span>begin populating</span>
                    }
                </button>
        </div>
        <div className="pb-6 w-full">
            <div className="pb-1">
            {(waiting) 
                ? <span>waiting before populating next set...</span>
                : (started)
                    ? <span>populating set {currSet}...</span>
                    : (finished)
                        ? <span>finished populating</span>
                        : <span>press the button to begin</span>
            }
            </div>
            <div className="w-full bg-red-400 rounded-full h-2">
            <div
                className="bg-green-400 h-full rounded-full"
                style={{ width: `${currProgress}%`}}
            >
            </div>
            </div>
        </div>
        <div className="flex flex-wrap justify-center">
            {(setData && Array.isArray(setData) && setData.length > 0)
            ? setData.map((el, idx) => (
                <div className="w-24">
                <p className={`${(populated[idx] ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400')} p-2 border`}>{el.set_id}</p>
                </div>
            ))
            : <span>loading set data...</span>
            }
        </div>
        </div>
    </PasswordInput>
  );
}
