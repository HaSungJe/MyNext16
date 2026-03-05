import type { Metadata, Viewport } from 'next';
import '@style/css/import.css';
import '@style/css/popup.css';
import '@style/css/swiper/swiper.css';
import '@style/css/swiper/swiper-bundle.css';
import '@style/css/swiper-custom.css';
import RootLayoutContent from './RootLayoutContent';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL),
    title: process.env.NEXT_PUBLIC_SERVER_NAME,
    description: process.env.NEXT_PUBLIC_SERVER_NAME,
    icons: {
        icon: '/favicon.ico',
    },
    openGraph: {
        type: 'website',
        title: process.env.NEXT_PUBLIC_SERVER_NAME,
        description: process.env.NEXT_PUBLIC_SERVER_NAME,
        images: [
            {
                url: '/og.jpg',
                width: 512,
                height: 269,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/og.jpg'],
    },
    other: {
        'google-adsense-account': process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body>
                <RootLayoutContent>
                    {children} 
                </RootLayoutContent>
            </body>
        </html>
    )
}