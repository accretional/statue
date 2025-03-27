---
title: Hakkımızda
description: Bu, Statue SSG projesi hakkında bilgiler içerir
date: 2024-05-01
author: Statue Ekibi
---

# Statue SSG Hakkında

Statue SSG, Markdown içeriklerden hızlı ve kolay bir şekilde statik web siteleri oluşturmak için tasarlanmış bir araçtır. SvelteKit altyapısı üzerine kurulmuştur ve hem Markdown içerikleri hem de Svelte bileşenlerini destekler.

## Özellikler

- **Markdown Desteği**: İçeriklerinizi markdown formatında yazabilirsiniz
- **Klasör Yapısı**: İçeriklerinizi klasörler halinde organize edebilirsiniz
- **Svelte Entegrasyonu**: Markdown içeriklerin yanı sıra Svelte bileşenleriyle de sayfalar oluşturabilirsiniz
- **Otomatik Rota Oluşturma**: İçerik klasörlerinizdeki yapıyı otomatik olarak URL'lere dönüştürür
- **Hızlı Derleme**: SvelteKit'in hızlı derleme özellikleriyle saniyeler içinde sitenizi oluşturur

## Nasıl Kullanılır?

Statue SSG ile site oluşturmak için:

1. `content` klasörüne Markdown dosyalarınızı ekleyin
2. İsterseniz `src/routes` altında Svelte sayfaları oluşturun
3. `npm run build` komutuyla statik sitenizi derleyin
4. Oluşturulan `build` klasörünü herhangi bir statik sunucuya yükleyin

## Örnek Yapı

```
content/
  blog/
    post1.md
    post2.md
  docs/
    guide.md
  hakkimizda.md  <-- Bu dosya

src/routes/
  +page.svelte   <-- Ana sayfa
  iletisim/
    +page.svelte <-- İletişim sayfası
```

Bu yapıda, hem Markdown içerikler hem de Svelte sayfaları bir arada bulunabilir.

---

Statue SSG projesi açık kaynak kodludur ve MIT lisansı altında dağıtılmaktadır. 