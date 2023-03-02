import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export function useRedirect(path: string, value: number | null) {
  const [timer, setTimer] = useState<any>(value);
  const router = useRouter();
  console.log("timer", value);
  console.log("path", path);
  useEffect(() => {
    if (timer === null) return;
    const inter = setInterval(() => {
      setTimer((prev: number) => prev - 1);
    }, 1000);

    if (timer <= 0) {
      router.push(path);
      return;
    }
    return () => {
      clearInterval(inter);
    };
  }, [timer]);

  return [timer, setTimer];
}
