import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ReportDataService } from '../../services/report-data.service';

@Component({
  selector: 'app-page4',
  templateUrl: './page4.component.html',
  styleUrl: './page4.component.css'
})
export class Page4Component implements OnInit,AfterViewInit {
  @ViewChild('polarCanvas') polarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('page4') page4!: ElementRef;

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
      }
    })
    
  }
 
  ngAfterViewInit(): void {
    this.renderCharts(this.datayear,this.dataamount,this.datacolor,this.databorder);
  }

  renderCharts(datayear: any[], dataamount: any[], datacolor: any[], databorder: any[])
  {
    new Chart(this.polarCanvas.nativeElement, {
      type: 'polarArea',
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
        responsive: true,
        scales: {
          r: {
            angleLines: {
              display: false
            },
            suggestedMin: 0,
            suggestedMax: 600
          }
        }
      }
    });

    new Chart(this.barCanvas.nativeElement, {
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
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  

  generatePDF() {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const page4 = this.page4.nativeElement;

    html2canvas(page4).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm (210mm)
      const pageHeight = imgWidth * 1.414; // A4 ratio
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      position -= pageHeight;

      // Add more pages if needed
      while (position > -canvas.height) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        position -= pageHeight;
      }

      pdf.save('report.pdf');
    });
  }
}
