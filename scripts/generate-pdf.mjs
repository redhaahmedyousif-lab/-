// يولّد نسخة PDF من الوثيقة (بإعدادات الطباعة نفسها) داخل dist/ بعد البناء،
// ليتمكن مستخدمو الهاتف من تحميلها مباشرة.
// الاستخدام: npm run build && npm run pdf
// لمتصفح Chromium مثبت مسبقاً: PDF_CHROMIUM_PATH=/path/to/chromium npm run pdf
import { preview } from 'vite';
import { chromium } from 'playwright';

const OUTPUT = 'dist/planetary-survival-document.pdf';

const server = await preview({ preview: { port: 4321, strictPort: true }, logLevel: 'warn' });
const browser = await chromium.launch({ executablePath: process.env.PDF_CHROMIUM_PATH || undefined });

try {
  const page = await browser.newPage();
  await page.goto(server.resolvedUrls.local[0], { waitUntil: 'networkidle' });
  // eslint-disable-next-line no-undef -- تعمل داخل صفحة المتصفح حيث document معرّف
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: OUTPUT, preferCSSPageSize: true, printBackground: true });
  console.log(`PDF written to ${OUTPUT}`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
