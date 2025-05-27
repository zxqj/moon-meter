import React, {useEffect, useRef, useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Slider} from "@/components/ui/slider.tsx";
import {RandomVariableCard} from "./RandomVariableCard";
import {type RandomVariableCardData} from "./types"
import {createListElementStateSetter} from "@/lib/utils.ts";
import RainbowText from "@/components/RainbowText.tsx";
import Add from '@mui/icons-material/Add';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Stop from '@mui/icons-material/Stop';
import {Fab, IconButton} from "@mui/material";

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
        {
            id: 2,
            name: "Chord Progression",
            items: ["ii-9 V7 I6/9 (α)", "iiø V-alt i-6 (α)", "ii-7 V7 I6/9 (β)", "iiø V-alt i-6 (β)"],
            frequency: 12,
            leadtime: 6,
            nextItem: '?',
            currentItem: '_',
            excludedItems: [],
            enabled: false
        }]);
    const [bpm, setBpm] = useState(120);
    const [isPlaying, setIsPlaying] = useState(false);
    const [beatCount, setBeatCount] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const createCardUpdater = createListElementStateSetter(setCards)
    useEffect(() => {
        if (isPlaying) {
            setBeatCount(0);

            intervalRef.current = setInterval(() => {
                (async () => {
                    const audio = new Audio(metronomeSound);
                    audio.currentTime = 0;
                    await audio.play();
                    setBeatCount(prev => prev + 1);
                })().catch(console.error); // Handl
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
        <div style={{
            display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem"
        }}>

            <Fab aria-label="add" onClick={addCard} style={{backgroundColor: "var(--color-primary)", color: "var(--color-primary-foreground)", position: "absolute", bottom: 20, right: 20}}>
                <Add />
            </Fab>

            <div
                style={{display: "flex", justifyContent: "start", padding: "0 2rem"}}>
                <RainbowText
                    className="font-bold lg:inline-block"
                    colors={["green", "pink", "blue", "yellow", "orange"]
                        .map((c) => `var(--neon-${c})`)}
                    text="moon-meter"/>

            </div>
            <div
                className="App"
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "2rem",
                    padding: "1rem",
                    justifyContent: "center",
                }}
            >
                <Card style={{
                    flex: 1, display: "flex", flexDirection: "column", position: "relative",
                    justifyContent: "space-around", maxWidth: 400
                }}>
                    <CardContent style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
                        <div className="font-bold lg:inline-block" style={{textAlign: "left", marginBottom: "1.5rem"}}>
                            <span style={{color: "var(--color-primary)"}}>m</span>etronome
                        </div>
                        <div>
                            <Label htmlFor="bpm" style={{marginBottom: "0.5rem"}}>BPM</Label>
                            <Slider
                                id="bpm"
                                value={[bpm]}
                                min={40}
                                max={240}
                                step={1}
                                onValueChange={value => {
                                    setBpm(value[0]);
                                }}
                            />
                            <span>{bpm}</span>
                        </div>
                        <IconButton
                            className="button"
                            style={{
                                backgroundColor: "var(--color-primary)",
                                color: "var(--color-primary-foreground)",
                                position: "absolute",
                                right: 20,
                                top: 20
                            }}
                            onClick={() => {
                                setIsPlaying(prev => !prev);
                            }}
                        >
                            { isPlaying ? (<Stop />) : (<PlayArrow />) }
                        </IconButton>
                    </CardContent>
                </Card>
            </div>
                <div style={{display: "flex", justifyContent: "space-around", gap: "1rem"}}>
                    {cards.map((card, i) => (
                        <RandomVariableCard key={card.id} card={card} beatCount={beatCount}
                                            updateCard={createCardUpdater(i)}/>
                    ))}
                </div>
            </div>
            );
            }

            export default App;