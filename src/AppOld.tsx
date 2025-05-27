import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import "./App.css";
import RainbowText from "@/components/RainbowText.tsx";

// Import the audio file
const metronomeSound = "/public/Perc_MetronomeQuartz_hi.wav";

const TONES = ["A", "B♭", "B", "C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭"];

function App() {
    const [bpm, setBpm] = useState(120);
    const [frequency, setFrequency] = useState(12);
    const [leadtime, setLeadtime] = useState(6);
    const [currentKey, setCurrentKey] = useState(null);
    const [nextKey, setNextKey] = useState(TONES[Math.floor(Math.random() * TONES.length)]);
    const [excludedKeys, setExcludedKeys] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [beatCount, setBeatCount] = useState(0);
    const [keyFrequencies, setKeyFrequencies] = useState(
        TONES.reduce((acc, tone) => ({ ...acc, [tone]: 0 }), {})
    );

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'x' && currentKey && !excludedKeys.includes(currentKey)) {
                setExcludedKeys((prev) => [...prev, currentKey]);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentKey, excludedKeys]);

    useEffect(() => {
        let interval = null;
        const audio = new Audio(metronomeSound);

        if (isPlaying) {
            interval = setInterval(() => {
                audio.currentTime = 0;
                audio.play();

                if ((beatCount + frequency - leadtime) % frequency === frequency - 1) {
                    setCurrentKey(() => {
                        if (nextKey !== "?") {
                            setKeyFrequencies((freqs) => ({
                                ...freqs,
                                [nextKey]: freqs[nextKey] + 1,
                            }));
                        }
                        return nextKey;
                    });
                    setNextKey("?");

                } else if ((beatCount + frequency) % frequency === frequency - 1) {
                    setNextKey(() => {
                        const availableTones = TONES.filter((tone) => !excludedKeys.includes(tone));
                        return availableTones[Math.floor(Math.random() * availableTones.length)] || "?";
                    });
                }

                setBeatCount((val) => (val + 1)); // Cycle through all elements, including the last one
            }, (60 / bpm) * 1000);
        }

        return () => clearInterval(interval);
    }, [bpm, frequency, leadtime, isPlaying, nextKey, excludedKeys, beatCount, keyFrequencies]);

    const handleExcludeKey = () => {
        if (currentKey && !excludedKeys.includes(currentKey)) {
            setExcludedKeys((prev) => [...prev, currentKey]);
        }
    };
    console.log([beatCount, frequency, leadtime])
    return (
        <div style={{display: "flex", flexDirection: "column", position: "relative"}}>
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
                }}
            >
                {/* Left Column: Controls */}
                <Card style={{flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
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
                                onValueChange={(value) => setBpm(value[0])}
                            />
                            <span>{bpm}</span>
                        </div>

                    </CardContent>
                    <div style={{display: "flex", justifyContent: "center", gap: "1rem", padding: "1rem"}}>
                        <Button onClick={(evt) => {
                            console.log(evt);
                            setIsPlaying((prev) => !prev);
                            setBeatCount(0);
                        }}>
                            {isPlaying ? "Stop" : "Start"}
                        </Button>
                    </div>
                </Card>

                {/* Right Column: Panels */}
                <Card
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <CardContent style={{display: "flex", flexDirection: "column", width: "100%"}}>
                        <div className="font-bold lg:inline-block" style={{textAlign: "left", marginBottom: "1.5rem"}}>
                            <span style={{color: "var(--color-primary)"}}>k</span>ey
                        </div>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1px",
                            borderBottom: "1px solid var(--border)"
                        }}>
                            {/* Current Key Cell */}
                            <div style={{textAlign: "center", padding: "1rem", borderRight: "1px solid var(--border)"}}>
                                <div style={{fontSize: "0.8rem", fontWeight: "bold", marginBottom: "0.5rem"}}>Current
                                </div>
                                <div style={{fontSize: "2rem", fontWeight: "bold"}}>{currentKey || "_"}</div>
                            </div>
                            {/* Next Key Cell */}
                            <div style={{textAlign: "center", padding: "1rem"}}>
                                <div style={{fontSize: "0.8rem", fontWeight: "bold", marginBottom: "0.5rem"}}>Next</div>
                                <div style={{fontSize: "2rem", fontWeight: "bold"}}>{nextKey || "?"}</div>
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "0.5rem",
                            margin: "1rem auto",
                            flexWrap: "wrap"
                        }}>
                            {Array.from({length: frequency}, (_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        backgroundColor: ((beatCount + (frequency - leadtime)) % frequency === i) ? "var(--color-primary)" : "var(--muted)",
                                        transition: "background-color 0.2s ease",
                                    }}
                                />
                            ))}
                        </div>
                        <div style={{
                            display: "flex",
                            gap: "1rem",
                            flexDirection: "row",
                            justifyContent: "space-around"
                        }}>
                            <div>
                                <Label htmlFor="frequency" style={{marginBottom: "0.5rem"}}>Frequency</Label>
                                <Input
                                    id="frequency"
                                    type="number"
                                    min={1}
                                    defaultValue={8}
                                    value={frequency}
                                    onChange={(e) => setFrequency(Number(e.target.value))}
                                    style={{maxWidth: "70px"}}
                                />
                            </div>
                            <div>
                                <Label htmlFor="leadtime" style={{marginBottom: "0.5rem"}}>Lead Time</Label>
                                <Input
                                    id="leadtime"
                                    type="number"
                                    min={1}
                                    max={frequency}
                                    value={leadtime}
                                    onChange={(e) => setLeadtime(Number(e.target.value))}
                                    style={{maxWidth: "70px"}}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div style={{position: "absolute", top: 20, right: 20, marginTop: "1rem"}}>
                <div>{excludedKeys.length > 0 ? excludedKeys.join(", ") : '\u2205'}</div>
            </div>
        </div>
    );
}

export default App;