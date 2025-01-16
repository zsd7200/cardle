'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney, faClock, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export default function Header() {
  const revalidateHome = () => {
    revalidatePath('/');
  }

  return (
    <>
      <header className="flex w-full justify-between px-[30px] my-[13px]">
        <div>
          <h1 className="text-3xl font-bold">Cardle</h1>
        </div>
        <nav className="flex">
          <ul className="flex gap-[15px] justify-end items-center">
            <li title="Home" className="h-[30px]">
              <Link href="/" onClick={revalidateHome}>
                <FontAwesomeIcon icon={faHouseChimney} className="h-[30px] hover:text-purple-300 active:text-purple-500 transition"/>
              </Link>
            </li>
            <li title="Daily" className="h-[30px]">
              <Link href="/daily">
                <FontAwesomeIcon icon={faClock} className="h-[30px] hover:text-purple-300 active:text-purple-500 transition"/>
              </Link>
            </li>
            <li title="Archive" className="h-[30px]">
              <Link href="/archive">
                <FontAwesomeIcon icon={faCalendarDays} className="h-[30px] hover:text-purple-300 active:text-purple-500 transition"/>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700" />
    </>
  );
}