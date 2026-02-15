'use client';

import { useState, useEffect } from 'react';

interface Movie {
  title: string;
  link: string;
  image: string;
  type: string;
  year?: string;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [view, setView] = useState<'home' | 'search'>('home');
  const [error, setError] = useState<string | null>(null);

  const bgImages = [
    '/5805405903170244120_120.jpg',
    '/5805405903170244121_121.jpg',
    '/5805405903170244122_121.jpg',
    '/5805405903170244124_120.jpg',
    '/5805405903170244125_120.jpg',
    '/5805405903170244127_120.jpg',
    '/5805405903170244128_120.jpg',
    '/5805405903170244129_120.jpg',
    '/5805405903170244130_120.jpg',
  ];

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const res = await fetch('/api/trending');
      const data = await res.json();
      if (data.movies) {
        setTrending(data.movies);
      }
    } catch (err) {
      console.error('Failed to fetch trending:', err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setView('search');

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.movies && data.movies.length > 0) {
        setResults(data.movies);
      } else {
        setResults([]);
        setError('لم يتم العثور على نتائج');
      }
    } catch (err) {
      setError('حدث خطأ في البحث');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWatch = (movie: Movie) => {
    // Open in new tab
    window.open(movie.link, '_blank');
  };

  const goBack = () => {
    setResults([]);
    setQuery('');
    setView('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_70%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {view !== 'home' && (
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  رجوع
                </button>
              )}

              <h1 
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent cursor-pointer"
                onClick={() => { setView('home'); setResults([]); }}
              >
                Zidril
              </h1>

              <form onSubmit={handleSearch} className="flex-1 max-w-xl order-last md:order-none w-full md:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ابحث عن فيلم أو مسلسل..."
                    className="w-full px-6 py-3 rounded-full bg-white/10 border border-white/20 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-white placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Search Results View */}
          {view === 'search' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">نتائج البحث: {query} ({results.length} نتيجة)</h2>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-400"></div>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-400">{error}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {results.map((movie, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleWatch(movie)}
                      className="group cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
                    >
                      <div className="aspect-[2/3] relative">
                        <img
                          src={movie.image}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/5805405903170244120_120.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 text-xs rounded-full bg-purple-500/80 text-white">
                            {movie.type || 'فيلم'}
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500 text-sm font-semibold">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            مشاهدة
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-cyan-400 transition-colors">
                          {movie.title}
                        </h3>
                        {movie.year && (
                          <p className="text-xs text-gray-400 mt-1">{movie.year}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Home View */}
          {view === 'home' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div className="relative rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-cyan-900/90" />
                <div className="relative p-8 md:p-16 text-center">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    ابحث عن أفلامك المفضلة
                  </h2>
                  <p className="text-lg md:text-xl text-gray-300 mb-8">
                    اكتشف آلاف الأفلام والمسلسلات
                  </p>
                  <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                    <div className="relative">
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="ابحث عن فيلم أو مسلسل..."
                        className="w-full px-8 py-4 rounded-full bg-white/10 border border-white/20 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-white text-lg placeholder-gray-400"
                      />
                      <button
                        type="submit"
                        className="absolute left-2 top-1/2 -translate-y-1/2 px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all font-semibold"
                      >
                        بحث
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* User Images Gallery */}
              <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
                {bgImages.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden">
                    <img
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>

              {/* Trending Section */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">🔥 الأحدث</h3>
                {trending.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {trending.map((movie, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleWatch(movie)}
                        className="group cursor-pointer rounded-2xl overflow-hidden bg-white/5 hover:bg-white/10 transition-all hover:scale-105"
                      >
                        <div className="aspect-[2/3] relative">
                          <img
                            src={movie.image}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/5805405903170244120_120.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="p-2">
                          <h4 className="text-sm font-medium line-clamp-2">{movie.title}</h4>
                          {movie.type && (
                            <span className="text-xs text-purple-400">{movie.type}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-400 mx-auto"></div>
                    <p className="text-gray-400 mt-4">جاري تحميل المحتوى...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-6 text-center text-gray-400">
          <p>Zidril © 2025</p>
        </footer>
      </div>
    </div>
  );
}
