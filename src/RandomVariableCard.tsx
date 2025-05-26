import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RandomVariableCardData } from "./types";

type RandomVariableCardProps = {
    card: RandomVariableCardData;
    beatCount: number;
    updateCard: (updateFn: (card: RandomVariableCardData) => RandomVariableCardData) => void;
};

export function RandomVariableCard({ card, beatCount, updateCard } : RandomVariableCardProps) {
    const getNext = ({items, excludedItems} : RandomVariableCardData)  => {
        const availableTones = items.filter((tone) => !excludedItems.includes(tone));
        const t = availableTones[Math.floor(Math.random() * availableTones.length)] || "?";
        console.log(`next random tone: ${t}`)
        return t;
    }
    useEffect(() => {
        const { frequency, leadtime, items, nextItem } = card;
        if (items.length === 0) return;
        const [bs, fs, ls] = [beatCount, frequency, leadtime].map(String);
        console.log(`(beatCount, frequency, leadTime) = (${bs}, ${fs}, ${ls})`)
        console.log(`${String((beatCount + frequency - leadtime) % frequency)}`)

        /* The {leadtime} is the number of beats ahead of a change occurring that the
        * user is notified what that change will be.  When the metronome starts,
        * the user is notified of what they will be doing when they start, {leadtime}
        * beats ahead.  The user does not start the activity at all until it reaches that number.
        * Then the current key changes every {frequency} beats.  */
        if ((beatCount % frequency) === leadtime){
            console.log("should be at beginning");
            updateCard(({
                nextItem,
                ...o
            }) => ({
                ...o,
                nextItem: '...',
                currentItem: nextItem
            }));

        } else if ((beatCount % frequency) === 0) {
            console.log(`Should be in middle: ${String(beatCount)} ${nextItem}`);
            updateCard((c) => ({
                ...c,
                nextItem: getNext(card)
            }));
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [beatCount]);

    return (
        <Card style={{ flex: 1, maxWidth: 300 }}>
            <CardContent style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Input value={card.name} onChange={({ target: { value }}) => {
                    updateCard(c => ({ ...c, name: value }))
                }} className="font-bold" style={{ border: "none", outline: "none" }} />
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1px",
                    borderBottom: "1px solid var(--border)"
                }}>
                    <div style={{ textAlign: "center", padding: "1rem", borderRight: "1px solid var(--border)" }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Current</div>
                        <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{card.currentItem || "_"}</div>
                    </div>
                    <div style={{ textAlign: "center", padding: "1rem" }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Next</div>
                        <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{card.nextItem || "?"}</div>
                    </div>
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "0.5rem",
                    margin: "1rem auto",
                    flexWrap: "wrap"
                }}>
                    {Array.from({ length: card.frequency }, (_, i) => (
                        <div
                            key={i}
                            style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                backgroundColor: ((beatCount + (card.frequency - card.leadtime)) % card.frequency === i) ? "var(--color-primary)" : "var(--muted)",
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
                            value={card.frequency}
                            onChange={({ target: { value } }) => {

                                updateCard((c) => ({ ...c, frequency: parseInt(value) }));
                            }}
                            style={{maxWidth: "70px"}}
                        />
                    </div>
                    <div>
                        <Label htmlFor="leadtime" style={{marginBottom: "0.5rem"}}>Lead Time</Label>
                        <Input
                            id="leadtime"
                            type="number"
                            min={1}
                            max={card.frequency}
                            value={card.leadtime}
                            onChange={({ target: { value } }) => {
                                updateCard(c => ({...c, leadtime: parseInt(value)}))
                            }}
                            style={{maxWidth: "70px"}}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
