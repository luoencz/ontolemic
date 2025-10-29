import Page from "@/components/layout/page";

export default function Home() {
  return (
    <Page>
      <div className="flex flex-col gap-16">
        <div className="relative flex flex-col p-25 items-center" style={{ backgroundImage: "url('/images/svgs/analemma.svg')", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
          <h1>Ontolemic</h1>
          <p>"Pertaining to assumptions about being"</p>
        </div>
        <p className="text-justify">
          Hello, friend. I'm Theo, aka Luoencz. I like to think of myself as a
          cartographer, examining reality through informative lenses
          available to me, and aiming to grow towards awareness.
          This journey has led me into all sorts of territories,
          starting with theatre and modern dance and just continuing with
          alignment research and rationality. Ontolemic is my travel journal,
          featuring scribbles, descriptions of my discoveries, and
          guesses about realms yet uncharted. Come aboard.
        </p>
      </div>
    </Page>
  );
}
