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
  name: { common: string, official: string, nativeName: Record<string, { common: string, official: string }> },
  flag: string, population: number, region: string, capital: string[]
};

type ExtrDataType = {
  borders: string[] | [],
  languages?: Record<string, string>,
  currencies: Record<string,
    { name: string, symbol: string }>,
  name: { common: string, official: string, nativeName: Record<string, { common: string, official: string }> },
}

export const ContryRow = ({ c }: { c: ContryType }) => {
  const [more, setMore] = React.useState(false);
  const [extraData, setExtraData] = React.useState<ExtrDataType>()
  const onClick = React.useCallback(() => {
    setMore(!more);
    if (!more) {

      fetch(`https://restcountries.com/v3.1/name/${c.name.common}?fields=currencies,languages,borders,name`).then(Response => {
        Response.json().then(data => {
          console.log({ data })
          const extra = data.find((country: ExtrDataType) => country.name.official === c.name.official);
          if (extra) {
            setExtraData(extra);
          }
        })
      }).catch(error => {
        console.error(error);
      })
    }
  }, [more])

  // const onUpdate =() =>{
  //   fetch(`https://restcountries.com/v3.1/{}`,{
  //     method:'POST',
  //     body:{

  //     }
  //   })
  // }


  let currencies = ''
  if (extraData?.currencies) {
    currencies = Object.keys(extraData.currencies)[0];
  }
  let languages = ''
  let langs = [];
  if (extraData?.languages) {
    langs = Object.keys(extraData.languages);
    languages = langs.join(',');
  }
  let nativeName = ''
  if (extraData?.name?.nativeName) {
    const nativeKey = Object.keys(extraData.name.nativeName)[0];
    if (nativeKey) {
      nativeName = extraData.name?.nativeName[nativeKey].common;
    }
  }
  let borders = ''
  if (extraData?.borders) {
    borders = extraData.borders.join(",")
  }

  return <div className={css.row}>
    <div className={css.info}>
      <div className={more ? css.flag : ''}>{c.flag}</div>
      <div>Name: {c.name.common}</div>
      <div>Population: {c.population}</div>
      <div>Region: {c.region}</div>
      <div>Capital: {c.capital?.join(',')}</div>
      {more && (<>
        <div>Native Name:{nativeName}</div>
        <div>Currencies: {currencies}</div>
        <div>Languages: {languages}</div>
        <div>Borders: {borders}</div>
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
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMsg] = React.useState('');


  React.useEffect(() => {

    fetch('https://restcountries.com/v3.1/all?fields=region,name,flag,population,capital').then(response => {
      response.json().then(data => {
        setData(data);
        setFiltred(data);
        setLoading(false)
      });
    }).catch(e => {
      setError(true)
      setErrorMsg(e.message);
    })
  }, [])

  React.useEffect(() => {
    const filtred = contires.filter((c: ContryType) => {
      const searchKey = `${c.name.common} ${c.name.official} ${c.region}`
      if (searchKey.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) || searchTerm === '') {
        return true
      }
    })
    setFiltred(filtred);
  }, [searchTerm])

  const onChange = React.useCallback((e: any) => {
    const term = e.target.value;
    setSearchTerm(term);
  }, [searchTerm])

  const searchEmpty = filtres.length === 0;
  return <div className={css.body}>
    Search Contry Name: <input onChange={onChange} value={searchTerm}></input>
    <br />
    {error ? errorMessage : (loading ? 'loading ....' :
      searchEmpty ? "no results" : filtres.map(c => {
        return <ContryRow key={c.name.common} c={c} />
      }))}</div>
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <ContriesList />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/interview-box",
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
