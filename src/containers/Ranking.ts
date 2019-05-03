import { connect } from "react-redux";
import Ranking from "../views/ranking/Ranking";

const mapStateToProps = (state) => ({
  shouldLoad: state.shouldLoad,
  rankingPartitions: state.rankingPartitions,
  rankingVideos: state.rankingVideos
});

export default connect(mapStateToProps)(Ranking);
