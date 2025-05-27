import React from "react";

type RainbowTextProps = React.HTMLAttributes<HTMLSpanElement> & {
    colors?: string[];
    text: string;
};

const defaultColors: string[] = [];
for (let i = 1; i <= 5; i++) {
    defaultColors.push(`var(--chart-${String(i)})`);
}

export default function RainbowText({ colors = defaultColors, text, ...spanProps }: RainbowTextProps) {
    if (!colors || colors.length === 0) return <span {...spanProps}>{text}</span>;

    return (
        <span {...spanProps}>
            {Array.from(text).map((char, idx) => (
                <span key={idx} style={{ color: colors[idx % colors.length] }}>
                    {char}
                </span>
            ))}
        </span>
    );
}