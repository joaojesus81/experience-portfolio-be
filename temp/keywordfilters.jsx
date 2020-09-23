import React, { Component } from "react";
import * as api from "../utils/api";

class KeywordFilters extends Component {
  state = {
    keywordGroupNames: [],
    keywordGroupCodes: [],
    isLoading: true,
    err: null,
    keywords: {},
  };

  componentDidMount() {
    this.getKeywords().then(
      ({ keywordGroups, keywordGroupNames, keywordsArr }) => {
        this.setState({
          keywordGroupNames: keywordGroupNames,
          keywordGroups: keywordGroups,
          keywordsArr: keywordsArr,
        });
      }
    );
  }

  getKeywords = () => {
    return api.getAllKeywordsByGroup().then((keywords) => {
      const keywordsArr = [];
      const keywordGroups = Object.keys(keywords);

      const keywordGroupNames = keywordGroups.map((keywordGroup) => {
        return keywords[keywordGroup].KeywordGroupName;
      });

      keywordGroupNames.sort();

      console.log(keywordGroupNames);

      keywordGroupNames.forEach((keywordGroupName) => {
        keywordGroups.forEach((keywordGroup) => {
          if (keywords[keywordGroup].KeywordGroupName === keywordGroupName) {
            keywordsArr.push(keywords[keywordGroup].Keywords);
          }
        });
      });
      console.log(keywordsArr);

      return { keywordGroups, keywordGroupNames, keywordsArr };
    });
  };

  render() {
    const { keywordGroupNames, keywordsArr } = this.state;
    return (
      <div>
        {keywordGroupNames.map((groupName, i) => {
          return (
            <div>
              <p>{groupName}</p>
              <select name={`${groupName}Select`} id={`${groupName}Select`}>
                {keywordsArr[i].map((keyword, j) => {
                  return <option value={j}>{`${keyword}`}</option>;
                })}
              </select>
            </div>
          );
        })}
      </div>
    );
  }
}

export default KeywordFilters;
