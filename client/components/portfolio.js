import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getPortfolio} from '../store/portfolio'
import {Stock} from './stock'
import {updatedWhenMarketOpenedToday} from '../../util'

/**
 * COMPONENT
 */
class Portfolio extends Component {
  componentDidMount() {
    this.props.getPortfolio()
  }

  componentDidUpdate() {
    // Checks if portfolio needs dynamic update, based on if
    // most recent update was when market opened
    let mostRecentUpdate = new Date(this.props.portfolio[0].updatedAt)
    if (!updatedWhenMarketOpenedToday(mostRecentUpdate, new Date())) {
      this.props.getPortfolio()
    }
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
        <h2>Portfolio: ${portfolioValue / 1000}</h2>
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
