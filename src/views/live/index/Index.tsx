import * as React from "react";
import { History } from "history";
import { Helmet } from "react-helmet";
import Context from "../../../context";
import Nav from "../Nav";
import LiveInfo from "../LiveInfo";
import { Live } from "../../../models";

import "swiper/dist/css/swiper.css";
import style from "./index.styl?css-modules";

interface IndexProps {
  liveData: {
    bannerList: Array<{ id: number, title: string, pic: string, link: string }>,
    itemList: Array<{ 
      title: string,
      parentAreaId: number,
      parentAreaName: string,
      areaId: number,
      areaName: string,
      list: Array<Live>
    }>
  };
  history: History;
}

const {
  useEffect
} = React;

function Index(props: IndexProps) {
  const { bannerList, itemList } = props.liveData;

  useEffect(() => {
    // 服务端引入会抛异常
    const Swiper = require("swiper");
    new Swiper(".swiper-container", {
      loop: true,
      autoplay: 3000,
      autoplayDisableOnInteraction: false,
      pagination: ".swiper-pagination"
    });

  }, []);  // 传入空数组，组件第一次挂载后调用，组件更新不回调

  return (
    <div className="live-index">
      <Helmet>
        <title>哔哩哔哩直播</title>
      </Helmet>
      <Nav />
      <Context.Consumer>
        { context => (
          <section className={style.main}>
            <div className={style.banner}>
              {
                bannerList.length > 0 ? (
                  <div className="swiper-container">
                    <div className="swiper-wrapper">
                      {
                        bannerList.map((banner) => (
                          <div className="swiper-slide" key={banner.id}>
                            <a href={banner.link}>
                              <img src={`${context.picURL}?pic=${banner.pic}`} width="100%" height="100%" />
                            </a>
                          </div>
                        ))
                      }
                    </div>
                    <div className="swiper-pagination clear" />
                  </div>
                ) : null
              }
            </div>
            {/* 分区直播列表 */}
            {
              itemList.map((item, i) => (
                <div className={style.roomContainer} key={i}>
                  <h4 className={style.title}>
                    {item.areaName ? item.areaName : item.parentAreaName}
                    <span className={style.more} onClick={() => {
                      props.history.push({
                          pathname: "/live/list",
                          search: `?parent_area_id=${item.parentAreaId}` +
                            `&parent_area_name=${item.parentAreaName}` +
                            `&area_id=${item.areaId}` +
                            `&area_name=${item.areaName}`
                        });
                      }}>
                      进去看看
                    </span>
                  </h4>
                  <div className={style.rooms}>
                    {
                      item.list.map((data) => { 
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
              ))
            }
            <div className={style.bottom}>
              <div>
                <a href="/live/list?parent_area_id=0&parent_area_name=全部直播&area_id=&area_name=">全部直播</a>
              </div>
              <div>
                <a href="/live/areas">全部分类</a>
              </div>
            </div>
          </section>
        )}
      </Context.Consumer>
    </div>
  );
}

export default Index;
