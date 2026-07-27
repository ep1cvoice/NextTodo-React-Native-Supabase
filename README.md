# NextTodo Mobile (React Native)

> Klon aplikacji NextTodo w React Native (Expo) — jedna baza kodu na iOS, Androida i web.

Ten projekt to **port React Native** oryginalnej aplikacji webowej NextTodo:
👉 https://github.com/matt400/NextTodo

## Cel

Umożliwić korzystanie z aplikacji zarówno na komputerze, jak i na telefonie,
z jednej wspólnej bazy kodu (React Native + `react-native-web` przez Expo).

## Zmiany względem oryginału

| Oryginał (web)             | Ten projekt (mobile + web)          |
|----------------------------|-------------------------------------|
| React (Vite) + CSS Modules | Expo (React Native) + NativeWind    |
| react-router-dom           | Expo Router                         |
| Fastify + Prisma + SQLite  | Supabase (Postgres + Auth + RLS)    |
| JWT w cookie HTTP-only      | Supabase Auth (tokeny w SecureStore)|
| Logika Pomodoro na serwerze| Funkcje RPC w Postgres              |

## Stack

- **Framework:** Expo (React Native) + react-native-web
- **Routing:** Expo Router
- **Style:** NativeWind (Tailwind)
- **Backend:** Supabase — Postgres, Auth, Row Level Security, RPC
- **Ikony:** lucide-react-native
- **Dźwięk / timer:** expo-av
- **Drag & drop:** react-native-reanimated + gesture-handler
