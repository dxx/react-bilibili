import * as React from "react";
import { Helmet } from "react-helmet";
import Nav from "../Nav";
import { getAreas } from "../../../api/live";

import style from "./area.styl?css-modules";

const {
  useState,
  useEffect
} = React;

function Area() {

  const [areas, setAreas] = useState([]);
  
  useEffect(() => {
    getAreas().then((result) => {
      if (result.code === "1") {
        setAreas(result.data.filter((data) => data.id !== 99));
      }
    });
  }, []);

  return (
    <div className="live-area">
      <Helmet>
        <title>哔哩哔哩直播-分类</title>
      </Helmet>
      <Nav />
      <section className={style.main}>
        <h5 className={style.title}>全部分类</h5>
        <div className={style.classes}>
          {
            areas.map((area) => (
              <a className={style.classWrapper} key={area.id}
                href={`/live/list?parent_area_id=${area.id}&parent_area_name=${area.name}&area_id=&area_name=`}>
                <img src={area.entrance_icon.src} alt={area.name} />
                <span>{area.name}</span>
              </a>
            ))
          }
        </div>
      </section>
    </div>
  );
}

export default Area;
