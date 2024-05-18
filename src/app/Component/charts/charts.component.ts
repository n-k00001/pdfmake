import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import { ReportDataService } from '../../services/report-data.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent implements OnInit {

  data:any;
  dataamount:any[]=[];
  datayear:any[]=[];
  datacolor:any[]=[];
  databorder:any[]=[];


  constructor(private _ReportDataService:ReportDataService){}

  ngOnInit(): void {
    this._ReportDataService.getData().subscribe({
      next: res =>{
        this.data = res;
        for(let i=0; i<this.data.length; i++){
          this.datayear.push(this.data[i].year);
          this.datacolor.push(this.data[i].color);
          this.databorder.push(this.data[i].borderColor);
          this.dataamount.push(this.data[i].amount);
        }
        this.showChartData(this.datayear,this.dataamount,this.datacolor,this.databorder);
      }
    })
    
  }

  showChartData(datayear: any[], dataamount: any[], datacolor: any[], databorder: any[]){
    new Chart("myChart",
    {
      type: 'bar',
      data: {
        labels:datayear,
        datasets: [
          {
            label: 'Acquisitions by year',
            data: dataamount,
            borderWidth:1,
            backgroundColor:datacolor,
            borderColor:databorder
          }
        ]
      },
      options: {
        scales: {
          y:{
            beginAtZero: true
          }
        }
      }      
    });

    new Chart("myChartPolar",
    {
      type: 'polarArea',
      data: {
        labels:datayear,
        datasets: [
          {
            data: dataamount,
            
          }
        ]
      }, 
      options: {
        startAngle:50
      }    
    });
  }

  converttoPdf(){
    const content  = document.getElementById('convert') as HTMLElement;

    // Create a new PDF document
    let pdf = new jsPDF('p', 'mm', 'a4');

    // Add the first chart as an image to the PDF
    const chart1Image = document.querySelector('#myChart') as HTMLCanvasElement;
    pdf.addImage(chart1Image.toDataURL('image/png'), 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());

    // Add a new page to the PDF
    pdf.addPage();

    // Add the second chart as an image to the PDF
    const chart2Image = document.querySelector('#myChartPolar') as HTMLCanvasElement;
    pdf.addImage(chart2Image.toDataURL('image/png'), 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());

    // Save the PDF
    pdf.save('output.pdf');
  }
}
