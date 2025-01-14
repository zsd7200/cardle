'use client';

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { 
  startOfToday, eachDayOfInterval, startOfWeek, 
  startOfMonth, endOfWeek, endOfMonth, 
  isToday, isEqual, isSameMonth, 
  getDay, format, parse, add } 
from 'date-fns';

export default function Calendar() {
  const router = useRouter();
  const currDate = startOfToday();
  let [currentMonth, setCurrentMonth] = useState(format(currDate, 'MMM-yyyy'));
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
  
  let days = eachDayOfInterval({ 
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

  let clickHandler = (date: string) => {
    router.push(`/archive/${date}`);
  }

  let classNames = (...classes: Array<any>) => {
    return classes.filter(Boolean).join(' ');
  }

  let previousMonth = () => {
    let firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
    if (firstDayPrevMonth.getFullYear() < minYear) return;
    setCurrentMonth(format(firstDayPrevMonth, 'MMM-yyyy'));
  }

  let nextMonth = () => {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  return (
    <>
      <div className="pt-16">
        <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
          <div className="flex items-center">
            <h2 className="flex-auto font-semibold text-3xl">
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
                <button
                  type="button"
                  onClick={e => {
                    if (day <= new Date() && day.getFullYear() >= minYear) {
                      clickHandler(format(day, 'yyyy-MM-dd'));
                    }
                  }}
                  className={classNames(
                    !isToday(day) && isSameMonth(day, firstDayCurrentMonth) && (day < new Date()) &&
                      'text-gray-100 hover:bg-purple-300 hover:text-gray-800',
                    !isToday(day) && isSameMonth(day, firstDayCurrentMonth) && (day > new Date()) &&
                      'text-gray-400 hover:cursor-default',
                    !isToday(day) && !isSameMonth(day, firstDayCurrentMonth) &&
                      'text-gray-600 hover:cursor-default',
                    isToday(day) && 
                      'text-gray-100 bg-purple-800 font-semibold',
                    'mx-auto flex h-20 w-20 items-center justify-center rounded-full transition'
                  )}
                >
                  <time dateTime={format(day, 'yyyy-MM-dd')}>
                    {format(day, 'd')}
                  </time>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}