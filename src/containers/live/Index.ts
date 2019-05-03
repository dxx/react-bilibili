import { connect } from "react-redux";
import Index from "../../views/live/index/Index";

const mapStateToProps = (state) => ({
  liveData: state.liveData
});

export default connect(mapStateToProps)(Index);
