import DashChart from '../components/DashChart';
import { KpiItem, type KpiItemType } from 'dataviz-components';
const ids = [
  'cm8zqd7w90001tfdxnt74uyuj',
  'cm2w17md9000113laexq0h432',
  'cm5pfx05x0001xaytcv70ai54',
  'cm6ywt8h80001a8a31jqg416r',
  'cm92staor00056c5hvwfpvubg',
];

const stats: KpiItemType[] = [
  { title: 'Risorse allocate', value: '2773 milioni ', value_prefix: '€ ' },
  { title: 'Risorse liquidate', value: '1468  milioni', value_prefix: '€ ' },
  { title: 'Enti registrati', value: 23736 },
  { title: 'Utenti registrati', value: 36881 },
  { title: 'Progetti attivi', value: 81063 },
  {
    title: 'Richieste risolte',
    value: 72377,
  },
];

function App() {
  return (
    <div>
      <div className='grid grid-cols-1 gap-4 m-6 ml-2 sm:grid-cols-2 lg:grid-cols-3'>
        {stats.map((item) => (
          <div
            className='flex items-center justify-center w-full  h-24 bg-base-300 text-content rounded-md  shadow-md'
            key={`stat-${item}`}
          >
            <div className='text-2xl '>
              <KpiItem data={item} />
            </div>
          </div>
        ))}
      </div>
      <div className='grid grid-cols-1 gap-4 m-6 ml-2 '>
        {[1].map((item) => (
          <div
            className='flex items-center justify-center w-full  h-94 bg-base-300 text-content rounded-md  shadow-md'
            key={`fullChart-${item}`}
          >
            <DashChart id={'cm92sqeed00036c5hqlqdm0xb'} />
          </div>
        ))}
      </div>
      <div className='grid grid-cols-1 gap-4 m-6 ml-2 lg:grid-cols-2'>
        {ids.map((id) => (
          <div
            className='flex ids-center justify-center w-full min-h-44 bg-base-300 text-content rounded-md  shadow-md'
            key={`Chart-${id}`}
          >
            <DashChart id={id} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
