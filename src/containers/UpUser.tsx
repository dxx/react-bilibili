import { connect } from "react-redux";
import UpUser from "../views/space/UpUser";

const mapStateToProps = (state) => ({
  shouldLoad: state.shouldLoad,
  upUser: state.upUser
});

export default connect(mapStateToProps)(UpUser);
