import React from "react"
import { connect } from "react-redux"
import "@/pages/home.less"
class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return <div className="home"> 首页 </div>
  }
}

function mapStateToProps(state) {
  return state
}
export default connect(mapStateToProps)(Home)
