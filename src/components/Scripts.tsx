'use client';
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

export default function Scripts(): React.ReactNode {
    return (
        <>
            {/* Google Analytics */}
            {/* <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_ID} /> */}

            {/* 구글 애드센스 */}
            {/* {process.env.NODE_ENV === 'production' && (
                <Script
                    async
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
            )} */}
        </>
    );
}