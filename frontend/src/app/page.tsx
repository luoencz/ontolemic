import StarryBackground from '@/components/starry-background';
import IntroAnimation from '@/components/intro-animation';

export default function Home() {
  return (
    <>
      <StarryBackground />
      <IntroAnimation />
      
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col items-center justify-center gap-2">
            <h1>Inner Cosmos</h1>
          <h3>Theo Ryzhenkov</h3>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <h3>
            You Are Here
          </h3>
        </div>
      </main>
    </>
  );
}
