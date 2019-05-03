import * as React from "react";
import { AnyAction, Dispatch } from "redux";
import { Location } from "history";
import { Helmet } from "react-helmet";
import { parse } from "query-string";
import Context from "../../../context";
import Nav from "../Nav";
import LiveInfo from "../LiveInfo";
import { Live, UpUser } from "../../../models";
import { setShouldLoad } from "../../../redux/actions";
import { getLiveListData } from "../../../api/live";
import ScrollToTop from "../../../components/scroll-to-top/ScrollToTop";

import style from "./list.styl?css-modules";

interface ListProps {
  shouldLoad: boolean;
  liveListData: {
    total: number,
    list: Array<Live>
  };
  location: Location;
  dispatch: Dispatch<AnyAction>;
}

const {
  useState,
  useEffect
} = React;

let firstRender: boolean = true;

const livePage: { pageNumber: number, pageSize: number, totalPage: number} = {
  pageNumber: 2,  // 服务端渲染后客户端从第二页开始加载
  pageSize: 30,
  totalPage: 1
}

function List(props: ListProps) {

  const { shouldLoad, liveListData, location, dispatch } = props;
  const query = parse(location.search);

  const [lives, setLives] = useState(liveListData.list);
  const [isLoadMore, setIsLoadMore] = useState(false);

  // 第一次render
  if (firstRender) {
    livePage.totalPage = Math.ceil(liveListData.total / livePage.pageSize);
    firstRender = false;
  }

  const getLives = () => {
    getLiveListData({
      parentAreaId: query.parent_area_id as any,
      areaId: query.area_id as any,
      page: livePage.pageNumber,
      pageSize: livePage.pageSize
    }).then((result) => {
      if (result.code === "1") {
        const list = result.data.list.map((data) => 
          new Live(data.title, data.roomid, data.online, data.user_cover, 0, "",
            new UpUser(data.uid, data.uname, data.face))
        );
        
        livePage.totalPage = Math.ceil(result.data.count / livePage.pageSize);
        livePage.pageNumber++;
        
        if (livePage.pageNumber > 2) {
          // 过滤重复的主播数据
          const filteredLives = list.filter((live) =>
            lives.findIndex((item) => item.roomId === live.roomId) === -1
          );
          setLives(lives.concat(filteredLives));
        } else {
          setLives(list);
        }
        
        setIsLoadMore(false);
      }
    });
  };

  useEffect(() => {

    if (shouldLoad === true) {
      // 客户端从第一页开始加载数据
      livePage.pageNumber = 1;
      getLives();
    } else {
      dispatch(setShouldLoad(true));
    }

  }, []);

  return (
    <div className="live-list">
      <Helmet>
        <title>直播-{query.area_name ? query.area_name : query.parent_area_name}</title>
      </Helmet>
      <Nav />
      <Context.Consumer>
        { context => (
          <section className={style.main}>
            <div className={style.roomContainer}>
              <h4 className={style.title}>
                {query.area_name ? query.area_name : query.parent_area_name}
              </h4>
              {/* 房间列表 */}
              <div className={style.rooms}>
                {
                  lives.map((data) => { 
                    if (data.cover.indexOf(context.picURL) === -1) {
                      data.cover = `${context.picURL}?pic=${data.cover}`;
                    }
                    return (
                      <a className={style.roomWrapper} key={data.roomId}
                        href={`/live/${data.roomId}`}>
                        <LiveInfo data={data} />
                      </a>
                    )
                  })
                }
              </div>
            </div>
            {/* 加载更多 */}
            {
              lives.length > 0 && livePage.totalPage > 1 ? (
                <div className={style.loadMore}>
                  <div className={style.loadBtn} onClick={() => {
                      if (livePage.pageNumber <= livePage.totalPage) {
                        setIsLoadMore(true);
                        getLives();
                      }
                    }}>
                    { isLoadMore === false ?
                      livePage.pageNumber <= livePage.totalPage ?
                      "请给我更多！": "没有更多了！" : "加载中..."}
                  </div>
                </div>
              ) : null
            }
          </section>
        )}
      </Context.Consumer>
      <ScrollToTop />
    </div>
  );
}

export default List;
