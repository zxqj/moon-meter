import React, { useRef, useState } from "react";

export function DraggableBox() {
    const boxRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ x: 100, y: 100 });
    const [dragging, setDragging] = useState(false);
    const offset = useRef({ x: 0, y: 0 });

    const onMouseDown = (e: React.MouseEvent) => {
        setDragging(true);
        offset.current = {
            x: e.clientX - pos.x,
            y: e.clientY - pos.y,
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
        if (dragging) {
            setPos({
                x: e.clientX - offset.current.x,
                y: e.clientY - offset.current.y,
            });
        }
    };

    const onMouseUp = () => {
        setDragging(false);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    };

    return (
        <div
            ref={boxRef}
            onMouseDown={onMouseDown}
            style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                width: 100,
                height: 100,
                background: "lightblue",
                cursor: "move",
                userSelect: "none",
            }}
        >
            Drag me!
        </div>
    );
}