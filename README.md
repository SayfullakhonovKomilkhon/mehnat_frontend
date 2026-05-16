# E-Kodeks — Frontend

O'zbekiston Respublikasi Mehnat kodeksi bo'yicha rasmiy veb-portal.  
Официальный веб-портал по Трудовому кодексу Республики Узбекистан.

**Сайт:** [e-kodeks.uz](https://e-kodeks.uz)  
**API:** [api.e-kodeks.uz](https://api.e-kodeks.uz)

---

## Стек технологий

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **next-intl** — интернационализация (UZ / RU)

---

## Запуск локально

### 1. Установить зависимости

```bash
npm install
```

### 2. Настроить переменные окружения

```bash
cp .env.example .env.local
```

Содержимое `.env.local`:

```
NEXT_PUBLIC_API_URL=https://api.e-kodeks.uz/api/v1
```

Для локальной разработки с локальным бэкендом:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 3. Запустить dev-сервер

```bash
npm run dev
```

Сайт откроется на [http://localhost:3000](http://localhost:3000)

---

## Сборка для продакшена

```bash
npm run build
npm run start
```

---

## Структура проекта

```
mehnat_frontend/
├── app/                    # Next.js App Router (страницы)
│   └── [locale]/           # Маршруты с локализацией
│       ├── page.tsx         # Главная страница
│       ├── sections/        # Разделы кодекса
│       ├── articles/        # Статьи кодекса
│       ├── search/          # Поиск
│       └── dashboard/       # Админ-панель
├── components/             # React-компоненты
│   ├── landing/            # Компоненты главной страницы
│   ├── articles/           # Компоненты статей
│   ├── search/             # Компоненты поиска
│   └── ui/                 # Базовые UI-компоненты
├── lib/
│   ├── api.ts              # Клиент для API
│   └── translit.ts         # Транслитерация Latin → Кириллица
├── messages/               # Файлы переводов
│   ├── uz.json             # Узбекский
│   └── ru.json             # Русский
└── types/                  # TypeScript типы
```

---

## Локализация

Сайт поддерживает 2 языка: **UZ** и **RU**.

Файлы переводов находятся в `messages/`:

- `uz.json` — узбекский
- `ru.json` — русский

---

## API

Все запросы идут на `NEXT_PUBLIC_API_URL`.  
Документация API: [api.e-kodeks.uz/docs](https://api.e-kodeks.uz/docs)
