import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch('https://egydead.rip/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'identity',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json({ movies: [] });
    }

    const html = await response.text();
    const movies = parseTrending(html);

    return NextResponse.json({ movies });
  } catch (error) {
    console.error('Trending error:', error);
    return NextResponse.json({ movies: [] });
  }
}

function parseTrending(html: string) {
  const movies: any[] = [];

  // Split by movieItem class
  const parts = html.split('<li class="movieItem">');

  for (let i = 1; i < parts.length && i <= 20; i++) {
    const part = parts[i];
    
    try {
      // Extract link and title from anchor
      const linkMatch = part.match(/href="([^"]+)"/);
      const link = linkMatch ? linkMatch[1] : '';

      const titleMatch = part.match(/title="([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : '';

      // Extract image
      const imgMatch = part.match(/src="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i);
      const image = imgMatch ? imgMatch[1] : '';

      // Extract category
      const catMatch = part.match(/<span class="cat_name">([^<]+)<\/span>/);
      const category = catMatch ? catMatch[1].trim() : '';

      // Determine type
      let type = 'فيلم';
      if (category.includes('مسلسل')) {
        type = 'مسلسل';
      } else if (category.includes('كرتون') || category.includes('انمي')) {
        type = 'كرتون';
      }

      // Extract year
      const yearMatch = title.match(/\b(19\d{2}|20\d{2})\b/);
      const year = yearMatch ? yearMatch[1] : '';

      if (title && link) {
        movies.push({
          title,
          link: link.startsWith('http') ? link : `https://egydead.rip${link}`,
          image,
          type,
          year,
          category,
        });
      }
    } catch (e) {
      // Skip
    }
  }

  return movies;
}
