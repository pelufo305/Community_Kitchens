import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];

    constructor() {
        this.sliders.push(
            {
                imagePath: 'assets/images/slider1.jpg',
                label: 'Ayudanos',
                text:
                    'Una persona "grande" es quien expande la definición de su ser para incluir a otros.'
            },
            {
                imagePath: 'assets/images/slider2.jpg',
                label: 'Solidaridad',
                text: 'Hemos venido a este mundo como hermanos; caminemos, pues, dándonos la mano y uno delante de otro.'
            }
        );
   }

    ngOnInit() {}

   
}
