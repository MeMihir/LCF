import React, { Component } from "react";
import axios from "axios";
import Table from "./components/table/table";
import Sidebar from "./components/sidebar/sidebar";
import Particles from 'react-particles-js';
import "./App.scss";

export default class App extends Component {
  constructor(props) {
    super();
    this.state = {
      redline_bse: [],
      mainTable: [],
      close52: [],
      bse_close52: [],
      new52: [],
      bse_new52: [],
      showTable: "main",
    };
    this.preprocessData = this.preprocessData.bind(this);
    this.buildTable = this.buildTable.bind(this);
    this.showDetails = this.showDetails.bind(this);
    this.changeTable = this.changeTable.bind(this);
  }

  preprocessData(data) {
    data.sort(
      (a, b) =>
        -(a.fiftyTwoWeekLowPrice - a.current) / a.current +
        (b.fiftyTwoWeekLowPrice - b.current) / b.current
    );
    return data;
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
      diff: ((item.current - item.fiftyTwoWeekLowPrice) / item.current).toFixed(
        5
      ),
    }));
  }

  showDetails(id) {
    const company =
      this.state.showTable === "main"
        ? this.state.redline_bse[id]
        : this.state.showTable === "new52"
        ? this.state.bse_new52[id]
        : this.state.bse_close52[id];
    const url = `https://economictimes.indiatimes.com/${company.companyShortName
      .toLocaleLowerCase()
      .split(" ")
      .join("-")}/stocks/companyid-${company.companyId}.cms?layout=1`;

    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  }

  changeTable(table) {
    this.setState({
      showTable: table,
    });
  }

  async componentDidMount() {
    try {
      let bse_losers = await axios.get(
        "https://etmarketsapis.indiatimes.com/ET_Stats/losers?pagesize=1000&exchange=bse&pageno=1&sort=intraday&sortby=percentchange&sortorder=asc&duration=1d"
      );
      let bse_close52 = await axios.get(
        "https://etmarketsapis.indiatimes.com/ET_Stats/near52weekslow?pagesize=100&exchange=bse&pageno=1&sortby=percentgap&sortorder=asc"
      );
      let bse_new52 = await axios.get(
        "https://etmarketsapis.indiatimes.com/ET_Stats/new52weekslow?pageno=1&pagesize=100&sortby=percentchange&sortorder=asc&exchange=bse"
      );

      // const nse_losers = await axios.get(
      //   "https://etmarketsapis.indiatimes.com/ET_Stats/losers?pagesize=1000&exchange=nse&pageno=1&sort=intraday&sortby=percentchange&sortorder=asc&duration=1d"
      // );
      const redline_bse = bse_losers.data.searchresult;
      bse_losers = this.preprocessData(bse_losers.data.searchresult);
      const mainTable = this.buildTable(bse_losers);
      const close52 = this.buildTable(bse_close52.data.searchresult);
      const new52 = this.buildTable(bse_new52.data.searchresult);

      this.setState({
        redline_bse,
        mainTable,
        bse_close52:bse_close52.data.searchresult,
        close52,
        bse_new52:bse_new52.data.searchresult,
        new52,
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const particlesOptions = {
      particles: {
        number: {
          value: 100,
          density: {
            enable: true,
            value_area: 800
          }
        }
      }
    }

    return (
      <div className="App">
        <Particles params={particlesOptions} className='particles' />
        <Sidebar
          current={this.state.showTable}
          changeTable={this.changeTable}
        />
        <div className="content">
          {this.state.showTable === "main" ? (
            <div className="RedTable">
              <h1 className="header">Redline Table</h1>
              <Table
                headers={[
                  "Sr. No",
                  "Name",
                  "Open",
                  "Curr/Close",
                  "High",
                  "Low",
                  "Value",
                  "%",
                  "52 High",
                  "52 Low",
                  "Diff",
                ]}
                contents={this.state.mainTable}
                showDetails={this.showDetails}
              />
            </div>
          ) : null}
          {this.state.showTable === "close52" ? (
            <div className="close52">
              <h1 className="header">Close to 52 Week Low</h1>
              <Table
                headers={[
                  "Sr. No",
                  "Name",
                  "Open",
                  "Curr/ Close",
                  "High",
                  "Low",
                  "Value",
                  "%",
                  "52 High",
                  "52 Low",
                  "Diff",
                ]}
                contents={this.state.close52}
                showDetails={this.showDetails}
              />
            </div>
          ) : null}
          {this.state.showTable === "new52" ? (
            <div className="new52">
              <h1 className="header">New 52 Week Low</h1>
              <Table
                headers={[
                  "Sr. No",
                  "Name",
                  "Open",
                  "Curr/ Close",
                  "High",
                  "Low",
                  "Value",
                  "%",
                  "52 High",
                  "52 Low",
                  "Diff",
                ]}
                contents={this.state.new52}
                showDetails={this.showDetails}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
