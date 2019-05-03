import { connect } from "react-redux";
import Video from "../views/video/Detail";

const mapStateToProps = (state) => ({
  video: state.video
});

export default connect(mapStateToProps)(Video);
