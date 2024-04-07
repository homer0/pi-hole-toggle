import * as path from 'path';
import { CONFIG } from '../config';

export type RenderDocumentProps = {
  children: JSX.Element;
};

let stylesheet: string | null = null;
const currentDirectory = path.dirname(import.meta.path);
const stylesheetPath = path.join(currentDirectory, CONFIG.stylesheet);

const compressCss = (text: string): string =>
  text.replace(/\s+/g, ' ').replace(/\/\*.*?\*\//g, '');

export const renderDocument = async ({
  children,
}: RenderDocumentProps): Promise<JSX.Element> => {
  if (!stylesheet) {
    const file = Bun.file(stylesheetPath);
    const contents = await file.text();
    stylesheet = CONFIG.compressCSS ? compressCss(contents) : contents;
  }

  return (
    <html lang="en">
      <head>
        <title>{CONFIG.title}</title>
        {stylesheet && <style>{stylesheet}</style>}
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <main id="root" hx-get="/api/status" hx-trigger="every 5s">
          {children}
        </main>
        <script src="/public/vendor/htmx.js" />
      </body>
    </html>
  );
};
