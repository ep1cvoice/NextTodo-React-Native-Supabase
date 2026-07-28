# FlowTodo (React Native)

> Port NextTodo na React Native (Expo) + Supabase — jedna baza kodu na iOS, Androida i web.
> Osobna aplikacja: **FlowTodo** (brand Ocean Flow), inspirowana projektem NextTodo.

Oryginał webowy:
👉 https://github.com/matt400/NextTodo

## Cel

Umożliwić korzystanie z aplikacji zarówno na komputerze, jak i na telefonie,
z jednej wspólnej bazy kodu (React Native + `react-native-web` przez Expo).

## Brand

- Nazwa: **FlowTodo**
- Paleta: Ocean Flow (`#0d9488` teal) — tokeny w `constants/theme.ts`
- Layout auth jak w NextTodo; identyfikacja wizualna osobna

## Zmiany względem oryginału

| Oryginał (web)             | Ten projekt (mobile + web)          |
|----------------------------|-------------------------------------|
| React (Vite) + CSS Modules | Expo (React Native) + NativeWind    |
| react-router-dom           | Expo Router                         |
| Fastify + Prisma + SQLite  | Supabase (Postgres + Auth + RLS)    |
| JWT w cookie HTTP-only      | Supabase Auth (tokeny w SecureStore)|
| Logika Pomodoro na serwerze| Funkcje RPC w Postgres              |

## Stack

- **Framework:** Expo SDK 54 (React Native) + react-native-web
- **Routing:** Expo Router
- **Style:** NativeWind (Tailwind) — później
- **Backend:** Supabase — Postgres, Auth, Row Level Security, RPC — później
- **Ikony:** lucide-react-native — później
- **Dźwięk / timer:** expo-av — później
- **Drag & drop:** react-native-reanimated + gesture-handler — później

> **Uwaga iOS / Expo Go:** W App Store Expo Go jest obecnie na **SDK 54** (nowsze SDK czekają na akceptację Apple). Dlatego ten projekt celowo używa Expo SDK 54, żeby działał z Expo Go na iPhonie.

## Uruchomienie

Działa na **Windows**, **Linux** i **macOS**. Telefon: **Expo Go** (iOS / Android). Nie potrzebujesz Xcode ani Android Studio.

### Wymagania

- Node.js 18+ (`node -v`)
- npm
- Telefon i komputer w **tej samej sieci Wi‑Fi**

### 1. Instalacja (raz)

```bash
git clone <url-tego-repo>
cd NextTodo-React-Native-Supabase
npm install
```

### 2. Start serwera deweloperskiego

Używaj lokalnego Expo z projektu (SDK 54), **nie** gołego `npx expo` — to potrafi ściągnąć nowsze Expo 57 i zepsuć kompatybilność z Expo Go:

```bash
npm start -- -c
```

(`-c` czyści cache Metro — warto po zmianie SDK / po problemach)

W terminalu pojawi się QR kod oraz skróty:

| Klawisz | Co robi |
|---------|---------|
| `w` | otwiera wersję **web** w przeglądarce |
| `a` | próbuje otworzyć na Androidzie (emulator / podłączony telefon) |
| `r` | reload aplikacji |
| `Ctrl+C` | zatrzymuje serwer |

### 3. Telefon — Expo Go

#### iPhone (iOS)

1. Zainstaluj **Expo Go** z App Store (obecnie SDK **54.x** — to OK, projekt jest na 54).
2. Zeskanuj QR z terminala aparatem iPhone’a albo w Expo Go → Scan QR.
3. Aplikacja otworzy się w Expo Go.

#### Android

1. Zainstaluj **Expo Go** z Google Play.
2. Otwórz Expo Go → Scan QR code (albo zeskanuj QR z terminala).
3. Aplikacja otworzy się w Expo Go.

> **Tip Android:** w niektórych telefonach skaner systemowy nie otwiera od razu Expo Go — lepiej skanować **z poziomu aplikacji Expo Go**.

### 4. Web (komputer)

Przy działającym `npm start -- -c` naciśnij `w`, albo:

```bash
npm run web
```

Otworzy się w przeglądarce (np. `http://localhost:8081`).

### Problemy z połączeniem telefon ↔ komputer

Jeśli QR nie łączy się (firewall, inna sieć, VPN):

```bash
npm start -- -c --tunnel
```

Wolniejsze, ale działa przez tunel Expo (nie wymaga tej samej sieci lokalnej).

Na Windows czasem pomaga odblokowanie Node.js w firewallu przy pierwszym uruchomieniu.

### Ważne info !!!

- Trzymamy **Expo SDK 54**, bo Expo Go w App Store / Play Market na iOS jest aktualnie na 54 (nowsze SDK czekają na akceptację Apple).
- Nie aktualizujcie samodzielnie `expo` do 55/56/57 bez uzgodnienia — zepsuje to Expo Go na iPhonie.
