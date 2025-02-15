import "./SearchResult.css";
import * as queryUtils from './../hooks/getQueryName';

export const SearchResult = ({ result, setQueryName }) => {
  setQueryName(result);
  queryUtils.setQueryName(result);
  
  return (
    <div
      className="search-result"
      onClick={(e) => alert(`You qwqwds selected ${result}!`)}
    >
      {result}
    </div>
  );
};