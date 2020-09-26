/// <reference types="./types" />
declare class IR {
    element: HTMLPreElement;
    processTimeoutId: number;
    hlToolbarTimeoutId: number;
    composingLock: boolean;
    preventInput: boolean;
    constructor(vditor: IVditor);
    private copy;
    private bindEvent;
}
export { IR };
