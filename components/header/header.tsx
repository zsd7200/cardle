'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney, faClock, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function Header() {
  return (
    <>
      <header className="flex w-full justify-between px-[30px] my-[10px]">
        <div>
          <h1 className="text-3xl font-bold">Cardle</h1>
        </div>
        <nav className="flex">
          <ul className="flex gap-[10px] justify-end">
            <li title="Home">
              <Link href="/">
                <FontAwesomeIcon icon={faHouseChimney} className="h-[30px]"/>
              </Link>
            </li>
            <li title="Daily">
              <Link href="/daily">
                <FontAwesomeIcon icon={faClock} className="h-[30px]"/>
              </Link>
            </li>
            <li title="Archive">
              <Link href="/archive">
                <FontAwesomeIcon icon={faCalendarDays} className="h-[30px]"/>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700" />
    </>
  );
}