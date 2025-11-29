import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [currentTrack, setCurrentTrack] = useState({
    title: 'Радио ЧТД',
    artist: 'Загрузка...',
    cover: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop'
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  const streamUrl = 'http://176.108.192.17:8000/stream';
  const statusUrl = 'http://176.108.192.17:8000/status-json.xsl';

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(statusUrl);
        const data = await response.json();
        
        if (data?.icestats?.source) {
          const source = Array.isArray(data.icestats.source) 
            ? data.icestats.source[0] 
            : data.icestats.source;
          
          if (source?.title) {
            const parts = source.title.split(' - ');
            setCurrentTrack({
              title: parts.length > 1 ? parts[1] : source.title,
              artist: parts.length > 1 ? parts[0] : 'В эфире',
              cover: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop'
            });
          }
        }
      } catch (error) {
        console.log('Не удалось загрузить метаданные:', error);
        setCurrentTrack(prev => ({ ...prev, artist: 'В эфире' }));
      }
    };

    fetchMetadata();
    const interval = setInterval(fetchMetadata, 10000);

    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const podcasts = [
    { id: 1, title: 'Утренний эфир', date: '29.11.2024', duration: '45 мин', cover: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop' },
    { id: 2, title: 'Музыкальные истории', date: '28.11.2024', duration: '52 мин', cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop' },
    { id: 3, title: 'Вечерний разговор', date: '27.11.2024', duration: '38 мин', cover: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop' },
    { id: 4, title: 'Специальный гость', date: '26.11.2024', duration: '61 мин', cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop' }
  ];

  const archive = [
    { id: 1, title: 'Архив эфиров - Ноябрь 2024', episodes: 28 },
    { id: 2, title: 'Архив эфиров - Октябрь 2024', episodes: 31 },
    { id: 3, title: 'Архив эфиров - Сентябрь 2024', episodes: 30 }
  ];

  const news = [
    { id: 1, title: 'Новый ведущий в эфире', date: '28.11.2024', text: 'С понедельника утренний эфир будет вести новый ведущий Максим Петров' },
    { id: 2, title: 'Конкурс для слушателей', date: '25.11.2024', text: 'Участвуйте в нашем конкурсе и выигрывайте призы каждую неделю' },
    { id: 3, title: 'Обновление студии', date: '20.11.2024', text: 'Мы обновили студийное оборудование для лучшего качества звука' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Radio" size={32} className="text-foreground" />
              <h1 className="text-3xl font-bold text-foreground">Медиа-группа ЧТД</h1>
            </div>
            <Badge variant="secondary" className="text-sm">
              <span className="animate-pulse mr-2">●</span>
              В эфире
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8 bg-gradient-to-br from-primary/20 to-accent/20 border-none shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-48 h-48 rounded-lg overflow-hidden shadow-xl flex-shrink-0">
                <img 
                  src={currentTrack.cover} 
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 w-full">
                <h2 className="text-3xl font-bold mb-2 text-foreground">{currentTrack.title}</h2>
                <p className="text-lg text-muted-foreground mb-6">{currentTrack.artist}</p>
                
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    onClick={togglePlay}
                    size="lg"
                    className="rounded-full w-16 h-16 p-0"
                  >
                    <Icon name={isPlaying ? 'Pause' : 'Play'} size={28} />
                  </Button>
                  
                  <div className="flex items-center gap-3 flex-1 max-w-xs">
                    <Icon name="Volume2" size={20} className="text-muted-foreground" />
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-10">{volume[0]}%</span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Прямой эфир • 176.108.192.17:8000</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="podcasts" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="podcasts" className="text-base">
              <Icon name="Headphones" size={18} className="mr-2" />
              Подкасты
            </TabsTrigger>
            <TabsTrigger value="archive" className="text-base">
              <Icon name="Archive" size={18} className="mr-2" />
              Архив
            </TabsTrigger>
            <TabsTrigger value="news" className="text-base">
              <Icon name="Newspaper" size={18} className="mr-2" />
              Новости
            </TabsTrigger>
          </TabsList>

          <TabsContent value="podcasts" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {podcasts.map((podcast) => (
                <Card key={podcast.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={podcast.cover} 
                      alt={podcast.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{podcast.title}</CardTitle>
                    <CardDescription className="flex items-center justify-between">
                      <span>{podcast.date}</span>
                      <Badge variant="outline">{podcast.duration}</Badge>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="archive" className="animate-fade-in">
            <div className="grid gap-4">
              {archive.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Icon name="FolderOpen" size={24} />
                        </div>
                        <div>
                          <CardTitle>{item.title}</CardTitle>
                          <CardDescription>{item.episodes} эпизодов</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Icon name="ChevronRight" size={24} />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="news" className="animate-fade-in">
            <div className="grid gap-6">
              {news.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="mb-2">{item.title}</CardTitle>
                        <CardDescription className="mb-4">{item.date}</CardDescription>
                        <p className="text-foreground">{item.text}</p>
                      </div>
                      <Icon name="Megaphone" size={24} className="text-primary ml-4" />
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2024 Медиа-группа ЧТД. Все права защищены.</p>
        </div>
      </footer>

      <audio ref={audioRef} src={streamUrl} preload="none" />
    </div>
  );
};

export default Index;