import { useEffect, useState } from "react";

const MonkeyLoader = ({text,size}) => {
  const monkeys = ["🐒", "🐵", "🙈", "🙉", "🙊", "🍌"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % monkeys.length);
    }, 400); // speed (ms)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <span className={`${size}`}>{monkeys[index]}</span>
      <span className="text-sm opacity-70">{text}</span>
    </div>
  );
};

export default MonkeyLoader;
