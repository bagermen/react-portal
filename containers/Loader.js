import Loader from '../components/ui/Loader';
import { connect } from "react-redux";

function mapStateToProps(state) {
    return {
      loading: state.state.loading
    };
  }

export default connect(mapStateToProps)(Loader);