/// <reference types="typescript" />

declare namespace zoomwall {
    function create(blocks: HTMLElement, enableKeys: boolean): void;
    function keys(blocks: HTMLElement): (e: KeyboardEvent) => void;
}