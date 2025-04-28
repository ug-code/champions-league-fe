# Şampiyonlar Ligi Simülasyonu - Frontend

Bu proje, Şampiyonlar Ligi simülasyonunun frontend kısmını içerir. Next.js ile geliştirilmiş modern bir web uygulamasıdır.

Demo link: https://champions-league-fe.vercel.app/


## 🚀 Kullanılan Teknolojiler

- **Next.js 14** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Stil ve tasarım
- **React Icons** - UI ikonları
- **React Hooks** - State yönetimi

## 📋 Özellikler

- Takım ekleme ve listeleme
- Fikstür oluşturma
- Haftalık ve tüm lig simülasyonu
- Lig tablosu
- Şampiyonluk tahminleri
- Modern ve responsive tasarım

## 🛠️ Kurulum

1. Projeyi klonlayın:
```bash
git clone [repo-url]
cd fe
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcıda açın:
```
http://localhost:3000
```

## 🔄 API Entegrasyonu

Frontend, Laravel backend API'si ile iletişim kurar. API endpoint'leri:

- `POST /api/teams` - Takım ekle
- `GET /api/teams` - Takımları listele
- `POST /api/fixtures` - Fikstür oluştur
- `POST /api/simulate-week` - Haftayı simüle et
- `POST /api/simulate-all` - Tüm ligi simüle et
- `GET /api/standings` - Lig tablosu ve tahminler
- `POST /api/reset` - Sıfırla

## 📁 Proje Yapısı

```
fe/
├── src/
│   ├── app/
│   │   └── page.tsx        # Ana sayfa
│   └── utils/
│       └── api.ts          # API bağlantıları
├── public/                 # Statik dosyalar
└── package.json           # Bağımlılıklar
```

## 🎨 UI Bileşenleri

- Takım ekleme formu
- Takım listesi
- Fikstür görüntüleme
- Simülasyon kontrolleri
- Lig tablosu
- Hafta sonuçları
- Şampiyonluk tahminleri

## 🔧 Geliştirme

1. API URL'yi `src/utils/api.ts` dosyasında güncelleyin:
```typescript
const API_URL = "http://127.0.0.1:8000/api";
```

2. Yeni özellikler eklemek için:
   - API endpoint'lerini `api.ts`'ye ekleyin
   - UI bileşenlerini `page.tsx`'de güncelleyin

## 📝 Notlar

- Tüm business logic Laravel backend'de
- Frontend sadece UI ve API entegrasyonu
- State yönetimi React Hooks ile
- Responsive tasarım Tailwind CSS ile

## 🤝 Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit'leyin (`git commit -m 'feat: Add amazing feature'`)
4. Push'layın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.
