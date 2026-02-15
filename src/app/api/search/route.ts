import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query is required', movies: [] });
  }

  try {
    const searchUrl = `https://egydead.rip/search/${encodeURIComponent(query)}/`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(searchUrl, {
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
      return NextResponse.json({ error: 'Failed to fetch', movies: [] });
    }

    const html = await response.text();
    const movies = parseSearchResults(html);

    return NextResponse.json({ movies });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json({ 
      error: error.message || 'Search failed', 
      movies: [] 
    });
  }
}

function parseSearchResults(html: string) {
  const movies: any[] = [];

  // Split by movieItem class (correct pattern from the site)
  const parts = html.split('<li class="movieItem">');

  for (let i = 1; i < parts.length && i <= 50; i++) {
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

      // Extract year from title
      const yearMatch = title.match(/\b(19\d{2}|20\d{2})\b/);
      const year = yearMatch ? yearMatch[1] : '';

      // Extract quality label
      const qualityMatch = part.match(/class="label"[^>]*>([^<]+)<\/span>/);
      const quality = qualityMatch ? qualityMatch[1].trim() : '';

      if (title && link) {
        movies.push({
          title,
          link: link.startsWith('http') ? link : `https://egydead.rip${link}`,
          image: image || '',
          type,
          year,
          quality,
          category,
        });
      }
    } catch (e) {
      // Skip this item on error
    }
  }

  return movies;
}
