import React, { Component } from "react";
import axios from "axios";
import Table from "./components/table/table";
import "./App.scss";
import yahooFinance from "yahoo-finance";

export default class App extends Component {
  constructor(props) {
    super();
    this.state = {
      redline: [],
      table: [],
    };
    this.preprocessData = this.preprocessData.bind(this);
  }

  preprocessData(data) {
    data.sort(
      (a, b) =>
        -(a.fiftyTwoWeekLowPrice - a.current)/a.current +
        (b.fiftyTwoWeekLowPrice - b.current)/b.current
    );
    return data
  }

  async componentDidMount() {
    try {
      let bse_losers = await axios.get(
        "https://etmarketsapis.indiatimes.com/ET_Stats/losers?pagesize=1000&exchange=bse&pageno=1&sort=intraday&sortby=percentchange&sortorder=asc&duration=1d"
      );

      bse_losers = this.preprocessData(bse_losers.data.searchresult);


      const nse_losers = await axios.get(
        "https://etmarketsapis.indiatimes.com/ET_Stats/losers?pagesize=1000&exchange=nse&pageno=1&sort=intraday&sortby=percentchange&sortorder=asc&duration=1d"
      );
      
      const table = bse_losers.map((item) => ({
        name: item.ticker,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.current,
        change: item.absoluteChange,
        change_percent: item.percentChange,
        fiftyTwoWeekHigh: item.fiftyTwoWeekHighPrice,
        fiftyTwoWeekLow: item.fiftyTwoWeekLowPrice,
        diff: ((item.current-item.fiftyTwoWeekLowPrice)/item.current).toFixed(5)
      }));

      this.setState({
        redline: bse_losers.data,
        table
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div className="App">
        <div className="RedTable">
          <Table
            headers={[
              "Sr. No",
              "Name",
              "Open",
              "Current/ Close",
              "High",
              "Low",
              "Change Value",
              "Change %",
              "52 Week High",
              "52 Week Low",
              "Diff"
            ]}
            contents={this.state.table}
          />
        </div>
      </div>
    );
  }
}
