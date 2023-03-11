import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useDebounce(value: any, delay: number): string {
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
  const [redirect, setRedirect] = useState<any>({
    path: path,
    timer: value,
  });
  const router = useRouter();
  useEffect(() => {
    if (redirect.timer === null) return;
    const inter = setInterval(() => {
      setRedirect((prev: any) => {
        return {
          ...prev,
          timer: prev.timer - 1,
        };
      });
    }, 1000);

    if (redirect.timer <= 0) {
      router.push(redirect.path);
      return;
    }
    return () => {
      clearInterval(inter);
    };
  }, [redirect.timer]);

  return [redirect, setRedirect];
}
