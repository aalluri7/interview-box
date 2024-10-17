import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './app';
import { ContryRow } from './app'

test('renders learn react link', () => {
  render(<App />);
  const headerElement = screen.getByText(/search/i);
  expect(headerElement).toBeInTheDocument();
});

const data = { "name": { "common": "Tokelau", "official": "Tokelau", "nativeName": { "eng": { "official": "Tokelau", "common": "Tokelau" }, "smo": { "official": "Tokelau", "common": "Tokelau" }, "tkl": { "official": "Tokelau", "common": "Tokelau" } } }, "currencies": { "NZD": { "name": "New Zealand dollar", "symbol": "$" } }, "capital": ["Fakaofo"], "region": "Oceania", "languages": { "eng": "English", "smo": "Samoan", "tkl": "Tokelauan" }, "borders": [], "flag": "🇹🇰", "population": 1411 };
test('renders contry info correctly', () => {
  render(<ContryRow c={data} />)
  const nameElement = screen.getByText(/Tokelau/i)
})


test('renders more info on btn click', () => {
  render(<ContryRow c={data} />);
  const btn = screen.getByText(/View More/i);
  if (btn) {
    fireEvent.click(btn);
  }
  const CurrenciesElm = screen.getByText(/Currencies/i)
  expect(CurrenciesElm).toBeInTheDocument();
})
