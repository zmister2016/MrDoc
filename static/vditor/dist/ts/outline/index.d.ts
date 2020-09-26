/// <reference types="./types" />
export declare class Outline {
    element: HTMLElement;
    constructor(outlineLabel: string);
    render(vditor: IVditor): void;
    toggle(vditor: IVditor, show?: boolean): void;
}
