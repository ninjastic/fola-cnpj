import axios from 'axios';
import { load } from 'cheerio';

export const gerarLinkEmpresa = (empresa: any) => {
    return `http://cnpj.info/${empresa.nome.replaceAll(' ', '-')}-${empresa.fantasia.replaceAll(' ', '-')}`
        .replaceAll('LTDA', '').replaceAll('&', '').replaceAll('--', '-');
};

export const procurarEmpresas = async (nome: string) => {
    const response = await axios.post(`http://cnpj.info/${nome.replaceAll(' ', '-')}`);
    const $ = load(response.data);

    const empresas = $('li');

    const parsed = [...empresas].map(el => {
        const cnpj = $(el).children('a:first-child').text();
        const nome = $($(el).find('a')[1]).text();
        const fantasia = $($(el).find('a')[2]).text();
        const locMatch = $(el).html()?.match(/Localiza..o: (.*)/i);

        return { cnpj, nome, fantasia, loc: locMatch ? locMatch[1] : null }
    });

    return parsed;
};

export const checarEmpresa = async (empresa: any) => {
    const response = await axios.get(gerarLinkEmpresa(empresa));
    const $ = load(response.data);

    const numeros = [...$('a')].filter(el => {
        return $(el).attr('href')?.match(/tel:[0-9]{11}/);
    }).map(el => $(el).text());

    const socios = [...$('table tbody tr')].filter(el => {
        return $(el).find('td').html()?.match('CPF');
    }).map(el => $($(el).children('td')[1]).text());

    return { numeros, socios };
}



