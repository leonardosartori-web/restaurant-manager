import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {StatisticsService} from "../../services/statistics.service";
import {Statistic} from "../../models/Statistic";
import Chart from 'chart.js/auto';
import { ChartType } from 'chart.js';
import {User} from "../../models/User";
import {StaffService} from "../../services/staff.service";
import {SocketService} from "../../services/socket.service";

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit{
  public statistics_users: Statistic[] | any[] = [];
  public statistics_orders: any = {
    "orders_by_date": [],
    "orders_by_time": []
  };
  public statistics_tables: any = {
    "tablesOccupied": 0,
    "tablesNotOccupied": 0,
    "currentCustomers": 0,
    "capacityCustomers": 0,
    "numberOfTables": 0
  };
  public table_headers: string[] = ["user_email", "number_of_services"];
  public charts: any = {
    "profits": undefined,
    "tables": undefined,
    "hours": undefined
  };
  public current_user: User = {email: "", id: "", role: "", username: ""};
  public today_profit: number = 0;

  constructor(private userService : UserService, private statisticService : StatisticsService, private staffService : StaffService, private socketService : SocketService) {}

  ngOnInit(): void {
    this.get_statistics();
    this.get_socket_tables();
    this.get_socket_orders();
    this.createChart("tables", ["Occupied", "Not occupied"], [this.statistics_tables.tablesOccupied, this.statistics_tables.tablesNotOccupied], 'doughnut');
  }

  private get_statistics_users(): void {
    this.statisticService.get_statistics_users().subscribe({
      next: value => {
        console.log(value);
        this.statistics_users = value;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  private get_socket_orders(): void {
    this.socketService.get_updates('updateOrders').subscribe(() => {
      this.get_statistics_orders();
    });
  }

  private get_statistics_orders(): void {
    this.statisticService.get_statistics_orders().subscribe({
      next: value => {
        this.statistics_orders = value;
        let profit = value["orders_by_date"][new Date().toISOString().split('T')[0]];
        this.today_profit = profit !== undefined ? profit.toFixed(2) : 0.00;
        let time_labels = (new Array(24).fill(0).map((v,i) => `${i}`));
        let time_data = [];
        time_labels.forEach(l => {
          let tmp = this.statistics_orders.orders_by_time[l];
          time_data[l] = tmp !== undefined ? tmp : 0;
        })
        this.createChart("profits", Object.keys(this.statistics_orders.orders_by_date), Object.values(this.statistics_orders.orders_by_date), 'line');
        this.createChart("hours", time_labels, time_data, 'bar');
      },
      error: err => {
        console.log(err);
      }
    });
  }

  private get_socket_tables(): void {
    this.socketService.get_updates("updateTables").subscribe(() => {
      this.get_statistics_tables();
    });
  }

  private get_statistics_tables(): void {
    this.statisticService.get_statistics_tables().subscribe({
      next: value => {
        this.statistics_tables = value;
        this.updateChartData(this.charts.tables, [this.statistics_tables.tablesOccupied, this.statistics_tables.tablesNotOccupied]);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  private get_statistics(): void {
    this.get_statistics_users();
    this.get_statistics_orders();
    this.get_statistics_tables();
  }

  public set_current_user(email: string): void {
    this.staffService.get_user(email).subscribe({
      next: value => {
        this.current_user = value;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  public expected_turnout() {
    let hours_turnout = this.statistics_orders.orders_by_time;
    let now = new Date();
    let first_hour = now.getHours();
    let second_hour = first_hour + 1;
    let x = now.getHours();
    while ((hours_turnout[first_hour] <= 0 || hours_turnout[first_hour] === undefined) && first_hour - 1 !== x) {
      first_hour = (first_hour + 23) % 24;
    }
    while ((hours_turnout[second_hour] <= 0 || hours_turnout[second_hour] === undefined) && second_hour + 1 !== x) {
      second_hour = (second_hour + 1) % 24;
    }
    if (first_hour === second_hour) return hours_turnout[first_hour];
    return ((((hours_turnout[second_hour]-hours_turnout[first_hour]) * (x - first_hour) / (second_hour - first_hour)) + hours_turnout[first_hour]) * this.statistics_tables.capacityCustomers / this.statistics_tables.numberOfTables).toFixed(0);
  }

  private createChart(chart_id: string, labels: string[], data: any[], chartType: string): void {

    const type: ChartType = <"bar" | "line" | "scatter" | "bubble" | "pie" | "doughnut" | "polarArea" | "radar">chartType;

    this.charts[chart_id] = new Chart(chart_id, {
      type: type, //this denotes tha type of chart

      data: {// values on X-Axis
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        aspectRatio:1.5,
        responsive: true,
        plugins: {
          legend: {
            display: ((chartType === "doughnut" || chartType === "pie"))
          }
        },
        maintainAspectRatio: false
      }
    });
  }

  private updateChartData(chart, data) {
    chart.data.datasets[0].data = data;
    chart.update();
  }


}
