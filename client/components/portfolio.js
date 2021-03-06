import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getPortfolio} from '../store/portfolio'
import {Stock} from './stock'

/**
 * COMPONENT
 */
class Portfolio extends Component {
  componentDidMount() {
    this.props.getPortfolio()
  }

  render() {
    const {portfolio} = this.props
    let portfolioValue = 0
    if (portfolio) {
      portfolioValue = portfolio.reduce((total, stock) => {
        total += stock.value
        return total
      }, 0)
    }
    return (
      <div>
        {/* Prices are recorded accurately but rounded for cleaner display */}
        <h2>
          Portfolio:{' '}
          {portfolioValue.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          })}
        </h2>
        {portfolio ? (
          portfolio.map(stock => <Stock key={stock.id} stock={stock} />)
        ) : (
          <div>Loading...</div>
        )}
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
