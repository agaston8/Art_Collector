/**
 * This file features and exports all of your calls to the API
 * 
 * You need to replace YOUR_API_KEY in the string associated with KEY with your actual API key
 */
export const BASE_URL = 'https://api.harvardartmuseums.org';
export const KEY = 'apikey=07769720-0406-43e9-bc2a-6332aed4e2fd';

/**
 * This will make a call to the API for a single term and value (e.g. "person", and "unknown"), and return the result
 */
export async function fetchQueryResultsFromTermAndValue(term, value) {
  const response = await fetch(`${BASE_URL}/object?${KEY}&${term}=${encodeURI(value.split('-').join('|'))}`);
  const data = await response.json();

  return data;
}

/**
 * This will make a call to the API for a preformed url (useful for previous and next buttons), and return the result
 */
export async function fetchQueryResultsFromURL(url) {
  const response = await fetch(url);
  const data = await response.json();

  return data;
}

/**
 * Requires an object { century: '', classification: '', queryString: '' } to be passed in as an argument
 * 
 * Then makes a call to the API, and returns the first page of results
 */
export async function fetchQueryResults({
  century,
  classification,
  queryString,
}) {
  const url = `${BASE_URL}/object?${KEY}&classification=${classification}&century=${century}&keyword=${queryString}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    //console.log(data)
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * This returns early if there are centuries stored in localStorage, or fetches them from the API and stores them in localStorage if not
 */
export async function fetchAllCenturies() {
  if (localStorage.getItem('centuries')) {
    return JSON.parse(localStorage.getItem('centuries'));
  }

  const url = `${BASE_URL}/century?${KEY}&size=100&sort=temporalorder`;

  const response = await fetch(url);
  const { records } = await response.json();

  localStorage.setItem('centuries', JSON.stringify(records));

  return records;
}

/**
 * This returns early if there are classifications stored in localStorage, or fetches them from the API and stores them in localStorage if not 
 */
export async function fetchAllClassifications() {
  if (localStorage.getItem('classifications')) {
    return JSON.parse(localStorage.getItem('classifications'));
  }

  const url = `${BASE_URL}/classification?${KEY}&size=100&sort=name`;

  const response = await fetch(url);
  const { records } = await response.json();

  localStorage.setItem('classifications', JSON.stringify(records));

  return records;
}