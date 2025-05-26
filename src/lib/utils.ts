import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

type Transform<T> = (before: T) => T
type StateSetter<T> = (f: Transform<T>) => void

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createListElementUpdater<T>(list: T[]): (index: number) => (updateFn: (item: T) => T) => T[] {
  return (index: number) => (updateFn: (item: T) => T): T[] => {
    if (index < 0 || index >= list.length) {
      throw new Error("Index out of bounds");
    }
    const newList =list.map((item, i) => (i === index ? updateFn(item) : item));
    console.log(newList);
    return newList;
  };
}


export function createListElementStateSetter<T>(setState: StateSetter<T[]>): (index: number) => (updateFn: (item: T) => T) => void {
    return (index: number) => (updateFn: (item: T) => T): void => {
        setState((list: T[])=> {
            if (index < 0 || index >= list.length) {
                throw new Error("Index out of bounds");
            }
            const newList =list.map((item, i) => (i === index ? updateFn(item) : item));
            console.log(newList);
            return newList;
        });
    };
}

export const set = <M, K extends keyof M>(attrName: K) =>
    (value: M[K]) => (prev: M) => ({
      ...prev,
      [attrName]: value
    });

