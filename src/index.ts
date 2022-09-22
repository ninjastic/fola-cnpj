import {  checarEmpresa, gerarLinkEmpresa, gerarLinkBusca, procurarEmpresas } from './utils'
import { prompt } from 'enquirer';

(async () => {
    while (true) {
        const perguntas = await prompt({
            type: 'input',
            name: 'nome',
            message: 'Nome da empresa?'
        }) as { nome: string };

        const empresas = await procurarEmpresas(perguntas.nome);
        const resultados = await Promise.all(empresas.map(async empresa => ({
            ...empresa,
            ...await checarEmpresa(empresa),
            link: gerarLinkEmpresa(empresa)
        })));

        const resultadosFiltrados = resultados.filter(resultado => resultado.numeros.length && resultado.socios.length);
        const resultadosSemNumero = resultados.filter(resultado => !resultado.numeros.length);
        const resultadosSemSocios = resultados.filter(resultado => !resultado.socios.length);

        console.log('---');

        if (resultadosFiltrados.length) {
            console.log(resultadosFiltrados);
        }

        console.log('Link busca:', gerarLinkBusca(perguntas.nome))
        console.log('[X] Resultados sem número:', resultadosSemNumero.length);
        console.log('[X] Resultados sem sócios:', resultadosSemSocios.length);
        console.log('[OK] Resultados com NÚMERO e SÓCIOS:', resultadosFiltrados.length);

        console.log('---');
    }
})();