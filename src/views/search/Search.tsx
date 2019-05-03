import * as React from "react";
import { Helmet } from "react-helmet";
import Result from "./Result";
import { getHotwords, getSuggests } from "../../api/search";
import storage, { SearcHistory } from "../../util/storage";

import style from "./search.styl?css-modules";

interface SearchState {
  searchValue: string;
  keyword: string;
  words: string[];
  suggestList: Array<{name: string, value: string}>;
  searchHistories: SearcHistory[];
}

class Search extends React.Component<any, SearchState> {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: "",
      keyword: "",
      words: [],
      suggestList: [],
      searchHistories: []
    }
  }
  public componentDidMount() {
    getHotwords().then((result) => {
      if (result.code === "1") {
        const words = result.data.map((item) => item.keyword)
        this.setState({
          words
        });
      }
    });

    this.setState({
      searchHistories: storage.getSearchHistory()
    });
  }
  /**
   * 设置搜索内容
   */
  private setKeyword(keyword) {
    if (keyword) {
      this.setState({
        suggestList: [],
        searchValue: keyword,
        keyword,
      });
      // 记录当前搜索历史
      storage.setSearchHistory({
        value: keyword,
        timestamp: new Date().getTime()
      });
    }
  }
  /**
   * 清楚搜索内容
   */
  private clearSearch() {
    this.setState({
      suggestList: [],
      searchValue: "",
      keyword: "",
      searchHistories: storage.getSearchHistory()
    });
  }
  /**
   * 清楚搜索历史记录
   */
  private clearSearchHistory() {
    storage.clearSearchHistory();
    this.setState({
      searchHistories: []
    });
  }
  private getSuggests = (e) => {
    if (e.keyCode !== 13) {
      const content = e.currentTarget.value;
      if (content) {
        getSuggests(content).then((result) => {
          if (result.code === "1") {
            let suggestList = [];
            if (result.data.tag) {
              suggestList = result.data.tag.map((item) => ({name: item.name, value: item.value}))
            }
            this.setState({
              suggestList,
              keyword: ""
            });
          }
        });
      } else {
        this.setState({
          suggestList: [],
          keyword: ""
        });
      }
    }
  }
  /**
   * 设置搜索内容
   */
  private setSearchContent = (e) => {
    if (e.keyCode === 13) {
      const content = e.currentTarget.value;
      if (content) {
        this.setState({
          suggestList: [],
          keyword: content
        });
        // 记录当前搜索历史
        storage.setSearchHistory({
          value: content,
          timestamp: new Date().getTime()
        });
      }
    }
  }
  public render() {
    return (
      <div className="search">
        <Helmet>
          <title>搜索</title>
        </Helmet>
        {/* 搜索框 */}
        <div className={style.searchTop}>
          <div className={style.boxWrapper}>
            <i className="icon-search" />
            <input type="search"
              autoComplete="off"
              maxLength={33}
              placeholder="搜索视频、UP主或AV号"
              value={this.state.searchValue}
              className={style.searchBox}
              onChange={(e) => {this.setState({ searchValue: e.currentTarget.value })}}
              onKeyDown={this.setSearchContent}
              onKeyUp={this.getSuggests} />
            {
              this.state.searchValue ? (
                <i className={style.searchClose} onClick={() => { this.clearSearch(); }} />
              ) : null
            }
          </div>
          <span className={style.cancel} onClick={() => { window.history.back(); }}>取消</span>
        </div>
        {
          !this.state.keyword ? (
            <div>
              <div className={style.words}>
                <div className={style.wordTitle}>大家都在搜</div>
                <div className={style.wordWrapper + " clear"}>
                  {
                    this.state.words.map((word, i) => (
                      <div className={style.wordItem} key={"word" + i}
                        onClick={() => { this.setKeyword(word)}}>{word}</div>
                    ))
                  }
                </div>
              </div>
              {
                /* 推荐列表 */
                this.state.suggestList.length > 0 ? (
                  <div className={style.suggest}>
                    {
                      this.state.suggestList.map((suggest, i) => (
                        <div className={style.suggestItem} key={"suggest" + i}>
                          <p dangerouslySetInnerHTML={{__html: suggest.name}}
                            onClick={() => { this.setKeyword(suggest.value)}} />
                        </div>
                      ))
                    }
                  </div>
                ) : null
              }
              <div className={style.history}>
                <div className={style.historyTitle}>历史搜索</div>
                <div className={style.historyList}>
                {
                  this.state.searchHistories.map((history, i) => (
                    <div className={style.historyItem} key={i}
                      onClick={() => { this.setKeyword(history.value); }}>
                      <i className={style.historyIco} />
                      <div className={style.name}>{history.value}</div>
                    </div>
                  ))
                }
                </div>
                {
                  this.state.searchHistories.length > 0 ? (
                    <div className={style.historyClear}
                      onClick={() => { this.clearSearchHistory(); }}>清除历史记录</div>
                  ) : null
                }
              </div>
            </div>
          ) : (
            <div className={style.searchResult}>
              <Result keyword={this.state.keyword}/>
            </div>
          )
        }
      </div>
    );
  }
}
export default Search;
