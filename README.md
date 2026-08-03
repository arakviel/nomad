# Nomad

Навчальний застосунок курсу **React Native** (щоденник подорожей, UI українською).

- **Репозиторій:** https://github.com/arakviel/nomad  
- **Курс / матеріали:** [kostyl.dev](https://kostyl.dev) → розділ React Native  
- **Стек:** Expo (SDK 54), Expo Router, TypeScript, StyleSheet + Flexbox  
- **Мова інтерфейсу:** українська  

## Запуск

```bash
git clone https://github.com/arakviel/nomad.git
cd nomad
npm install
```

### 1. Mock REST API (json-server)

У **окремому** терміналі (порт `3000`, host `0.0.0.0` — щоб емулятор / телефон дісталися до API):

```bash
npm run api
```

Без цього кроку список поїздок покаже помилку мережі з кнопкою «Повторити».

### 2. Expo

```bash
npx expo start
```

Відкрийте в **Expo Go** (той самий major SDK, що в `package.json`) або симуляторі.

| Середовище | baseURL до API |
| ---------- | -------------- |
| iOS Simulator | `http://localhost:3000` |
| Android Emulator | `http://10.0.2.2:3000` |
| Фізичний пристрій (Expo Go) | IP ПК з Metro (`hostUri`) |

## Історія комітів

Кожен коміт відповідає **одній статті** курсу. У тілі коміту: `Material: content/15.react-native/<стаття>.md`.

Дивіться `git log` паралельно з матеріалами на kostyl.dev.

## Ліцензія

Навчальний код для курсу kostyl.dev.
