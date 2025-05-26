import React, {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Slider} from "@/components/ui/slider.tsx";
import {RandomVariableCard} from "./RandomVariableCard";
import {type RandomVariableCardData} from "./types"
import {Plus} from "lucide-react";
import {createListElementStateSetter} from "@/lib/utils.ts";

const metronomeSound = "/public/Perc_MetronomeQuartz_hi.wav";
// Example usage:
function App() {
    const [cards, setCards] = useState<RandomVariableCardData[]>([
        {
            id: 1,
            name: "Key",
            items: ["A", "B♭", "B", "C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭"],
            frequency: 12,
            leadtime: 6,
            nextItem: '?',
            currentItem: '_',
            excludedItems: [],
            enabled: false
        },
    ]);
    const [bpm, setBpm] = useState(120);
    const [isPlaying, setIsPlaying] = useState(false);
    const [beatCount, setBeatCount] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const createCardUpdater = createListElementStateSetter(setCards)
    useEffect(() => {
        if (isPlaying) {
            setBeatCount(0);
            const audio = new Audio(metronomeSound);
            intervalRef.current = setInterval(() => {
                audio.currentTime = 0;
                audio.play();
                setBeatCount(prev => prev + 1);
            }, (60 / bpm) * 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying, bpm]);

    const addCard = () => {
        setCards(prev => [
            ...prev,
            {
                id: prev.length + 1,
                name: `Card ${String(prev.length + 1)}`,
                items: [],
                nextItem: '?',
                currentItem: '_',
                frequency: 8,
                leadtime: 4,
                excludedItems: [],
                enabled: false
            },
        ]);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem" }}>
            <Card style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", justifyContent: "space-between", maxWidth: 300 }}>
                <Button onClick={addCard} style={{position: "absolute", bottom: 20, right: 20}} variant="outline" size="icon">
                    <Plus></Plus>
                </Button>
                <CardContent style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className="font-bold lg:inline-block" style={{ textAlign: "left", marginBottom: "1.5rem" }}>
                        <span style={{ color: "var(--color-primary)" }}>m</span>etronome
                    </div>
                    <div>
                        <Label htmlFor="bpm" style={{ marginBottom: "0.5rem" }}>BPM</Label>
                        <Slider
                            id="bpm"
                            value={[bpm]}
                            min={40}
                            max={240}
                            step={1}
                            onValueChange={value => { setBpm(value[0]); }}
                        />
                        <span>{bpm}</span>
                    </div>
                    <Button
                        style={{
                            width: 50,
                            position: "absolute",
                            right: 20,
                            top: 20,
                            backgroundColor: isPlaying ? "var(--color-primary)" : "oklch(0.77 0.20 131)"
                        }}
                        onClick={() => { setIsPlaying(prev => !prev);} }
                    >
                        {isPlaying ? "Stop" : "Start"}
                    </Button>
                </CardContent>
            </Card>
            <div style={{ display: "flex", gap: "1rem" }}>
                {cards.map((card, i) => (
                    <RandomVariableCard key={card.id} card={card} beatCount={beatCount} updateCard={createCardUpdater(i)} />
                ))}
            </div>
        </div>
    );
}

export default App;