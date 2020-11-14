import React, { Component } from "react";
import axios from "axios";
import Table from "./components/table/table";
import "./App.scss";

export default class App extends Component {
  constructor(props) {
    super();
    this.state = {
      redline_bse: [],
      mainTable: [],
      close52: [],
      new52: [],
    };
    this.preprocessData = this.preprocessData.bind(this);
    this.buildTable = this.buildTable.bind(this);
    this.showDetails = this.showDetails.bind(this);
  }

  preprocessData(data) {
    data.sort(
      (a, b) =>
        -(a.fiftyTwoWeekLowPrice - a.current)/a.current +
        (b.fiftyTwoWeekLowPrice - b.current)/b.current
    );
    return data
  }

  buildTable(data) {
    return data.map((item) => ({
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
  }

  showDetails(id) {
    const company = this.state.redline_bse[id];
    const url = `https://economictimes.indiatimes.com/${company.companyShortName.toLocaleLowerCase().split(' ').join('-')}/stocks/companyid-${company.companyId}.cms?layout=1`

    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  async componentDidMount() {
    try {
      let bse_losers = await axios.get(
        "https://etmarketsapis.indiatimes.com/ET_Stats/losers?pagesize=1000&exchange=bse&pageno=1&sort=intraday&sortby=percentchange&sortorder=asc&duration=1d"
      );
      let bse_close52 = await axios.get(
        "https://etmarketsapis.indiatimes.com/ET_Stats/near52weekslow?pagesize=100&exchange=bse&pageno=1&sortby=percentgap&sortorder=asc"
      )
      let bse_new52 = await axios.get(
        "https://etmarketsapis.indiatimes.com/ET_Stats/new52weekslow?pageno=1&pagesize=100&sortby=percentchange&sortorder=asc&exchange=bse"
      )

      // const nse_losers = await axios.get(
      //   "https://etmarketsapis.indiatimes.com/ET_Stats/losers?pagesize=1000&exchange=nse&pageno=1&sort=intraday&sortby=percentchange&sortorder=asc&duration=1d"
      // );
      const redline_bse = bse_losers.data.searchresult
      bse_losers = this.preprocessData(bse_losers.data.searchresult);      
      const mainTable = this.buildTable(bse_losers)
      const close52 = this.buildTable(bse_close52.data.searchresult)
      const new52 = this.buildTable(bse_new52.data.searchresult);

      this.setState({
        redline_bse,
        mainTable,
        bse_close52,
        close52,
        bse_new52,
        new52
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
              "Curr/ Close",
              "High",
              "Low",
              "Change Value",
              "Change %",
              "52 Week High",
              "52 Week Low",
              "Diff"
            ]}
            contents={this.state.mainTable}
            showDetails={this.showDetails}
          />
        </div>
        <div className="close52">
          <Table
            headers={[
              "Sr. No",
              "Name",
              "Open",
              "Curr/ Close",
              "High",
              "Low",
              "Change Value",
              "Change %",
              "52 Week High",
              "52 Week Low",
              "Diff"
            ]}
            contents={this.state.close52}
          />
        </div>
        <div className="new52">
          <Table
            headers={[
              "Sr. No",
              "Name",
              "Open",
              "Curr/ Close",
              "High",
              "Low",
              "Change Value",
              "Change %",
              "52 Week High",
              "52 Week Low",
              "Diff"
            ]}
            contents={this.state.new52}
          />
        </div>
      </div>
    );
  }
}
