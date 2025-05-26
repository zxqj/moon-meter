type RandomVariableCardData = {
    id: number;
    name: string;
    items: Array<string>;
    frequency: number;
    leadtime: number;
    excludedItems: string[];
    currentItem: string;
    nextItem: string;
    enabled: boolean;
};

export { type RandomVariableCardData };