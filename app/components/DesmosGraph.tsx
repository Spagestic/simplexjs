import { useEffect, useRef } from "react";
import Desmos from "desmos";

interface DesmosGraphProps {
  equations: string[];
}

export default function DesmosGraph({ equations }: DesmosGraphProps) {
  const calculatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (calculatorRef.current) {
      const calculator = Desmos.GraphingCalculator(
        calculatorRef.current
      ) as DesmosConfig;
      configureDesmos(calculator, equations);

      return () => {
        calculator.destroy();
      };
    }
  }, [equations]);

  return <div ref={calculatorRef} className="w-3/5 min-h-screen" />;
}

export type DesmosConfig = Desmos.GraphingCalculator;

export const configureDesmos = (
  calculator: DesmosConfig,
  equations: string[]
) => {
  if (Array.isArray(equations)) {
    equations.forEach((equation, index) => {
      calculator.setExpression({ id: `graph${index + 1}`, latex: equation });
    });
  }
};
