import React from "react";

/**
 * We need to import fetchQueryResultsFromURL since we will sometimes have urls in info.prev and info.next
 * which are query urls.
 */
import { fetchQueryResultsFromURL } from "../api";



const Preview = ({searchResults, setIsLoading,setSearchResults,setFeaturedResult}) => {
  //console.log(searchResults)
  let info = searchResults.info;
  let records = searchResults.records;
  //  console.log(records); //this is an array
  //  console.log(info)//this is an object

  /**
   * Destructure setSearchResults, setFeaturedResult, and setIsLoading from props
   * and also destructure info and records from props.searchResults
   *
   * You need info, records, setSearchResults, setFeaturedResult, and setIsLoading as available constants
   */
  /**
   * Don't touch this function, it's good to go.
   *
   * It has to be defined inside the Preview component to have access to setIsLoading, setSearchResults, etc...
   */
  async function fetchPage(pageUrl) {
    setIsLoading(true);

    try {
      await fetchQueryResultsFromURL(pageUrl).then((results) => {setSearchResults(results)});
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
 
  let record ={};
  
  const ImageGetter = (props) => {
    record=props.record;
    if (record.primaryimageurl){
       return <img src={ record.primaryimageurl } alt={ record.description } />
    } else {
       return ('');
    }
  }

  function RecordTitleGetter (props) {
    record=props.record;
    if (record.title) {
      return <h3>{ record.title }</h3>
    } else 
    return <h3>MISSING INFO</h3>
  }

  return (
    <aside id="preview">
      <header className="pagination">
        {/* This button should be disabled if nothing is set in info.prev, and should call fetchPage with info.prev when clicked */}
        <button
          disabled={!info.prev}
          className="previous"
          onClick={() => fetchPage(info.prev)}
        >
          Previous
        </button>
        {/* This button should be disabled if nothing is set in info.next, and should call fetchPage with info.next when clicked */}
        <button
          disabled={!info.next}
          className="next"
          onClick={() => fetchPage(info.next)}
        >
          Next
        </button>
      </header>
      <section className="results">
        { records.map((record, index) => {
          // console.log(record)
          return (
            <div
              key={index}
              className="object-preview"
              onClick={(e) => {
                e.preventDefault();
                setFeaturedResult(record);
              }}
            >  
                <ImageGetter record={record}/>
                <RecordTitleGetter record={record}/>
                {/* This is another way {record.primaryimageurl && <img src={ record.primaryimageurl } alt={record.description} />} */}
            </div>
          );
        })}
        
        {/* /* Here we should map over the records, and render something like this
        for each one:
        <div
          key={index}
          className="object-preview"
          onClick={(event) => {
            // prevent the default
            // set the featured result to be this record, using setFeaturedResult
          }}
        >
          {
            // if the record.primaryimageurl exists, show this: <img src={ record.primaryimageurl } alt={ record.description } />, otherwise show nothing
          }
          {
            // if the record.title exists, add this: <h3>{ record.title }</h3>, otherwise show this: <h3>MISSING INFO</h3>
          }
        </div>
        */ }
      </section>
    </aside>
  );
};

export default Preview;


// images: Array(1)
// 0:
// alttext: null
// baseimageurl: "https://nrs.harvard.edu/urn-3:HUAM:770548"
// copyright: "President and Fellows of Harvard College"
// date: "2019-07-01"
// description: null
// displayorder: 1
// format: "image/jpeg"
// height: 1677
// idsid: 472343017
// iiifbaseuri: "https://ids.lib.harvard.edu/ids/iiif/472343017"
// imageid: 501035
// publiccaption: null
// renditionnumber: "770548"
// technique: "Make:Hasselblad;Model:Hasselblad H5D-50c MS;Orientation:1;Software:Adobe Photoshop CC 2018 (Macintosh);"
// width: 2550

