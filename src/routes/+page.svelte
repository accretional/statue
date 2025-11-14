<script>
  const features = [
    'Markdown tabanlı içerik → oyun hikâyeni dosyalardan besle',
    'SvelteKit + Tailwind → piksel hassasiyetiyle arayüz',
    'Statik çıktı → oyunu herkese anında sun'
  ];
</script>

<svelte:head>
  <title>Statue Arcade • Run Beyond Bolt</title>
  <meta name="description" content="Statue SSG ile HTML5 oyunlar üret. Run Beyond Bolt yarışını dene." />
</svelte:head>

<main class="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 py-16">
  <section class="max-w-3xl w-full bg-slate-900/60 border border-white/10 rounded-3xl shadow-[0_20px_80px_rgba(15,23,42,0.8)] p-10 backdrop-blur">
    <p class="text-sm uppercase tracking-[0.35em] text-emerald-300 mb-3">Statue Arcade Preview</p>
    <h1 class="text-4xl sm:text-5xl font-semibold leading-tight mb-6">Run Beyond Bolt</h1>
    <p class="text-lg text-slate-200 mb-8">
      Statue’yi sadece dökümanlar için değil, ufak HTML5 deneyimleri için de kullanmak istiyoruz.
      Run Beyond Bolt, Statue ile derlenmiş mini yarış oyunumuz: sen bizsin, rakibin Usain Bolt.
      Tek yapman gereken <span class="text-emerald-300 font-semibold">←</span> ve
      <span class="text-emerald-300 font-semibold">→</span> tuşlarına ritmik şekilde basarak çizgi film
      stick figürünü finişe taşımak.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 mb-10">
      <a href="/game" class="flex-1 text-center bg-emerald-400 text-slate-900 font-semibold py-3 rounded-full hover:bg-emerald-300 transition">
        Yeni Oyun
      </a>
      <a href="https://github.com/statue-ssg/statue" class="flex-1 text-center border border-white/30 py-3 rounded-full hover:border-white/70 transition" rel="noreferrer">
        Statue Projesi
      </a>
    </div>
    <div class="grid gap-4 sm:grid-cols-3">
      {#each features as feature}
        <div class="bg-slate-800/60 rounded-2xl p-4 text-sm text-slate-200 border border-white/5">
          {feature}
        </div>
      {/each}
    </div>
  </section>

  <section class="max-w-4xl w-full mt-16 text-center space-y-4 text-slate-300">
    <p class="font-semibold tracking-[0.2em] text-xs uppercase text-emerald-300">Nasıl Oynanır?</p>
    <p>Ok tuşlarına <span class="text-white font-semibold">sol-sağ-sol-sağ</span> ritminde bas, stick figürü tamamladığında
      Bolt’u geçebilirsin. Çok yavaşlarsan Bolt ufuk çizgisinden önüne geçer.</p>
    <p class="text-sm text-slate-400">Statue ile yarattığın her yeni rotaya farklı mini oyunlar, kampanya sayfaları veya hikâye bölümleri ekleyebilirsin.</p>
  </section>
</main>