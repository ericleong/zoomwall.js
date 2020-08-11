/**
 * Create a gallery with the provided HTMLElement.
 *
 * @param blocks contains the images that belong to the gallery
 * @param enableKeys enables keyboard navigation
 */
export declare function create(blocks: HTMLElement, enableKeys?: boolean): void;
/**
 * Enables keyboard support for a gallery.
 *
 * @param blocks the root element of the gallery.
 * @return the listener attached to each image of the gallery.
 */
export declare function keys(blocks: HTMLElement): (e: KeyboardEvent) => void;
