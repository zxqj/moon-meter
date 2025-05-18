import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import "./App.css";

// Import the audio file
const metronomeSound = "/public/Perc_MetronomeQuartz_hi.wav";

const TONES = ["A", "B♭", "B", "C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭"];

function App() {
    const [bpm, setBpm] = useState(120);
    const [frequency, setFrequency] = useState(4);
    const [leadtime, setLeadtime] = useState(2);
    const [currentKey, setCurrentKey] = useState(null);
    const [nextKey, setNextKey] = useState(TONES[Math.floor(Math.random() * TONES.length)]);
    const [excludedKeys, setExcludedKeys] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [beatCount, setBeatCount] = useState(0);
    const [keyFrequencies, setKeyFrequencies] = useState(
        TONES.reduce((acc, tone) => ({ ...acc, [tone]: 0 }), {})
    );

    useEffect(() => {
        let interval = null;
        const audio = new Audio(metronomeSound); // Create an Audio object

        if (isPlaying) {
            interval = setInterval(() => {
                // Play the sound on every beat
                audio.currentTime = 0; // Reset the audio to the start
                audio.play();

                if (beatCount % frequency === 0) {
                    setNextKey((prev) => {
                        const availableTones = TONES.filter((tone) => !excludedKeys.includes(tone));
                        return availableTones[Math.floor(Math.random() * availableTones.length)] || "?";
                    });
                } else if (beatCount % frequency === leadtime) {
                    setCurrentKey((prev) => {
                        if (nextKey !== "?") {
                            setKeyFrequencies((freqs) => ({
                                ...freqs,
                                [nextKey]: freqs[nextKey] + 1,
                            }));
                        }
                        return nextKey;
                    });
                    setNextKey("?");
                }

                setBeatCount((val) => val + 1);
            }, (60 / bpm) * 1000);
        }

        return () => clearInterval(interval);
    }, [bpm, frequency, leadtime, isPlaying, nextKey, excludedKeys, beatCount, keyFrequencies]);

    const handleExcludeKey = () => {
        if (currentKey && !excludedKeys.includes(currentKey)) {
            setExcludedKeys((prev) => [...prev, currentKey]);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "start", padding: "0 2rem" }}>
                <div className="font-bold lg:inline-block">
                    <span style={{ color: "var(--neon-green)" }}>m</span>
                    <span style={{ color: "var(--neon-pink)" }}>o</span>
                    <span style={{ color: "var(--neon-blue)" }}>o</span>
                    <span style={{ color: "var(--neon-yellow)" }}>n</span>
                    <span style={{ color: "var(--neon-orange)" }}>-</span>
                    <span style={{ color: "var(--neon-green)" }}>m</span>
                    <span style={{ color: "var(--neon-pink)" }}>e</span>
                    <span style={{ color: "var(--neon-blue)" }}>t</span>
                    <span style={{ color: "var(--neon-yellow)" }}>e</span>
                    <span style={{ color: "var(--neon-orange)" }}>r</span>
                </div>
            </div>
            <div
                className="App"
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "2rem",
                    padding: "2rem",
                }}
            >
                {/* Left Column: Controls */}
                <Card style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <CardContent style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div>
                            <Label htmlFor="bpm" style={{ marginBottom: "0.5rem" }}>BPM</Label>
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
                        <div>
                            <Label htmlFor="frequency" style={{ marginBottom: "0.5rem" }}>Frequency</Label>
                            <Input
                                id="frequency"
                                type="number"
                                min="2"
                                value={frequency}
                                onChange={(e) => setFrequency(Number(e.target.value))}
                                style={{ maxWidth: "200px" }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="leadtime" style={{ marginBottom: "0.5rem" }}>Lead Time</Label>
                            <Select value={String(leadtime)} onValueChange={(value) => setLeadtime(Number(value))}>
                                <SelectTrigger id="leadtime" style={{ maxWidth: "200px" }}>
                                    Lead Time: {leadtime}
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: frequency }, (_, i) => i + 1).map((value) => (
                                        <SelectItem key={value} value={String(value)}>
                                            {value}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem", padding: "1rem" }}>
                        <Button onClick={() => setIsPlaying((prev) => !prev)}>
                            {isPlaying ? "Stop" : "Start"}
                        </Button>
                        <Button onClick={handleExcludeKey} disabled={!currentKey}>
                            Exclude Current Key
                        </Button>
                    </div>
                </Card>

                {/* Right Column: Panels */}
                <Card
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CardContent style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Label>Next Key</Label>
                            <span>{nextKey}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Label>Current Key</Label>
                            <span>{currentKey || "None"}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Label>Excluded Keys</Label>
                            <span>{excludedKeys.join(", ") || "None"}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Label>Current Beat</Label>
                            <span>{(beatCount % frequency) + 1}/{frequency}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default App;