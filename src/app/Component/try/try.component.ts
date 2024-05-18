import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ReportDataService } from '../../services/report-data.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-try',
  templateUrl: './try.component.html',
  styleUrls: ['./try.component.css']
})

export class TryComponent implements OnInit {
  companyName: string = '';
  fromDate: string = '';
  toDate: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  data:any;
  dataamount:any[]=[];
  datayear:any[]=[];
  datacolor:any[]=[];
  databorder:any[]=[];
  polarChart: any;
  barChart: any;

  constructor(private _ReportDataService:ReportDataService) {}

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
        console.log(this.data)
      }
    })
  }

  // async renderCharts(datayear: any[], dataamount: any[], datacolor: any[], databorder: any[]) {
  //   if (this.polarCanvas && this.barCanvas) {
  //     new Chart(this.polarCanvas.nativeElement, {
  //       type: 'polarArea',
  //       data: {
  //         labels: datayear,
  //         datasets: [
  //           {
  //             label: 'Acquisitions by year',
  //             data: dataamount,
  //             borderWidth: 1,
  //             backgroundColor: datacolor,
  //             borderColor: databorder
  //           }
  //         ]
  //       },
  //       options: {
  //         responsive: true,
  //         scales: {
  //           r: {
  //             angleLines: {
  //               display: false
  //             },
  //             suggestedMin: 0,
  //             suggestedMax: 600
  //           }
  //         }
  //       }
  //     });
  
  //     new Chart(this.barCanvas.nativeElement, {
  //       type: 'bar',
  //       data: {
  //         labels: datayear,
  //         datasets: [
  //           {
  //             label: 'Acquisitions by year',
  //             data: dataamount,
  //             borderWidth: 1,
  //             backgroundColor: datacolor,
  //             borderColor: databorder
  //           }
  //         ]
  //       },
  //       options: {
  //         scales: {
  //           y: {
  //             beginAtZero: true
  //           }
  //         }
  //       }
  //     });
  //   }
  // }
  async renderCharts(datayear: any[], dataamount: any[], datacolor: any[], databorder: any[]) {
    setTimeout(()=>{
      const polarCanvas = document.getElementById('polarCanvas') as HTMLCanvasElement;
      const barCanvas = document.getElementById('barCanvas') as HTMLCanvasElement;

      this.polarChart = new Chart(polarCanvas, {
        type: 'polarArea',
        data: {
        labels: datayear,
        datasets: [
          {
            label: 'Acquisitions by year',
            data: dataamount,
            borderWidth: 1,
            backgroundColor: datacolor,
            borderColor: databorder
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

      this.barChart = new Chart(barCanvas, {
        type: 'bar',
        data: {
          labels: datayear,
          datasets: [
            {
              label: 'Acquisitions by year',
              data: dataamount,
              borderWidth: 1,
              backgroundColor: datacolor,
              borderColor: databorder
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
    })
  }

  async convertToPdf() {
    await this.renderCharts(this.datayear, this.dataamount, this.datacolor, this.databorder);
    this.isLoading = true;
    this.errorMessage = '';
    setTimeout(async () => {
      const pdf = new jsPDF();
      try {
        const pages = ['page1', 'page2', 'page3','page4', 'page5'];
        for (const pageId of pages) {
          const page = document.getElementById(pageId);
          if (page) {
            const canvas = await html2canvas(page);
            const imgData = canvas.toDataURL('image/png');
            const imgHeight = canvas.height * 208 / canvas.width; // A4 size: 210mm x 297mm
            pdf.addImage(imgData, 'PNG', 0, 0, 215, imgHeight);
            if(pageId !== 'page5') pdf.addPage();
          } else {
            console.error(`Page with ID ${pageId} not found.`);
        }
      }
        // Save the PDF
        pdf.save('output.pdf');
        this.isLoading = false
      } catch (error) {
        console.error('Error converting to PDF:', error);
        this.isLoading = false;
      }
    },1000);
  }
}
