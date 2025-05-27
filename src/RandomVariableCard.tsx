import React, {useEffect, useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import type {RandomVariableCardData} from "./types";
import {CardActions, Checkbox, Collapse, IconButton, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Delete from '@mui/icons-material/Delete';

type RandomVariableCardProps = {
    key: number;
    card: RandomVariableCardData;
    beatCount: number;
    updateCard: (updateFn: (card: RandomVariableCardData) => RandomVariableCardData) => void;
};

export function RandomVariableCard({key, card, beatCount, updateCard}: RandomVariableCardProps) {


    const getNext = ({items, excludedItems}: RandomVariableCardData) => {
        const availableTones = items.filter((tone) => !excludedItems.includes(tone));
        const t = availableTones[Math.floor(Math.random() * availableTones.length)] || "?";
        return t;
    }

    const [open, setOpen] = useState(false);

    const handleToggleExclude = (item: string) => {

        updateCard(({ excludedItems, ...rest }) => {
            const excluded = excludedItems.includes(item)
                ? excludedItems.filter(i => i !== item)
                : [...excludedItems, item];
            return { ...rest, excludedItems: excluded };
        });
    };

    const handleDeleteItem = (item: string) => {
        updateCard((c) => ({
            ...c,
            items: c.items.filter(i => i !== item),
            excludedItems: c.excludedItems.filter(i => i !== item)
        }));
    };

    useEffect(() => {

        const {frequency, leadtime, items } = card;
        if (items.length === 0) return;

        /* The {leadtime} is the number of beats ahead of a change occurring that the
        * user is notified what that change will be.  When the metronome starts,
        * the user is notified of what they will be doing when they start, {leadtime}
        * beats ahead.  The user does not start the activity at all until it reaches that number.
        * Then the current key changes every {frequency} beats.  */
        if ((beatCount % frequency) === leadtime) {
            updateCard(({
                            nextItem,
                            ...o
                        }) => ({
                ...o,
                nextItem: '...',
                currentItem: nextItem
            }));

        } else if ((beatCount % frequency) === 0) {
            updateCard((c) => ({
                ...c,
                nextItem: getNext(card)
            }));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [beatCount]);

    return (
        <Card key={key} style={{ position: "relative", width: 600, minHeight: 425, margin: "1rem" }}>
            <CardContent style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
                <Input value={card.name} onChange={({target: {value}}) => {
                    updateCard(c => ({...c, name: value}))
                }} className="font-bold" style={{border: "none", outline: "none"}}/>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1px",
                    borderBottom: "1px solid var(--border)"
                }}>
                    <div style={{textAlign: "center", padding: "1rem", borderRight: "1px solid var(--border)"}}>
                        <div style={{fontSize: "0.8rem", fontWeight: "bold", marginBottom: "0.5rem"}}>Current</div>
                        <div style={{fontSize: "2rem", fontWeight: "bold"}}>{card.currentItem || "_"}</div>
                    </div>
                    <div style={{textAlign: "center", padding: "1rem"}}>
                        <div style={{fontSize: "0.8rem", fontWeight: "bold", marginBottom: "0.5rem"}}>Next</div>
                        <div style={{fontSize: "2rem", fontWeight: "bold"}}>{card.nextItem || "?"}</div>
                    </div>
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "0.5rem",
                    margin: "1rem auto",
                    flexWrap: "wrap"
                }}>
                    {Array.from({length: card.frequency}, (_, i) => (
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
                            onChange={({target: {value}}) => {

                                updateCard((c) => ({...c, frequency: parseInt(value)}));
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
                            onChange={({target: {value}}) => {
                                updateCard(c => ({...c, leadtime: parseInt(value)}))
                            }}
                            style={{maxWidth: "70px"}}
                        />
                    </div>
                </div>
            </CardContent>
            <CardActions style={{justifyContent: "flex-end", zIndex: 3, position: "absolute", bottom: 0, right: -3}}>
                <IconButton
                    onClick={() => { setOpen(o => !o); }}
                >
                    {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
            </CardActions>
            <Collapse in={open} timeout="auto" unmountOnExit>

                    <List style={{marginBottom: 30}}>
                        {card.items.map(item => (
                            <ListItem key={item} dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={card.excludedItems.includes(item)}
                                        onChange={() => { handleToggleExclude(item); }}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item}
                                    style={{
                                        textDecoration: card.excludedItems.includes(item) ? "line-through" : "none",
                                        color: card.excludedItems.includes(item) ? "#888" : undefined
                                    }}
                                />
                                <IconButton edge="end" onClick={() => { handleDeleteItem(item); }}>
                                    <Delete/>
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
            </Collapse>
        </Card>
    );
}
