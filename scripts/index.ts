/* eslint-disable @typescript-eslint/no-unused-vars */
import Papa from 'papaparse';
import Bun from 'bun';
import { D } from '@mobily/ts-belt';

export function parse(data) {
  return new Promise((resolve, reject) => {
    try {
      return Papa.parse(data, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function preprocess(file: string) {
  const data = (await getOpendataFile(file)) as [[]];
  if (data.length < 2) return;
  const keys = (data[0] as string[]).map((k) => k.toLowerCase());
  const json = data.slice(1).map((row) => {
    const pairs = keys.map((k, index) => {
      let value = row[index] || 0;
      if (!isNaN(value)) {
        value = Number(value);
      }
      return [k as string, value as number | string] as [
        string,
        number | string
      ];
    });
    const obj = D.fromPairs(pairs);
    return obj;
  });

  // console.log(json);
  return json as object[];
}

export async function getOpendataFile(fileName: string) {
  const pathname = `./data/${fileName}`;
  const data = await Bun.file(pathname).text();
  return parse(data);
}

export async function writeToFile(fileName: string, data: string) {
  const pathname = `./data/${fileName}`;
  const result = await Bun.write(pathname, data);
  return result;
}

export function toMatrixFormat(data: object[]) {
  const keys = Object.keys(data[0]!);
  const rest = data.slice(1).map((i) => Object.values(i));
  return [keys, ...rest];
}

async function createChart1(rawData) {
  const chart1: object[] = rawData.map((i: object) => {
    const obj = {};
    obj['totale'] = i['totale'];
    obj['cd_intervento'] = i['cd_intervento'];
    return obj;
  });

  const chart1Grouped = chart1.reduce((prev, obj) => {
    const acc = prev as object[];
    const str = obj['cd_intervento'] + '';
    const index = acc.findIndex((i) => i['cd_intervento'] === str);
    if (index > -1) {
      const value = prev[index]['totale'];
      obj['totale'] += value;
      acc.splice(index);
    }
    acc.push(obj);
    return acc;
  }, [] as object[]);

  const chart1Formatted = (chart1Grouped as [object]).map((item) => {
    const value = Math.round(item['totale']);
    return {
      ...item,
      ['totale']: value,
    };
  });

  const chart1Data = toMatrixFormat(chart1Formatted);
  await writeToFile('chart1.json', JSON.stringify(chart1Data, null, 2));
}

function getUniqValues(array, field) {
  const set = new Set(array.map((i) => i[field]));
  const values = [];
  for (const v of set) {
    values.push(v);
  }
  return values;
}

function getUniqFieldValues(array, field) {
  return Object.keys(
    array.reduce((obj, item) => {
      const tf = item[field];
      if (!obj[tf]) {
        obj[tf] = 1;
      }
      return obj;
    }, {})
  );
}

async function main() {
  const sampleFile = 'servizi_gestione_refined.csv';
  const rawData = await preprocess(sampleFile);
  // await writeToFile('rawData.json', JSON.stringify(rawData.slice(-5), null, 2));
  //
  const esiti = getUniqValues(rawData, 'esito_opf_netto');
  console.log(esiti);

  const misure = getUniqValues(rawData, 'cd_intervento');
  console.log(misure);

  const flussi = getUniqValues(rawData, 'tipologia_flusso');
  console.log(flussi);

  // await createChart1(rawData);
}

(async () => {
  const start = Date.now();
  await main();
  const elapsed = Math.ceil((Date.now() - start) / 60000);
  console.log('finished in', elapsed, 'secs');
})();
