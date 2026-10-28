import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/node_modules/**', '**/dist/**', '**/target/**', 'Valengard/**', 'apps/client/src-tauri/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    // O core é puro e determinístico (ADR-0009): sem acaso, relógio ou números decimais.
    files: ['packages/core/src/**/*.ts'],
    ignores: ['packages/core/src/inteiros.ts'],
    rules: {
      'no-restricted-properties': [
        'error',
        { object: 'Math', property: 'random', message: 'Use o RNG do estado (sortear).' },
        { object: 'Date', property: 'now', message: 'O core não lê o relógio; o tempo é o tick.' },
        { object: 'performance', property: 'now', message: 'O core não lê o relógio; o tempo é o tick.' },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'Date', message: 'O core não lê o relógio; o tempo é o tick.' },
        { name: 'crypto', message: 'A semente nasce no servidor e entra no estado.' },
      ],
      'no-restricted-syntax': [
        'error',
        { selector: 'Literal[raw=/^(\\d*\\.\\d|\\d+[eE])/]', message: 'Só inteiros no core (partes por 10.000).' },
        { selector: "BinaryExpression[operator='/']", message: 'Use div() de inteiros.ts (arredonda para baixo).' },
        { selector: "AssignmentExpression[operator='/=']", message: 'Use div() de inteiros.ts (arredonda para baixo).' },
        { selector: "BinaryExpression[operator='**']", message: 'Potência pode sair do inteiro; multiplique.' },
      ],
    },
  },
);
