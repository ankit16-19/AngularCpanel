import { NgModule} from '@angular/core';

import { AccordionModule } from 'ngx-bootstrap';


@NgModule ({
  imports: [
    AccordionModule.forRoot(),
  ],
  exports: [
    AccordionModule.forRoot(),
  ],
});

export class Bootstrap4Module { }
