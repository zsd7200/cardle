'use client';

import { useState, useRef, KeyboardEvent } from "react";
import fetchData from "@/components/util/FetchData";

type PasswordInputProps = {
  children: React.ReactNode,
  password?: string,
  hint?: string,
}

export default function PasswordInput({children, password, hint} : PasswordInputProps) {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isWrong, setIsWrong] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getPassUrl = () => {
    const url: string =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api/pass'
        : 'https://www.cardle.wtf/api/pass';
    
    return url;
  }

  const handleClick = async () => {
    const pass = inputRef.current?.value.toLowerCase().replace(' ', '');
    const result = await fetchData(getPassUrl(), 'POST', JSON.stringify({ pass: pass }));
    if (result) {
      return setIsVerified(true);
    }

    setIsWrong(true);
    setTimeout(() => { setIsWrong(false) }, 1000);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  return (
    <>
    {(isVerified)
      ? 
        <>
          {children}
        </>
      : 
        <div className="w-screen flex justify-center">
            <div className="flex flex-col gap-y-4 flex-wrap max-w-[60vw] items-center justify-center">
            <div className="flex items-center justify-center">
                <input className="rounded-l-lg border p-4 dark:bg-gray-800 dark:text-white" name="pass" type="password" ref={inputRef} onKeyDown={handleKeyDown} />
                <button className="rounded-r-lg border p-4" onClick={handleClick}>submit</button>
            </div>
            {(hint) && <span className="text-xs italic max-w-[50%]">{hint}</span>}
            {(isWrong) &&
                <span className="fixed bottom-24 text-xs italic max-w-[50%] text-red-500">Wrong password, please try again.</span>
            }
            </div>
        </div>
    }
    </>
  );
}