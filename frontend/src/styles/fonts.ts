import localFont from 'next/font/local';

export const neueHaasUnica = localFont({
  src: [
    {
      path: '../../public/fonts/neue-haas-unica/NeueHaasUnicaPro-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/neue-haas-unica/NeueHaasUnicaPro-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/neue-haas-unica/NeueHaasUnicaPro-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/neue-haas-unica/NeueHaasUnicaPro-MediumIt.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/neue-haas-unica/NeueHaasUnicaPro-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/neue-haas-unica/NeueHaasUnicaPro-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-neue-haas-unica',
  display: 'swap',
  preload: true,
});

export const warnockPro = localFont({
  src: [
    {
      path: '../../public/fonts/warnock-pro/WarnockPro-LightDisp.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/warnock-pro/WarnockPro-LightItDisp.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../public/fonts/warnock-pro/WarnockPro-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/warnock-pro/WarnockPro-LightIt.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/warnock-pro/WarnockPro-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/warnock-pro/WarnockPro-SemiboldIt.otf',
      weight: '600',
      style: 'italic',
    },
  ],
  variable: '--font-warnock-pro',
  display: 'swap',
  preload: true,
});

