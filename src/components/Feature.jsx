import React, { Fragment } from "react";

// Don't touch this import
import { fetchQueryResultsFromTermAndValue } from "../api";

/**
 * We need a new component called Searchable which:
 *
 * Has a template like this:
 *
 * <span className="content">
 *  <a href="#" onClick={async (event) => {}}>SOME SEARCH TERM</a>
 * </span>
 *
 * You'll need to read searchTerm, searchValue, setIsLoading, and setSearchResults off of the props.
 *
 * When someone clicks the anchor tag, you should:
 *
 * - preventDefault on the event
 * - call setIsLoading, set it to true
 *
 * Then start a try/catch/finally block:
 *
 * try:
 *  - await the result of fetchQueryResultsFromTermAndValue, passing in searchTerm and searchValue
 *  - send the result to setSearchResults (which will update the Preview component)
 * catch:
 *  - console.error the error
 * finally:
 *  - call setIsLoading, set it to false
 */


/**
 * We need a new component called Feature which looks like this when no featuredResult is passed in as a prop:
 * 
 * 
 * 
 * And like this when one is:
 *
 * <main id="feature">
 *   <div className="object-feature">
 *     <header>
 *       <h3>OBJECT TITLE</h3>
 *       <h4>WHEN IT IS DATED</h4>
 *     </header>
 *     <section className="facts">
 *       <span className="title">FACT NAME</span>
 *       <span className="content">FACT VALUE</span>
 *       <span className="title">NEXT FACT NAME</span>
 *       <span className="content">NEXT FACT VALUE</span>
 *     </section>
 *     <section className="photos">
 *       <img src=IMAGE_URL alt=SOMETHING_WORTHWHILE />
 *     </section>
 *   </div>
 * </main>
 *
 * The different facts look like this: title, dated, images, primaryimageurl, description, culture, style,
 * technique, medium, dimensions, people, department, division, contact, creditline
 *
 * The <Searchable /> ones are: culture, technique, medium (first toLowerCase it), and person.displayname (one for each PEOPLE)
 *
 * NOTE: people and images are likely to be arrays, and will need to be mapped over if they exist
 *
 * This component should be exported as default.
 */
const Feature = ({featuredResult, setIsLoading, setSearchResults}) => { 

  const Searchable = ({searchTerm, searchValue}) => {
  
    return (
     <span className="content">
        <a href='#' onClick={async (event) => {
            event.preventDefault();
             setIsLoading(true);
            try {
                await fetchQueryResultsFromTermAndValue(searchTerm, searchValue).then ((result) => {setSearchResults(result);})
                
            } catch (error) {
                console.error(error.message)
            } finally {
                 setIsLoading(false);
            }
        }}>{searchValue}</a>
     </span>
    )
}


  const CheckIfProperty = ({property, search}) => {
   let newProperty = property.toLowerCase();
   //console.log(newProperty)
   //console.log(featuredResult[newProperty])
    if (featuredResult[newProperty]) {
      return(
      <>
        <span className="title">{property}:</span> {
          (featuredResult[newProperty] && search) ? 
         <Searchable searchTerm={newProperty} searchValue={featuredResult[newProperty]}/> : <span className="content">{featuredResult[newProperty]}</span>
        }
      </>)
   } else {
    return ""
   }
  }


if (featuredResult) {
 return (
 <main id="feature">
   <div className="object-feature">
     <header>
       <h3>{featuredResult.title}</h3>
       <h4>{featuredResult.dated}</h4>
     </header>
     <section className="facts">
      <CheckIfProperty property="Century"/>
      <CheckIfProperty property="Period"/>
      <CheckIfProperty property="Classification"/>
      <CheckIfProperty property="Description"/>
      <CheckIfProperty property="Department"/>
      <CheckIfProperty property="Division"/>
      <CheckIfProperty property="Culture" search="true"/>
       {
          featuredResult.people ? 
            <>
                <span className="title">People:</span> {
                    featuredResult.people.map((person, index) => {return <Searchable key={index} searchTerm="person" searchValue={person.name} />})
                }
            </> : ""
       }
       <CheckIfProperty property="Dimensions"/>
       <CheckIfProperty property="Technique" search="true"/>
       <CheckIfProperty property="Medium" search="true"/>
       
     </section>
     <section className="photos"> {
       featuredResult.images ? 
         featuredResult.images.map((image, index) => { return <img key={index} src={image.baseimageurl} alt={image.alttext}/>})
        : ""}
     </section>
   </div>
 </main>)
 } else {
 return (<main id="feature"></main>)
 }
}

export default Feature;
