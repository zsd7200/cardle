'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { 
  startOfToday, eachDayOfInterval, 
  startOfWeek, endOfWeek, 
  endOfMonth, isToday, isSameMonth, 
  format, parse, add }
from 'date-fns';

export default function Calendar() {
  const currDate = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(format(currDate, 'MMM-yyyy'));
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
  
  const days = eachDayOfInterval({ 
    start: startOfWeek(firstDayCurrentMonth), 
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)) 
  });

  const weekdays = [
    { long: 'Sunday', short: 'Sun', initial: 'S' },
    { long: 'Monday', short: 'Mon', initial: 'M' },
    { long: 'Tuesday', short: 'Tues', initial: 'T' },
    { long: 'Wednesday', short: 'Wed', initial: 'W' },
    { long: 'Thursday', short: 'Thurs', initial: 'T' },
    { long: 'Friday', short: 'Fri', initial: 'F' },
    { long: 'Saturday', short: 'Sat', initial: 'S' },
  ];

  const minYear = 2025;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const classNames = (...classes: Array<any>) => {
    return classes.filter(Boolean).join(' ');
  }

  const previousMonth = () => {
    const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
    if (firstDayPrevMonth.getFullYear() < minYear) return;
    setCurrentMonth(format(firstDayPrevMonth, 'MMM-yyyy'));
  }

  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  return (
    <>
      <div className="pt-16">
        <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
          <div className="flex items-center">
            <h2 className="flex-auto font-semibold text-3xl text-gray-600 dark:text-gray-100">
              {format(firstDayCurrentMonth, 'MMMM yyyy')}
            </h2>
            <button
              type="button"
              onClick={previousMonth}
              className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Previous month</span>
              <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={nextMonth}
              type="button"
              className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Next month</span>
              <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-7 mt-10 text-lg leading-6 text-center text-gray-700">
            {weekdays.map(weekday => (
              <div key={weekday.long}>
                <span>{weekday.initial}</span>
              </div>
            ))}
          </div>
          <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
          <div className="grid grid-cols-7 mt-2 text-2xl">
            {days.map(day => (
              <div
                key={day.toString()}
                className="py-1.5"
              >
                <Link
                  href={
                    (day <= new Date() && day.getFullYear() >= minYear) 
                    ? `/archive/${format(day, 'yyyy-MM-dd')}` 
                    : '#'
                  }
                  className={classNames(
                    !isToday(day) && isSameMonth(day, firstDayCurrentMonth) && (day < new Date()) &&
                      'dark:text-gray-100 hover:bg-purple-300 active:bg-purple-500 hover:text-gray-800',
                    !isToday(day) && isSameMonth(day, firstDayCurrentMonth) && (day > new Date()) &&
                      'text-gray-400 hover:cursor-default',
                    !isToday(day) && !isSameMonth(day, firstDayCurrentMonth) &&
                      'text-gray-300 dark:text-gray-600 hover:cursor-default',
                    isToday(day) && 
                      'text-gray-100 bg-purple-600 active:bg-purple-800 font-semibold',
                    'mx-auto flex h-10 w-10 md:h-20 md:w-20 items-center justify-center rounded-full transition'
                  )}
                >
                  <time dateTime={format(day, 'yyyy-MM-dd')}>
                    {format(day, 'd')}
                  </time>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}