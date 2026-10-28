import { criarServidor } from './servidor.ts';

const porta = Number(process.env.PORTA ?? 2567);

await criarServidor().listen(porta);
console.log(`Valengard: servidor ouvindo em ws://localhost:${porta}`);
