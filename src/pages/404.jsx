import React from "react"
import { connect } from "react-redux"

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return <div className="no-page"> 404 </div>
  }
}

function mapStateToProps(state) {
  return state
}
export default connect(mapStateToProps)(Home)