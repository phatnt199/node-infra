interface IQueueCallback<ElementType> {
    onDataEnqueue?: (identifier: string, payload: ElementType) => void;
    onDataDequeue?: (identifier: string, payload: ElementType) => void;
    onTriggerRetry?: (identifier: string) => void;
}
export declare class QueueHelper<ElementType> {
    identifier: string;
    storage: Array<ElementType>;
    private onDataEnqueue?;
    private onDataDequeue?;
    constructor(opts: IQueueCallback<ElementType> & {
        identifier: string;
    });
    enqueue(value: ElementType): void;
    dequeue(): ElementType | undefined;
    getElementAt(position?: number): ElementType | undefined;
}
export declare class MultiQueueHelper<ElementType> {
    storage: Record<string, QueueHelper<ElementType>>;
    private onDataEnqueue?;
    private onDataDequeue?;
    constructor(opts: IQueueCallback<ElementType>);
    enqueue(identifier: string, value: ElementType): void;
    dequeue(identifier: string): ElementType | undefined;
    getElementAt(identifier: string, position?: number): ElementType | undefined;
    getCurrentData(identifier: string): ElementType | undefined;
    getQueue(identifier: string): QueueHelper<ElementType>;
    removeQueue(queue: string): void;
    mapData(): Record<string, QueueHelper<ElementType>>;
}
export {};
