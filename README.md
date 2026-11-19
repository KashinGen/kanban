# Kanban

Канбан-доска на **webpack + React + TypeScript** (тестовое задание).

## Демо

**[Открыть демо на Vercel](https://kanban-hqwl.vercel.app/)**

## Запуск

Требуется Node.js 18.18.0+ (см. `.nvmrc`).

```bash
npm install
npm run start   # дев-сервер на http://localhost:3000
npm run test    # unit-тесты (jest)
npm run build   # production-сборка в dist/
```

## Качество кода

```bash
npm run typecheck     # проверка типов (tsc)
npm run lint          # ESLint
npm run lint:fix      # ESLint с автоисправлением
npm run format        # Prettier
npm run format:check  # проверка форматирования
```

Git-хуки (husky) ставятся автоматически при `npm install`:

- **pre-commit** — `lint-staged`: ESLint и Prettier на изменённых файлах;
- **pre-push** — `typecheck`, `lint` и `test`.
