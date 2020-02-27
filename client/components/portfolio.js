import React from 'react'
import {connect} from 'react-redux'
import {getPortfolio} from '../store/index'

/**
 * COMPONENT
 */
export class Portfolio {
  componentDidMount() {
    this.props.getPortfolio()
  }

  render() {
    const {portfolio} = this.props
    const portfolioValue = portfolio.reduce((stock, total) => {
      total += stock.value
      return total
    }, 0)
    return (
      <div>
        <h2>Portfolio: ${portfolioValue}</h2>
        {portfolio.map(stock => <Stock key={stock.id} stock={stock} />)}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    portfolio: state.portfolio
  }
}

const mapDispatch = dispatch => {
  return {
    getPortfolio: () => dispatch(getPortfolio())
  }
}

export default connect(mapState, mapDispatch)(Portfolio)
