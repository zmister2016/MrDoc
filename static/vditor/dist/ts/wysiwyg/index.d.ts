/// <reference types="./types" />
declare class WYSIWYG {
    element: HTMLPreElement;
    popover: HTMLDivElement;
    afterRenderTimeoutId: number;
    hlToolbarTimeoutId: number;
    preventInput: boolean;
    composingLock: boolean;
    constructor(vditor: IVditor);
    private copy;
    private bindEvent;
}
export { WYSIWYG };
