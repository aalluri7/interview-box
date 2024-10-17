import React from 'react';
import css from './app.module.css';
import {
  createBrowserRouter,
  RouterProvider,
  Link,
} from "react-router-dom";
import ErrorPage from "./error-page"

/*
Each country should have
- Its name
- Its flag (display the icon in smaller size)
- Population
- Region
- Capital
- "View More" button to display the additional details of the country

## A widget to display the additional details of the country as below
- Its flag (should display larger image while viewing the details)
- Population
- Region
- Capital
- Native Name
- Currencies used
- Languages
- Border countries

*/
type ContryType = {
  borders: string[],
  languages: Record<string, string>,
  currencies: Record<string,
    { name: string, symbol: string }>,
  name: { common: string, official: string, nativeName: Record<string, { common: string, official: string }> },
  flag: string, population: number, region: string, capital: string[]
};

export const ContryRow = ({ c }: { c: ContryType }) => {

  const [more, setMore] = React.useState(false);

  const onClick = React.useCallback(() => {
    setMore(!more);
  }, [more])

  let currencies = ''
  if (c.currencies) {
    currencies = Object.keys(c.currencies)[0];
  }
  let languages = ''
  let langs = [];
  if (c.languages) {
    langs = Object.keys(c.languages);
    languages = langs.join(',');
  }
  let nativeName = ''
  if (c.name?.nativeName) {
    const nativeKey = Object.keys(c.name.nativeName)[0];
    if (nativeKey) {
      nativeName = c.name?.nativeName[nativeKey].common;

    }
  }
  let borders = ''
  if (c.borders) {
    borders = c.borders.join(",")
  }

  return <div className={css.row}>
    <div className={css.info}>
      <div className={more ? css.flag : ''}>{c.flag}</div>
      <div>name: {c.name.common}</div>
      <div>Population: {c.population}</div>
      <div>Region: {c.region}</div>
      <div>Capital: {c.capital?.join(',')}</div>
      {more && (<>
        <div>Native Name:{nativeName}</div>
        <div>Currencies: {currencies}</div>
        <div>Languages: {languages}</div>
        <div>borders: {borders}</div>
      </>)
      }
    </div>
    <button onClick={onClick} className={css.btn}> {more ? 'collapse' : 'View More'}</button>

  </div>;
}

const ContriesList = () => {
  const [contires, setData] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filtres, setFiltred] = React.useState<ContryType[]>([]);
  React.useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=borders,region,languages,currencies,name,flag,population,capital').then(response => {
      response.json().then(data => {
        setData(data);
        setFiltred(data);
      });
    })
  }, [])

  React.useEffect(() => {
    const filtred = contires.filter((c: ContryType) => {
      if (c.name.common.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) || searchTerm === '') {
        return true
      }
    })
    setFiltred(filtred);
  }, [searchTerm])

  const onChange = React.useCallback((e: any) => {
    const term = e.target.value;
    setSearchTerm(term);
  }, [searchTerm])
  return <div className={css.body}>
    Search Contry Name: <input onChange={onChange} value={searchTerm}></input>
    {filtres.map(c => {
      return <ContryRow key={c.name.common} c={c} />
    })}</div>
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <ContriesList />,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
