import dynamic from 'next/dynamic';
const Platform = dynamic(() => import('@/components/EnglishClassPlatform'), { ssr: false });

export default function Home() {
  return <Platform />;
}
