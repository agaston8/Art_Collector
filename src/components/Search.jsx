import React, { useEffect, useState } from "react";

/**
 * Don't touch these imports!
 */
import {
  fetchAllCenturies,
  fetchAllClassifications,
  fetchQueryResults,
} from "../api";

const Search = (props) => {
  // Make sure to destructure setIsLoading and setSearchResults from the props
  let setIsLoading = props.setIsLoading;
  let setSearchResults = props.setSearchResults;
  let setFeaturedResult = props.setFeaturedResult;

  /**
   * We are at the Search component, a child of app. This has a form, so we need to use useState for
   * our controlled inputs:
   *
   * centuryList, setCenturyList (default should be an empty array, [])
   * classificationList, setClassificationList (default should be an empty array, [])
   * queryString, setQueryString (default should be an empty string, '')
   * century, setCentury (default should be the string 'any')
   * classification, setClassification (default should be the string 'any')
   */

  const [centuryList, setCenturyList] = useState([]);
  const [classificationList, setClassificationList] = useState([]);
  const [queryString, setQueryString] = useState("");
  const [century, setCentury] = useState("any");
  const [classification, setClassification] = useState("any");
  const [suggestion, setSuggestion] = useState({ info: {}, records: [] }); //should tghis be an array



  /**
   * Inside of useEffect, use Promise.all([]) with fetchAllCenturies and fetchAllClassifications
   *
   * In the .then() callback pass the returned lists to setCenturyList and setClassificationList
   *
   * Make sure to console.error on caught errors from the API methods.
   */
  useEffect(() => {
    Promise.all([fetchAllCenturies(), fetchAllClassifications()])
      .then((results) => {
        setCenturyList(results[0]);
        setClassificationList(results[1]);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  /**
   * This is a form element, so we need to bind an onSubmit handler to it which:
   *
   * calls event.preventDefault()
   * calls setIsLoading, set it to true
   *
   * then, in a try/catch/finally block:
   *
   * try to:
   * - get the results from fetchQueryResults({ century, classification, queryString })
   * - pass them to setSearchResults
   *
   * catch: error to console.error
   *
   * finally: call setIsLoading, set it to false
   */

  return (
    <form
      id="search"
      onSubmit={async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
          await fetchQueryResults({
            century,
            classification,
            queryString,
          }).then((results) => {
            setSearchResults(results);
            
          });
        } catch (error) {
          console.error(error.message);
        } finally {
          setIsLoading(false);
          setSuggestion({ info: {}, records: [] })
        }
      }}
    >
      <fieldset id="withSuggestion">
        <label htmlFor="keywords">Query</label>
        <input
          id="keywords"
          type="text"
          placeholder="enter keywords..."
          autocomplete="off"
          value={queryString}
          onChange={async (e) => {
            setQueryString(e.target.value);
            try {
              await fetchQueryResults({
                century,
                classification,
                queryString,
              }).then((results) => {
                setSuggestion(results)
              })}
              catch (error) {
                console.error(error.message);}
              }}
          />
        <ul> {
           suggestion.records ?  suggestion.records.map((eachRecord, index) => {
                                                     let recordTitle = eachRecord.title
                                                    return <li key={index} onClick= {(e) => {
                                                              setFeaturedResult(eachRecord)
                                                              setSuggestion({ info: {}, records: [] })}} >{recordTitle}</li>
                                       }) : ""}
        </ul>
      </fieldset>
      <fieldset>
        <label htmlFor="select-classification">
          Classification{" "}
          <span className="classification-count">
            ({classificationList.length})
          </span>
        </label>
        <select
          name="classification"
          id="select-classification"
          value={classification}
          onChange={(e) => {
            setClassification(e.target.value);
            console.log(e.target)
          }}
        >
          <option value="any">Any</option>
          {classificationList.map((eachObject, index) => {
            let theClassificationName = eachObject.name;
            return (
              <option key={index} value={theClassificationName}>
                {theClassificationName}
              </option>
            );
          })}
        </select>
      </fieldset>
      <fieldset>
        <label htmlFor="select-century">
          Century <span className="century-count">({centuryList.length})</span>
        </label>
        <select
          name="century"
          id="select-century"
          value={century}
          onChange={(e) => setCentury(e.target.value)}
        >
          <option value="any">Any</option>
          {centuryList.map((eachObject, index) => {
            let theCenturyName = eachObject.name;
            return (
              <option key={index} value={theCenturyName}>
                {theCenturyName}
              </option>
            );
          })}
        </select>
      </fieldset>
     
        <button>SEARCH</button>
   
    </form>
  );
};

export default Search;
