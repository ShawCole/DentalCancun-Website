import { Cormorant_Garamond, DM_Serif_Display, Manrope, PT_Sans_Narrow } from "next/font/google";

/* Site fonts, shared by the public layout and the page builder preview. */
export const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"] });
export const dmSerif = DM_Serif_Display({ variable: "--font-dmserif", subsets: ["latin"], weight: "400" });
export const ptNarrow = PT_Sans_Narrow({ variable: "--font-ptnarrow", subsets: ["latin"], weight: ["400", "700"] });
export const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], weight: ["400", "600", "700"] });
export const fontVars = `${cormorant.variable} ${dmSerif.variable} ${ptNarrow.variable} ${manrope.variable}`;
