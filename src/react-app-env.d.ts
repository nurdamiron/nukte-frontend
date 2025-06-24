/// <reference types="react-scripts" />

declare module 'react-dom/client' {
  import { ReactElement } from 'react';
  
  interface Root {
    render(children: ReactElement): void;
    unmount(): void;
  }
  
  export function createRoot(container: Element | Document | DocumentFragment | Comment): Root;
  export function hydrateRoot(container: Element | Document, initialChildren: ReactElement): Root;
}