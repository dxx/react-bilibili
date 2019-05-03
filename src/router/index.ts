import NestedRoute from "./NestedRoute";
import StatusRoute from "./StatusRoute";
import loadable from "@loadable/component";
import getIndexContent from "../redux/async-actions/index";
import getPartitionList from "../redux/async-actions/channel";
import { getRankingVideoList } from "../redux/async-actions/ranking";
import getVideoInfo from "../redux/async-actions/video";
import getUpUserInfo from "../redux/async-actions/up-user";

import getLiveData from "../redux/async-actions/live/index";
import getLiveListData from "../redux/async-actions/live/list";
import getRoomData from "../redux/async-actions/live/room";


const router = [
  {
    path: "/index",
    component: loadable(() => import(/* webpackChunkName: 'index' */ "../containers/Index")),
    asyncData: (store) => {
      return store.dispatch(getIndexContent());
    }
  },
  {
    path: "/channel/:rId",
    component: loadable(() => import(/* webpackChunkName: 'channel' */ "../containers/Channel")),
    asyncData: (store) => {
      return store.dispatch(getPartitionList());
    }
  },
  {
    path: "/ranking/:rId",
    component: loadable(() => import(/* webpackChunkName: 'ranking' */ "../containers/Ranking")),
    asyncData: (store, param) => {
      return store.dispatch(getRankingVideoList(param.rId));
    }
  },
  {
    path: "/video/av:aId",
    component: loadable(() => import(/* webpackChunkName: 'video' */ "../containers/Video")),
    asyncData: (store, param) => {
      return store.dispatch(getVideoInfo(param.aId))
    }
  },
  {
    path: "/space",
    component: loadable(() => import(/* webpackChunkName: 'space' */ "../views/space/Space")),
    routes: [
      {
        path: "/space",
        component: loadable(() => import(/* webpackChunkName: 'history' */ "../views/space/History")),
        exact: true
      },
      {
        path: "/space/:mId",
        component: loadable(() => import(/* webpackChunkName: 'up-user' */ "../containers/UpUser")),
        asyncData: (store, param) => {
          return store.dispatch(getUpUserInfo(param.mId));
        }
      }
    ]
  },
  {
    path: "/search",
    component: loadable(() => import(/* webpackChunkName: 'search' */ "../views/search/Search"))
  },
  {
    path: "/live",
    component: loadable(() => import(/* webpackChunkName: 'live-index' */ "../containers/live/Index")),
    exact: true,
    asyncData: (store) => {
      return store.dispatch(getLiveData());
    }
  },
  {
    path: "/live/list",
    component: loadable(() => import(/* webpackChunkName: 'live-list' */ "../containers/live/List")),
    asyncData: (store, param) => {
      return store.dispatch(getLiveListData({
        parentAreaId: param.parent_area_id,
        areaId: param.area_id,
        page: 1,
        pageSize: 30
      }));
    }
  },
  {
    path: "/live/areas",
    component: loadable(() => import(/* webpackChunkName: 'live-area' */ "../views/live/area/Area"))
  },
  {
    path: "/live/:roomId",
    component: loadable(() => import(/* webpackChunkName: 'live-room' */ "../containers/live/Room")),
    asyncData: (store, param) => {
      return store.dispatch(getRoomData(param.roomId));
    }
  }
];

export default router;

export {
  NestedRoute,
  StatusRoute
}
