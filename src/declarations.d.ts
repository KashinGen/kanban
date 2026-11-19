declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
declare module '*.css';
declare module '*.svg' {
  const src: string;
  export default src;
}
declare module '*.svg?react' {
  import type { FC, SVGProps } from 'react';
  const Component: FC<SVGProps<SVGSVGElement>>;
  export default Component;
}
declare module '*.webp' {
  const src: string;
  export default src;
}
