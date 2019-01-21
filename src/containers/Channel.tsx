import { connect } from "react-redux";
import Channel from "../views/channel/Channel";

const mapStateToProps = (state) => ({
  partitions: state.partitions
});

export default connect(mapStateToProps)(Channel);
