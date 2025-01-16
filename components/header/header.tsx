'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney, faClock, faCalendarDays, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function Header() {
  const [mounted, setMounted] = useState<boolean>(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const changeTheme = () => {
    if (resolvedTheme === 'light') {
      return setTheme('dark');
    }

    return setTheme('light');
  }

  const revalidateHome = () => {
    revalidatePath('/');
  }

  return (
    <>
      <header className="flex w-full justify-between px-[30px] my-[13px]">
        <div>
          <h1 className="text-3xl font-bold text-gray-600 dark:text-gray-100">Cardle</h1>
        </div>
        <nav className="flex">
          <ul className="flex gap-[15px] justify-end items-center text-gray-600 dark:text-gray-100">
            <li title="Home" className="h-[25px]">
              <Link href="/" onClick={revalidateHome}>
                <FontAwesomeIcon icon={faHouseChimney} className="h-[25px] hover:text-purple-300 active:text-purple-500 transition"/>
              </Link>
            </li>
            <li title="Daily" className="h-[25px]">
              <Link href="/daily">
                <FontAwesomeIcon icon={faClock} className="h-[25px] hover:text-purple-300 active:text-purple-500 transition"/>
              </Link>
            </li>
            <li title="Archive" className="h-[25px]">
              <Link href="/archive">
                <FontAwesomeIcon icon={faCalendarDays} className="h-[25px] hover:text-purple-300 active:text-purple-500 transition"/>
              </Link>
            </li>
            <li title="Change Theme" className="h-[25px] w-[25px]">
              <button onClick={changeTheme}>
                <FontAwesomeIcon icon={(resolvedTheme === 'light') ? faMoon : faSun} className="h-[25px] hover:text-purple-300 active:text-purple-500 transition"/>
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700" />
    </>
  );
}